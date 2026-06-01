/**
 * Controller para interactuar con la API RAWG.
 * El frontend llama a estos endpoints para evitar CORS y proteger la API key.
 */

const RAWG_BASE_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.RAWG_API_KEY;

/**
 * Busca juegos en RAWG por nombre.
 * GET /api/rawg/search?q=zelda
 */
exports.searchGames = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters long' });
    }

    const url = `${RAWG_BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(q.trim())}&page_size=5`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('RAWG API error:', response.status, response.statusText);
      return res.status(502).json({ error: 'External API error' });
    }

    const data = await response.json();

    // Normalizamos la respuesta para el frontend
    const games = data.results.map((game) => ({
      id: game.id,
      name: game.name,
      metacriticScore: game.metacritic || null,
      hours: game.playtime || null,
      category: game.genres?.[0]?.name || '',
      genres: game.genres?.map((g) => g.name) || [],
      released: game.released,
      backgroundImage: game.background_image
    }));

    return res.json({ count: data.count, results: games });
  } catch (error) {
    console.error('Error searching RAWG:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
