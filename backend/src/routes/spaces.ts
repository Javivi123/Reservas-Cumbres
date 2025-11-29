import { Router } from 'express';
import prisma from '../prisma/client';
import { authenticate, requireAdmin } from '../middleware/auth';
import { updateSpaceSchema } from '../utils/validation';

const router = Router();

// Obtener todas las pistas
router.get('/', async (req, res) => {
  try {
    const spaces = await prisma.space.findMany({
      orderBy: { nombre: 'asc' },
    });
    res.json(spaces);
  } catch (error) {
    console.error('Error al obtener pistas:', error);
    res.status(500).json({ error: 'Error al obtener pistas' });
  }
});

// Obtener una pista específica
router.get('/:id', async (req, res) => {
  try {
    const space = await prisma.space.findUnique({
      where: { id: req.params.id },
    });

    if (!space) {
      return res.status(404).json({ error: 'Pista no encontrada' });
    }

    res.json(space);
  } catch (error) {
    console.error('Error al obtener pista:', error);
    res.status(500).json({ error: 'Error al obtener pista' });
  }
});

// Obtener disponibilidad de una pista en una fecha
router.get('/:id/availability', async (req, res) => {
  try {
    const { fecha } = req.query;
    if (!fecha) {
      return res.status(400).json({ error: 'Fecha requerida' });
    }

    const fechaDate = new Date(fecha as string);
    const space = await prisma.space.findUnique({
      where: { id: req.params.id },
    });

    if (!space) {
      return res.status(404).json({ error: 'Pista no encontrada' });
    }

    // Crear fechas sin modificar el objeto original (compatible con SQLite y MySQL)
    const fechaInicio = new Date(fechaDate);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaDate);
    fechaFin.setHours(23, 59, 59, 999);

    // Obtener reservas para esa fecha
    const reservations = await prisma.reservation.findMany({
      where: {
        spaceId: req.params.id,
        fecha: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        estado: {
          in: ['PRE_RESERVADA', 'RESERVADA', 'NO_DISPONIBLE'],
        },
      },
    });

    res.json({
      space,
      reservations,
      fecha: fechaDate,
    });
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
});

// Actualizar pista (solo admin)
router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = updateSpaceSchema.parse(req.body);

    const space = await prisma.space.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ message: 'Pista actualizada exitosamente', space });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Pista no encontrada' });
    }
    console.error('Error al actualizar pista:', error);
    res.status(500).json({ error: 'Error al actualizar pista' });
  }
});

export { router as spaceRoutes };

