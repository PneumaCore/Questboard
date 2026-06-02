require('dotenv').config();

const express = require('express');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const authRoutes = require('./routes/authRoutes');
const rawgRoutes = require('./routes/rawgRoutes');
const authenticateToken = require('./middlewares/authMiddleware');

const app = express();

// Normalizamos la variable FRONTEND_URL para evitar errores de CORS
// por barras finales, espacios, o comparaciones de strings.
// Soporta múltiples orígenes separados por comas (ej. dominio de preview + producción).
let allowedOrigin = process.env.FRONTEND_URL || true; // 'true' = permitir cualquier origen (solo en local/desarr)

if (typeof allowedOrigin === 'string') {
  const origins = allowedOrigin.split(',').map(url => url.trim().replace(/\/$/, ''));
  // Si solo hay uno, lo pasamos como string; si hay varios, como array.
  allowedOrigin = origins.length === 1 ? origins[0] : origins;
}

// Middleware CORS para permitir peticiones desde el frontend
// En producción, limita esto a tu dominio de Vercel para mayor seguridad
const corsOptions = {
  origin: allowedOrigin,
  credentials: false,
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
