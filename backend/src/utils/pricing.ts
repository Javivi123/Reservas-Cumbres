import prisma from '../prisma/client';

export interface PricingResult {
  precioBase: number;
  precioLuz: number;
  precioTotal: number;
  luzIncluida: boolean;
}

export const calculatePrice = async (
  spaceId: string,
  isSpecialUser: boolean,
  luz: boolean
): Promise<PricingResult> => {
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
  });

  if (!space) {
    throw new Error('Pista no encontrada');
  }

  const precioBase = isSpecialUser ? space.precioEspecial : space.precioBase;
  const luzIncluida = space.luzIncluida;
  let precioLuz = 0;

  if (luz && !luzIncluida) {
    precioLuz = space.luzPrecio;
  }

  const precioTotal = precioBase + precioLuz;

  return {
    precioBase,
    precioLuz,
    precioTotal,
    luzIncluida,
  };
};

// Franjas horarias
export const FRANJAS_SEMANA = [
  '17:30-19:00',
  '19:00-20:30',
  '20:30-22:00',
];

export const FRANJAS_FINDE = [
  '8:00-9:30',
  '9:30-11:00',
  '11:00-12:30',
  '12:30-14:00',
  '14:00-15:30',
  '15:30-17:00',
  '17:00-18:30',
  '18:30-20:00',
];

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Domingo o Sábado
};

// Constante para la franja antigua de fin de semana (legacy)
export const FRANJA_LEGACY_FINDE = '8:00-20:00';

/**
 * Convierte una franja horaria a minutos desde medianoche
 * Ejemplo: '8:00-9:30' -> { start: 480, end: 570 }
 */
const parseTimeSlot = (franja: string): { start: number; end: number } | null => {
  const match = franja.match(/^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  
  const [, startHour, startMin, endHour, endMin] = match;
  const start = parseInt(startHour, 10) * 60 + parseInt(startMin, 10);
  const end = parseInt(endHour, 10) * 60 + parseInt(endMin, 10);
  
  return { start, end };
};

/**
 * Verifica si dos franjas horarias se solapan
 */
export const doTimeSlotsOverlap = (franja1: string, franja2: string): boolean => {
  // Si son iguales, se solapan
  if (franja1 === franja2) return true;
  
  const slot1 = parseTimeSlot(franja1);
  const slot2 = parseTimeSlot(franja2);
  
  if (!slot1 || !slot2) return false;
  
  // Se solapan si: start1 < end2 && start2 < end1
  return slot1.start < slot2.end && slot2.start < slot1.end;
};

export const isValidTimeSlot = (date: Date, franja: string): boolean => {
  if (isWeekend(date)) {
    // Fines de semana: solo las franjas de hora y media o la legacy
    return FRANJAS_FINDE.includes(franja) || franja === FRANJA_LEGACY_FINDE;
  }
  // Entre semana: solo las franjas fijas
  return FRANJAS_SEMANA.includes(franja);
};

