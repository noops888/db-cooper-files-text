import { autoragConfig } from './autoragConfig';

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, statusText: 'Method Not Allowed' });
  }
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, statusText: 'Invalid JSON' });
  }
  const { query, max_num_results = 10, match_threshold = 0 } = data;
  console.log('[CHAT][SERVER] Raw request data:', JSON.stringify(data));
  console.log('[CHAT][SERVER] Parsed params:', { query, max_num_results, match_threshold });
  if (!query) {
    return new Response('Missing `query`', { status: 400, statusText: 'Missing query' });
  }
  try {
    const cfg = autoragConfig;
    // Prepare parameters for aiSearch
    const params = {
      query,
      include_retrieval_info: true,
      rewrite_query: cfg.rewrite_query,
      max_num_results: cfg.max_num_results,
      match_threshold: cfg.ranking_options.score_threshold,
      stream: cfg.stream
      // model: cfg.model,
      // filters: cfg.filters
    };
    console.log('[CHAT][SERVER] aiSearch params:', params);
    // perform AI search
    const aiResponse = await env.AI.autorag('db-cooper-autorag').aiSearch(params);
    if (cfg.stream) {
      console.log('[CHAT][SERVER] streaming enabled, fetching metadata for retrievals');
      // fetch non-streaming metadata for sources
      // metadata fetch: use configured threshold and rewrite settings
      const metaParams = { ...params, stream: false };
      const metaResult = await env.AI.autorag('db-cooper-autorag').aiSearch(metaParams);
      const retrievals = Array.isArray(metaResult.retrieval_info?.results)
        ? metaResult.retrieval_info.results
        : Array.isArray(metaResult.data)
          ? metaResult.data
          : [];
      console.log('[CHAT][SERVER] piping streaming response');
      const streamParams = { ...params, stream: true };
      const streamResponse = await env.AI.autorag('db-cooper-autorag').aiSearch(streamParams);
      // combine streams: emit retrievals first, then SSE events
      const composite = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          const metaChunk = JSON.stringify({ retrieval_info: { results: retrievals } });
          controller.enqueue(encoder.encode(`data: ${metaChunk}\n\n`));
          const reader = streamResponse.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) { controller.close(); break; }
            controller.enqueue(value);
          }
        }
      });
      return new Response(composite, { headers: { 'Content-Type': 'text/event-stream' } });
    }
    console.log('[CHAT][SERVER] aiSearch result:', JSON.stringify(aiResponse, null, 2));
    return new Response(JSON.stringify(aiResponse), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('AutoRAG aiSearch error:', err);
    return new Response(JSON.stringify({ response: err.message }), { headers: { 'Content-Type': 'application/json' } });
  }
}
