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

export const isValidTimeSlot = (date: Date, franja: string): boolean => {
  if (isWeekend(date)) {
    // Fines de semana: solo las franjas de hora y media
    return FRANJAS_FINDE.includes(franja);
  }
  // Entre semana: solo las franjas fijas
  return FRANJAS_SEMANA.includes(franja);
};

