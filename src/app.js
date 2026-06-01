require('dotenv').config();

const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');
const authenticateToken = require('./middlewares/authMiddleware');

const app = express();

// Middleware CORS para permitir peticiones desde el frontend
app.use(cors());

// Middleware para parsear cuerpos JSON
app.use(express.json());

// Rutas de autenticacion (publicas)
app.use('/api/auth', authRoutes);

// Rutas de juegos (protegidas por autenticacion JWT)
app.use('/api/games', authenticateToken, gameRoutes);

// Manejador simple para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
