import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { registerSchema, loginSchema } from '../utils/validation';
import { sendWelcomeEmail } from '../utils/email';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Registro
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Verificar si el DNI ya existe
    const existingDni = await prisma.user.findUnique({
      where: { dni: data.dni },
    });

    if (existingDni) {
      return res.status(400).json({ error: 'El DNI ya está registrado' });
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        dni: data.dni,
        passwordHash,
        role: 'USER',
        specialRolePending: data.specialRole || false,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        specialRolePending: true,
      },
    });

    // Enviar email de bienvenida
    await sendWelcomeEmail(user.email, user.nombre);

    // Generar token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user,
      token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        specialRolePending: user.specialRolePending,
      },
      token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Obtener usuario actual
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        role: true,
        specialRolePending: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

export { router as authRoutes };

