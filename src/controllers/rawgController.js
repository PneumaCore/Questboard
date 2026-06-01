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

/**
 * Obtiene el detalle completo de un juego en RAWG por su ID.
 * GET /api/rawg/games/:id
 */
exports.getGameDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Valid RAWG game id is required' });
    }

    const url = `${RAWG_BASE_URL}/games/${id}?key=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error('RAWG API error:', response.status, response.statusText);
      return res.status(502).json({ error: 'External API error' });
    }

    const game = await response.json();

    // Normalizamos respuesta para el frontend
    const details = {
      rawgId: game.id,
      description: game.description_raw || game.description || null,
      platforms: game.platforms?.map((p) => p.platform?.name).filter(Boolean).join(', ') || null,
      releaseDate: game.released || null,
      developer: game.developers?.map((d) => d.name).filter(Boolean).join(', ') || null,
      publisher: game.publishers?.map((p) => p.name).filter(Boolean).join(', ') || null,
      ageRating: game.esrb_rating?.name || null
    };

    return res.json(details);
  } catch (error) {
    console.error('Error fetching RAWG game details:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
