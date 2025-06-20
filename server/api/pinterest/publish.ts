import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.pinId) {
    return { error: 'Missing pinId' };
  }

  const accessToken = body.access_token || '';

  if (!accessToken) {
    return { error: 'Missing access token' };
  }

  // 1. Récupérer les données du pin depuis Directus
  const pinRes = await $fetch(
    `https://api-affiliate-websites.com/items/pins/${body.pinId}`
  ).catch((err) => null);

  const pinData = pinRes?.data;

  if (
    !pinData ||
    !pinData.image_url ||
    !pinData.title ||
    !pinData.link_url ||
    !pinData.boards?.length
  ) {
    return { error: 'Informations incomplètes pour publier le pin.' };
  }

  // 2. Récupérer les boards disponibles depuis Pinterest
  const boardResponse = await fetch('https://api.pinterest.com/v5/boards', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const boardList = await boardResponse.json();

  if (!boardResponse.ok) {
    console.error('Erreur récupération des boards Pinterest:', boardList);
    return {
      statusCode: 500,
      error: 'Erreur lors de la récupération des boards Pinterest.',
    };
  }

  // 3. Associer les titres aux IDs
  const matchingBoards = boardList.items?.filter(
    (board: any) =>
      pinData.boards.includes(board.name) ||
      board.name === 'Ultimate Camping Gear & Tips'
  );

  if (!matchingBoards.length) {
    return {
      error: 'Aucun board correspondant trouvé pour les titres fournis.',
    };
  }

  const results = [];

  for (const board of matchingBoards) {
    const pinterestBody = {
      board_id: board.id,
      title: pinData.title,
      alt_text: pinData.description || '',
      link: pinData.link_url,
      media_source: {
        source_type: 'image_url',
        url: `https://api-affiliate-websites.com/assets/${pinData.image_url}`,
      },
    };

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
      console.error(`Erreur publication dans le board ${board.name}:`, data);
      results.push({
        board: board.name,
        success: false,
        error: data.message || 'Erreur inconnue',
      });
    } else {
      results.push({
        board: board.name,
        success: true,
        pinterest_id: data.id,
      });
    }
  }
  const hasError = results.some((a) => !a.success);

  await $fetch(`https://api-affiliate-websites.com/items/pins/${body.pinId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: hasError ? 'error' : 'published',
    }),
  }).catch((err) => {
    console.error(
      'Erreur lors de la mise à jour du statut dans Directus :',
      err
    );
  });

  return {
    message: 'Publication terminée.',
    results,
  };
});
