import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.pinId) {
    return { error: 'Missing pinId' };
  }

  const config = useRuntimeConfig();
  const accessToken = body.access_token || ''; // Idéalement tu stockes ce token dans un cookie ou en session (ex: NitroSession)

  if (!accessToken) {
    return { error: 'Missing access token' };
  }

  // 🔁 1. Récupérer les données du pin depuis Directus
  const pinRes = await $fetch(
    `https://api-affiliate-websites.com/items/pins/${body.pinId}`
  ).catch((err) => null);
  const pinData = pinRes?.data;

  console.log('pin', pinData);
  if (!pinData || !pinData.image_url || !pinData.title || !pinData.link_url) {
    return { error: 'Informations incomplètes pour publier le pin.' };
  }

  // 🔁 2. Construire le body Pinterest
  const pinterestBody = {
    board_id: config.pinterestBoardId, // ou body.board_id si c'est dynamique
    title: pinRes.title,
    alt_text: pinRes.description || '',
    link: pinRes.link_url,
    media_source: {
      source_type: 'image_url',
      url: `https://api-affiliate-websites.com/assets/${pinRes.image_url}`,
    },
  };

  // 🔁 3. Envoyer vers Pinterest
  const res = await fetch('https://api.pinterest.com/v5/pins', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pinterestBody),
  });

  const data = await res.json();

  if (!res.ok) {
    const errMsg = data.message || 'Erreur inconnue de Pinterest';
    console.error('Pinterest publish error:', data);
    return {
      statusCode: 500,
      error: errMsg,
    };
  }

  return {
    message: 'Pin publié avec succès !',
    pinterest_id: data.id,
  };
});
