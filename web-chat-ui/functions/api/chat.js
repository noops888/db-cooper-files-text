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
    console.log('[CHAT][SERVER] aiSearch params:', { query, include_retrieval_info: true, rewrite_query: true, max_num_results, match_threshold });
    const cfg = autoragConfig;
    const result = await env.AI.autorag('db-cooper-autorag').aiSearch({
      query,
      include_retrieval_info: true,
      rewrite_query: cfg.rewrite_query,
      max_num_results: cfg.max_num_results,
      match_threshold: cfg.ranking_options.score_threshold,
      stream: cfg.stream
      // model: cfg.model,
      // filters: cfg.filters
    });
    console.log('[CHAT][SERVER] aiSearch result:', JSON.stringify(result, null, 2));
    return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('AutoRAG aiSearch error:', err);
    return new Response(JSON.stringify({ response: err.message }), { headers: { 'Content-Type': 'application/json' } });
  }
}
