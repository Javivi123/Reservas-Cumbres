import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import prisma from '../prisma/client';
import { reservationSchema } from '../utils/validation';
import { calculatePrice, isValidTimeSlot } from '../utils/pricing';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth';
import {
  sendReservationCreatedEmail,
  sendReservationApprovedEmail,
  sendReservationRejectedEmail,
} from '../utils/email';

const router = Router();

// Configurar multer para subir archivos
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'comprobante-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten archivos JPEG, PNG o PDF'));
  },
});

// Crear reserva
router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const data = reservationSchema.parse(req.body);
    const fecha = new Date(data.fecha);

    // Validar que la fecha no sea pasada
    if (fecha < new Date()) {
      return res.status(400).json({ error: 'No se pueden reservar fechas pasadas' });
    }

    // Validar franja horaria
    if (!isValidTimeSlot(fecha, data.franja)) {
      return res.status(400).json({ error: 'Franja horaria inválida' });
    }

    // Verificar si ya existe una reserva para esa pista, fecha y franja
    const existingReservation = await prisma.reservation.findUnique({
      where: {
        spaceId_fecha_franja: {
          spaceId: data.spaceId,
          fecha,
          franja: data.franja,
        },
      },
    });

    if (existingReservation && existingReservation.estado !== 'LIBRE') {
      return res.status(400).json({ error: 'Esta franja ya está reservada' });
    }

    // Obtener usuario para verificar si es especial
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isSpecialUser = user.role === 'SPECIAL_USER';
    const pricing = await calculatePrice(data.spaceId, isSpecialUser, data.luz || false);

    // Crear reserva
    const reservation = await prisma.reservation.create({
      data: {
        userId: req.userId!,
        spaceId: data.spaceId,
        fecha,
        franja: data.franja,
        estado: 'PRE_RESERVADA',
        precioTotal: pricing.precioTotal,
        luz: data.luz || false,
      },
    });

    // Crear pago
    const payment = await prisma.payment.create({
      data: {
        reservationId: reservation.id,
        amount: pricing.precioTotal,
        status: 'PENDIENTE',
      },
    });

    // Crear log
    await prisma.log.create({
      data: {
        reservationId: reservation.id,
        action: 'created',
        userId: req.userId,
        detalles: JSON.stringify({ precioTotal: pricing.precioTotal }),
      },
    });

    // Enviar email
    await sendReservationCreatedEmail(
      user.email,
      user.nombre,
      reservation.id,
      payment.numeroCuenta,
      pricing.precioTotal
    );

    res.status(201).json({
      message: 'Reserva creada exitosamente. Realiza el pago para completar la solicitud.',
      reservation: {
        ...reservation,
        payment: {
          numeroCuenta: payment.numeroCuenta,
          amount: payment.amount,
        },
        pricing,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error al crear reserva:', error);
    res.status(500).json({ error: 'Error al crear reserva' });
  }
});

// Subir comprobante de pago
router.post(
  '/:id/comprobante',
  authenticate,
  upload.single('comprobante'),
  async (req: AuthRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
      }

      const reservation = await prisma.reservation.findUnique({
        where: { id: req.params.id },
        include: { payment: true, user: true },
      });

      if (!reservation) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      if (reservation.userId !== req.userId) {
        return res.status(403).json({ error: 'No tienes permiso para esta reserva' });
      }

      if (reservation.estado !== 'PRE_RESERVADA') {
        return res.status(400).json({ error: 'Esta reserva no está en estado pre-reservada' });
      }

      // Actualizar pago con comprobante
      const comprobanteUrl = `/uploads/${req.file.filename}`;
      await prisma.payment.update({
        where: { reservationId: reservation.id },
        data: { comprobanteUrl },
      });

      // Crear log
      await prisma.log.create({
        data: {
          reservationId: reservation.id,
          action: 'comprobante_uploaded',
          userId: req.userId,
          detalles: JSON.stringify({ comprobanteUrl }),
        },
      });

      res.json({
        message: 'Comprobante subido exitosamente. Tu solicitud será revisada por un administrador.',
      });
    } catch (error) {
      console.error('Error al subir comprobante:', error);
      res.status(500).json({ error: 'Error al subir comprobante' });
    }
  }
);

// Obtener mis reservas
router.get('/my-reservations', authenticate, async (req: AuthRequest, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.userId },
      include: {
        space: true,
        payment: true,
      },
      orderBy: { fecha: 'desc' },
    });

    res.json(reservations);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// Obtener una reserva específica
router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: {
        space: true,
        payment: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    if (reservation.userId !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ error: 'No tienes permiso para ver esta reserva' });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({ error: 'Error al obtener reserva' });
  }
});

// Aprobar/Rechazar reserva (solo admin)
router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { estado, motivoRechazo } = req.body;

      if (!['RESERVADA', 'LIBRE'].includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
      }

      const reservation = await prisma.reservation.findUnique({
        where: { id: req.params.id },
        include: { payment: true, user: true },
      });

      if (!reservation) {
        return res.status(404).json({ error: 'Reserva no encontrada' });
      }

      // Actualizar estado de reserva y pago
      const newEstado = estado === 'RESERVADA' ? 'RESERVADA' : 'LIBRE';
      const paymentStatus = estado === 'RESERVADA' ? 'APROBADO' : 'RECHAZADO';

      await prisma.reservation.update({
        where: { id: reservation.id },
        data: { estado: newEstado },
      });

      await prisma.payment.update({
        where: { reservationId: reservation.id },
        data: {
          status: paymentStatus,
          motivoRechazo: motivoRechazo || null,
        },
      });

      // Crear log
      await prisma.log.create({
        data: {
          reservationId: reservation.id,
          action: estado === 'RESERVADA' ? 'approved' : 'rejected',
          userId: req.userId,
          detalles: JSON.stringify({ motivoRechazo }),
        },
      });

      // Enviar email
      if (estado === 'RESERVADA') {
        await sendReservationApprovedEmail(
          reservation.user.email,
          reservation.user.nombre,
          reservation.id
        );
      } else {
        await sendReservationRejectedEmail(
          reservation.user.email,
          reservation.user.nombre,
          reservation.id,
          motivoRechazo || 'Pago no verificado'
        );
      }

      res.json({
        message: estado === 'RESERVADA' ? 'Reserva aprobada' : 'Reserva rechazada',
      });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ error: 'Error al actualizar estado' });
    }
  }
);

// Eliminar reserva (solo si está rechazada o la fecha ya pasó)
router.delete('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: req.params.id },
      include: { payment: true },
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    // Solo el dueño puede borrar su reserva
    if (reservation.userId !== req.userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta reserva' });
    }

    // Solo se puede borrar si está rechazada o la fecha ya pasó
    const fechaReserva = new Date(reservation.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaReserva.setHours(0, 0, 0, 0);

    const puedeBorrar = 
      reservation.estado === 'LIBRE' || 
      reservation.payment?.status === 'RECHAZADO' ||
      fechaReserva < hoy;

    if (!puedeBorrar) {
      return res.status(400).json({ 
        error: 'Solo puedes eliminar reservas rechazadas o con fecha pasada' 
      });
    }

    // Eliminar reserva (los pagos y logs se eliminan en cascada)
    await prisma.reservation.delete({
      where: { id: reservation.id },
    });

    // Crear log
    await prisma.log.create({
      data: {
        action: 'deleted',
        userId: req.userId,
        detalles: JSON.stringify({ reservationId: reservation.id }),
      },
    });

    res.json({ message: 'Reserva eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    res.status(500).json({ error: 'Error al eliminar reserva' });
  }
});

export { router as reservationRoutes };

