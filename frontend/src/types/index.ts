export interface User {
  id: string;
  nombre: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'SPECIAL_USER';
  specialRolePending?: boolean;
}

export interface Space {
  id: string;
  nombre: string;
  tipo: string;
  precioBase: number;
  precioEspecial: number;
  luzPrecio: number;
  luzIncluida: boolean;
  disponible: boolean;
}

export interface Reservation {
  id: string;
  userId: string;
  spaceId: string;
  fecha: string;
  franja: string;
  estado: 'LIBRE' | 'PRE_RESERVADA' | 'RESERVADA' | 'NO_DISPONIBLE';
  precioTotal: number;
  luz: boolean;
  createdAt: string;
  updatedAt: string;
  space?: Space;
  user?: User;
  payment?: Payment;
}

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  comprobanteUrl?: string;
  motivoRechazo?: string;
  numeroCuenta: string;
}

export interface Log {
  id: string;
  reservationId?: string;
  action: string;
  userId?: string;
  detalles?: string;
  timestamp: string;
  user?: User;
  reservation?: Reservation;
}

