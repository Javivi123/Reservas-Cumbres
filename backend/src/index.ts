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
const PORT_ENV = process.env.PORT || '3001';
const PORT = parseInt(PORT_ENV, 10);
if (isNaN(PORT) || PORT <= 0 || PORT > 65535) {
  console.error(`❌ Error: Puerto inválido "${PORT_ENV}". Debe ser un número entre 1 y 65535.`);
  console.error(`💡 Usando puerto por defecto: 3001`);
  process.exit(1);
}

// Middleware CORS - Permite todos los orígenes
app.use(cors({
  origin: true, // Permite cualquier origen
  credentials: true,
}));

// Log de requests para debugging (solo en desarrollo o si DEBUG=true)
if (process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'N/A'}`);
    next();
  });
}

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

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌐 Accesible desde cualquier interfaz de red (0.0.0.0:${PORT})`);
});

// Manejo de errores del servidor
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso`);
    console.error(`💡 Solución: Cierra el proceso que usa el puerto ${PORT} o cambia el puerto en .env`);
    process.exit(1);
  } else {
    console.error('❌ Error del servidor:', error);
    process.exit(1);
  }
});

// Manejo de señales para cierre limpio
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});
