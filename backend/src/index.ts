import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { authRoutes } from './routes/auth';
import { reservationRoutes } from './routes/reservations';
import { spaceRoutes } from './routes/spaces';
import { adminRoutes } from './routes/admin';
import { userRoutes } from './routes/users';
import { legalRoutes } from './routes/legal';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (comprobantes de pago)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Reservas Cumbres',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      reservations: '/api/reservations',
      spaces: '/api/spaces',
      admin: '/api/admin',
      users: '/api/users',
      legal: '/api/legal',
    },
    documentation: 'Ver README.md para más información',
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/legal', legalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌐 Accesible desde cualquier interfaz de red (0.0.0.0:${PORT})`);
});

