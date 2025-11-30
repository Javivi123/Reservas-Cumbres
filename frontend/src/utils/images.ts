// Utilidades para obtener las imágenes de las pistas y el logo

export const getSpaceImage = (spaceName: string, spaceType: string): string => {
  const name = spaceName.toLowerCase();
  const type = spaceType.toLowerCase();

  // Pista de césped
  if (type.includes('cesped') || name.includes('césped') || name.includes('cesped')) {
    return '/images/pistas/cesped.jpg';
  }

  // Pista multi
  if (type.includes('multi') || name.includes('multi')) {
    return '/images/pistas/multi.jpg';
  }

  // Pista de pádel
  if (type.includes('padel') || name.includes('pádel') || name.includes('padel')) {
    // Si es la primera pista de pádel, usar una imagen, si es la segunda, otra
    if (name.includes('1') || name.includes('uno')) {
      return '/images/pistas/padel-1.jpg';
    }
    if (name.includes('2') || name.includes('dos')) {
      return '/images/pistas/padel-2.jpg';
    }
    // Por defecto, usar la primera imagen de pádel
    return '/images/pistas/padel-1.jpg';
  }

  // Imagen por defecto
  return '/images/pistas/multi.jpg';
};

export const logoPath = '/images/logo/cumbres-logo.png';
export const campusImage1 = '/images/instalaciones/campus-1.jpg';
export const campusImage2 = '/images/instalaciones/campus-2.jpg';

