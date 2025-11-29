import { Router } from 'express';
import prisma from '../prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Obtener perfil del usuario actual
router.get('/profile', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        dni: true,
        role: true,
        specialRolePending: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// Enviar mensaje de contacto/soporte
router.post('/contact', authenticate, async (req: AuthRequest, res) => {
  try {
    const { asunto, mensaje } = req.body;

    if (!asunto || !mensaje) {
      return res.status(400).json({ error: 'Asunto y mensaje son requeridos' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Simular envío de email a soporte
    console.log('📧 Mensaje de contacto recibido:');
    console.log(`De: ${user.email} (${user.nombre})`);
    console.log(`Asunto: ${asunto}`);
    console.log(`Mensaje: ${mensaje}`);
    console.log('---');

    res.json({
      message: 'Mensaje enviado exitosamente. Te responderemos pronto.',
    });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

export { router as userRoutes };

