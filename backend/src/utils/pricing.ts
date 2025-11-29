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

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Domingo o Sábado
};

export const isValidTimeSlot = (date: Date, franja: string): boolean => {
  if (isWeekend(date)) {
    // Fines de semana: cualquier hora entre 8-20h
    return true;
  }
  // Entre semana: solo las franjas fijas
  return FRANJAS_SEMANA.includes(franja);
};

