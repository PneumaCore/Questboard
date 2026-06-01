const prisma = require('../lib/prisma');

// Calcula la prioridad al vuelo; evita division por cero devolviendo null
const calculatePriority = (metacriticScore, hours) => {
  if (!hours || hours <= 0) return null;
  return metacriticScore / hours;
};

// Construye la respuesta de un juego incluyendo el campo calculado priority
const buildGameResponse = (game) => ({
  ...game,
  priority: calculatePriority(game.metacriticScore, game.hours)
});

// POST /api/games - Crear un nuevo juego asociado al usuario autenticado
exports.createGame = async (req, res) => {
  try {
    const { name, category, hours, metacriticScore, tags, coverImage } = req.body;
    const userId = req.user.userId;

    if (!name || !category || hours === undefined || metacriticScore === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name, category, hours, metacriticScore' });
    }

    const parsedHours = parseFloat(hours);
    const parsedScore = parseInt(metacriticScore, 10);

    if (isNaN(parsedHours) || isNaN(parsedScore)) {
      return res.status(400).json({ error: 'Hours and metacriticScore must be valid numbers' });
    }

    const data = {
      name,
      category,
      hours: parsedHours,
      metacriticScore: parsedScore,
      userId
    };

    if (coverImage !== undefined) data.coverImage = coverImage;

    if (Array.isArray(tags) && tags.length > 0) {
      data.tags = {
        connectOrCreate: tags.map((tagName) => ({
          where: { name: tagName },
          create: { name: tagName }
        }))
      };
    }

    const game = await prisma.game.create({
      data,
      include: { tags: true }
    });

    return res.status(201).json(buildGameResponse(game));
  } catch (error) {
    console.error('Error creating game:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/games - Listar SOLO los juegos del usuario autenticado con filtros y ordenacion
exports.listGames = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { sortBy, order, tags, name, category } = req.query;

    const where = { userId };

    if (name) {
      where.name = { contains: name };
    }

    if (category) {
      where.category = { contains: category };
    }

    if (tags) {
      const tagList = tags.split(',');
      where.tags = {
        some: {
          name: { in: tagList }
        }
      };
    }

    let orderBy = {};
    if (sortBy) {
      const allowedFields = ['metacriticScore', 'completed'];
      if (allowedFields.includes(sortBy)) {
        orderBy[sortBy] = order === 'desc' ? 'desc' : 'asc';
      }
    }

    const games = await prisma.game.findMany({
      where,
      orderBy: Object.keys(orderBy).length > 0 ? orderBy : undefined,
      include: { tags: true }
    });

    const gamesWithPriority = games.map(buildGameResponse);

    return res.json(gamesWithPriority);
  } catch (error) {
    console.error('Error listing games:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/games/:id - Obtener un juego especifico del usuario autenticado
exports.getGameById = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (isNaN(gameId)) {
      return res.status(400).json({ error: 'Invalid game id' });
    }

    const game = await prisma.game.findFirst({
      where: { id: gameId, userId },
      include: { tags: true }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found or access denied' });
    }

    return res.json(buildGameResponse(game));
  } catch (error) {
    console.error('Error fetching game:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/games/:id - Obtener un juego especifico del usuario autenticado
exports.getGameById = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (isNaN(gameId)) {
      return res.status(400).json({ error: 'Invalid game id' });
    }

    const game = await prisma.game.findFirst({
      where: { id: gameId, userId },
      include: { tags: true }
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found or access denied' });
    }

    return res.json(buildGameResponse(game));
  } catch (error) {
    console.error('Error fetching game:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/games/:id - Editar un juego del usuario autenticado
exports.updateGame = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (isNaN(gameId)) {
      return res.status(400).json({ error: 'Invalid game id' });
    }

    // Verificar que el juego pertenezca al usuario autenticado
    const existingGame = await prisma.game.findFirst({
      where: { id: gameId, userId }
    });

    if (!existingGame) {
      return res.status(404).json({ error: 'Game not found or access denied' });
    }

    const { name, category, hours, metacriticScore, completed, completedAt, notes, rating, tags } = req.body;

    const data = {};

    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (hours !== undefined) {
      const parsedHours = parseFloat(hours);
      if (isNaN(parsedHours)) {
        return res.status(400).json({ error: 'Hours must be a valid number' });
      }
      data.hours = parsedHours;
    }

    if (metacriticScore !== undefined) {
      const parsedScore = parseInt(metacriticScore, 10);
      if (isNaN(parsedScore)) {
        return res.status(400).json({ error: 'metacriticScore must be a valid number' });
      }
      data.metacriticScore = parsedScore;
    }
    if (completed !== undefined) data.completed = completed;
    if (completedAt !== undefined) data.completedAt = completedAt;
    if (notes !== undefined) data.notes = notes;

    if (rating !== undefined) {
      const parsedRating = parseInt(rating, 10);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
      }
      data.rating = parsedRating;
    }

    if (Array.isArray(tags)) {
      // Asegura que las etiquetas existan en la base de datos
      await Promise.all(
        tags.map((tagName) =>
          prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName }
          })
        )
      );

      // Reemplaza las etiquetas existentes por las nuevas
      data.tags = {
        set: tags.map((tagName) => ({ name: tagName }))
      };
    }

    const game = await prisma.game.update({
      where: { id: gameId },
      data,
      include: { tags: true }
    });

    return res.json(buildGameResponse(game));
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Game not found' });
    }
    console.error('Error updating game:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/games/:id - Eliminar un juego del usuario autenticado
exports.deleteGame = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (isNaN(gameId)) {
      return res.status(400).json({ error: 'Invalid game id' });
    }

    // Verificar que el juego pertenezca al usuario autenticado
    const existingGame = await prisma.game.findFirst({
      where: { id: gameId, userId }
    });

    if (!existingGame) {
      return res.status(404).json({ error: 'Game not found or access denied' });
    }

    await prisma.game.delete({
      where: { id: gameId }
    });

    return res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Game not found' });
    }
    console.error('Error deleting game:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/games/:id/complete - Marcar juego como completado del usuario autenticado
exports.completeGame = async (req, res) => {
  try {
    const gameId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (isNaN(gameId)) {
      return res.status(400).json({ error: 'Invalid game id' });
    }

    // Verificar que el juego pertenezca al usuario autenticado
    const existingGame = await prisma.game.findFirst({
      where: { id: gameId, userId }
    });

    if (!existingGame) {
      return res.status(404).json({ error: 'Game not found or access denied' });
    }

    const { notes, rating } = req.body;

    const data = {
      completed: true,
      completedAt: new Date()
    };

    if (notes !== undefined) data.notes = notes;

    if (rating !== undefined) {
      const parsedRating = parseInt(rating, 10);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
      }
      data.rating = parsedRating;
    }

    const game = await prisma.game.update({
      where: { id: gameId },
      data,
      include: { tags: true }
    });

    return res.json(buildGameResponse(game));
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Game not found' });
    }
    console.error('Error completing game:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
