require('dotenv').config();

const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');
const rawgRoutes = require('./routes/rawgRoutes');
const authenticateToken = require('./middlewares/authMiddleware');

const app = express();

// Middleware CORS para permitir peticiones desde el frontend
// En producción, limita esto a tu dominio de Vercel para mayor seguridad
const corsOptions = {
  origin: process.env.FRONTEND_URL || true, // 'true' permite cualquier origen si no está definida la variable
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Middleware para parsear cuerpos JSON
app.use(express.json());

// Rutas de autenticacion (publicas)
app.use('/api/auth', authRoutes);

// Rutas de juegos (protegidas por autenticacion JWT)
app.use('/api/games', authenticateToken, gameRoutes);

// Rutas RAWG (protegidas por autenticacion JWT)
app.use('/api/rawg', authenticateToken, rawgRoutes);

// Manejador simple para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
