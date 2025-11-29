import { z } from 'zod';

export const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  dni: z.string().regex(/^\d{8}[A-Z]$/, 'DNI inválido (formato: 12345678A)'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  specialRole: z.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const reservationSchema = z.object({
  spaceId: z.string().uuid('ID de pista inválido'),
  fecha: z.string().refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida'),
  franja: z.string().min(1, 'Franja horaria requerida'),
  luz: z.boolean().optional(),
  dni: z.string().optional(),
});

export const updateReservationStatusSchema = z.object({
  estado: z.enum(['LIBRE', 'PRE_RESERVADA', 'RESERVADA', 'NO_DISPONIBLE']),
  motivoRechazo: z.string().optional(),
});

export const updateSpaceSchema = z.object({
  nombre: z.string().min(1).optional(),
  precioBase: z.number().positive().optional(),
  precioEspecial: z.number().positive().optional(),
  luzPrecio: z.number().nonnegative().optional(),
  luzIncluida: z.boolean().optional(),
  disponible: z.boolean().optional(),
});

export const approveSpecialRoleSchema = z.object({
  aprobar: z.boolean(),
  comentario: z.string().optional(),
});

