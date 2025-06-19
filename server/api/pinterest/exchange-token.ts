export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body.code) return { error: 'Missing code parameter' };

  const config = useRuntimeConfig();
  const basicToken = Buffer.from(
    `${config.pinterestClientId}:${config.pinterestClientSecret}`
  ).toString('base64');

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', body.code);
  params.append(
    'redirect_uri',
    'https://www.camp-venture.com/pinterest-callback'
  );

  const res = await fetch('https://api.pinterest.com/v5/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await res.json();
  if (!res.ok) return { error: data.message || 'Unknown error' };
  return data;
});
