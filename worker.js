export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/messages' && request.method === 'POST') {
      if (!env.ANTHROPIC_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'ANTHROPIC_API_KEY secret is not configured on the Worker.' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const body = await request.text();

      const upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body,
      });

      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
