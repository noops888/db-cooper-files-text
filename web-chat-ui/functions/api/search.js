// Separate AutoRAG retrieval endpoint for debugging
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
  const { query, top_k = 5 } = data;
  if (!query) {
    return new Response('Missing `query`', { status: 400, statusText: 'Missing query' });
  }
  try {
    const result = await env.AI.autorag('db-cooper-autorag').search({ query, top_k });
    return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('AutoRAG search error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
