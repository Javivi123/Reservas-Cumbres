import { Router } from 'express';
import prisma from '../prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { approveSpecialRoleSchema } from '../utils/validation';

const router = Router();

// Todas las rutas requieren autenticación y rol admin
router.use(authenticate);
router.use(requireAdmin);

// Obtener todas las reservas con filtros
router.get('/reservations', async (req: AuthRequest, res) => {
  try {
    const { estado, fechaDesde, fechaHasta, spaceId, page = '1', limit = '20' } = req.query;

    const where: any = {};

    if (estado) {
      where.estado = estado;
    }

    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) {
        where.fecha.gte = new Date(fechaDesde as string);
      }
      if (fechaHasta) {
        where.fecha.lte = new Date(fechaHasta as string);
      }
    }

    if (spaceId) {
      where.spaceId = spaceId;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              nombre: true,
              email: true,
              dni: true,
            },
          },
          space: true,
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.reservation.count({ where }),
    ]);

    res.json({
      reservations,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// Obtener reporte de ingresos
router.get('/reports/revenue', async (req: AuthRequest, res) => {
  try {
    const { fechaDesde, fechaHasta, spaceId } = req.query;

    const where: any = {
      estado: 'RESERVADA',
      payment: {
        status: 'APROBADO',
      },
    };

    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) {
        where.fecha.gte = new Date(fechaDesde as string);
      }
      if (fechaHasta) {
        where.fecha.lte = new Date(fechaHasta as string);
      }
    }

    if (spaceId) {
      where.spaceId = spaceId;
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        space: true,
        payment: true,
      },
    });

    const total = reservations.reduce((sum: number, r: any) => sum + r.precioTotal, 0);

    // Agrupar por pista
    const bySpace = reservations.reduce((acc: any, r: any) => {
      const spaceName = r.space.nombre;
      if (!acc[spaceName]) {
        acc[spaceName] = { total: 0, count: 0 };
      }
      acc[spaceName].total += r.precioTotal;
      acc[spaceName].count += 1;
      return acc;
    }, {});

    res.json({
      total,
      totalReservas: reservations.length,
      porPista: bySpace,
      periodo: {
        desde: fechaDesde || null,
        hasta: fechaHasta || null,
      },
    });
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({ error: 'Error al obtener reporte' });
  }
});

// Obtener usuarios pendientes de aprobación de rol especial
router.get('/users/pending-special', async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        specialRolePending: true,
        role: 'USER',
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        dni: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios pendientes:', error);
    res.status(500).json({ error: 'Error al obtener usuarios pendientes' });
  }
});

// Aprobar/Rechazar rol especial
router.patch('/users/:id/special-role', async (req: AuthRequest, res) => {
  try {
    const data = approveSpecialRoleSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (data.aprobar) {
      await prisma.user.update({
        where: { id: req.params.id },
        data: {
          role: 'SPECIAL_USER',
          specialRolePending: false,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: req.params.id },
        data: {
          specialRolePending: false,
        },
      });
    }

    res.json({
      message: data.aprobar
        ? 'Rol especial aprobado'
        : 'Solicitud de rol especial rechazada',
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
});

// Obtener logs
router.get('/logs', async (req: AuthRequest, res) => {
  try {
    const { reservationId, action, page = '1', limit = '50' } = req.query;

    const where: any = {};
    if (reservationId) {
      where.reservationId = reservationId;
    }
    if (action) {
      where.action = action;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
          reservation: {
            include: {
              space: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.log.count({ where }),
    ]);

    res.json({
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error al obtener logs:', error);
    res.status(500).json({ error: 'Error al obtener logs' });
  }
});

// Exportar reservas a CSV
router.get('/export/reservations', async (req: AuthRequest, res) => {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    const where: any = {};
    if (fechaDesde || fechaHasta) {
      where.fecha = {};
      if (fechaDesde) {
        where.fecha.gte = new Date(fechaDesde as string);
      }
      if (fechaHasta) {
        where.fecha.lte = new Date(fechaHasta as string);
      }
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: {
          select: {
            nombre: true,
            email: true,
            dni: true,
          },
        },
        space: true,
        payment: true,
      },
      orderBy: { fecha: 'asc' },
    });

    // Generar CSV
    const headers = [
      'ID',
      'Fecha',
      'Franja',
      'Pista',
      'Usuario',
      'Email',
      'DNI',
      'Estado',
      'Precio Total',
      'Luz',
      'Estado Pago',
      'Fecha Creación',
    ];

    const rows = reservations.map((r: any) => [
      r.id,
      r.fecha.toISOString().split('T')[0],
      r.franja,
      r.space.nombre,
      r.user.nombre,
      r.user.email,
      r.user.dni,
      r.estado,
      r.precioTotal.toString(),
      r.luz ? 'Sí' : 'No',
      r.payment?.status || 'N/A',
      r.createdAt.toISOString(),
    ]);

    const csv = [headers.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=reservas.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error al exportar reservas:', error);
    res.status(500).json({ error: 'Error al exportar reservas' });
  }
});

export { router as adminRoutes };

