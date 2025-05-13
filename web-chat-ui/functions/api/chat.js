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

  const { query } = data;
  if (!query) {
    return new Response('Missing `query`', { status: 400, statusText: 'Missing query' });
  }

  // Non-streaming AI response via AutoRAG (with capacity-error fallback)
  let result;
  try {
    result = await env.AI.autorag('db-cooper-autorag').aiSearch({
      query,
      include_retrieval_info: true
    });
  } catch (err) {
    return new Response(JSON.stringify({ response: 'Capacity temporarily exceeded, please try again later.' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
}
