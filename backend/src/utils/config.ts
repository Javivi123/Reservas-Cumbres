/**
 * Configuración de la aplicación desde variables de entorno
 * Valores sensibles como números de cuenta, Bizum y teléfonos deben estar en .env
 */

// Número de Bizum para pagos
export const BIZUM_NUMBER = process.env.BIZUM_NUMBER || '12345';

// Teléfono de contacto del colegio
export const CONTACT_PHONE = process.env.CONTACT_PHONE || '961393959';

// Validación en producción
if (process.env.NODE_ENV === 'production') {
  if (BIZUM_NUMBER === '12345') {
    console.warn('⚠️  ADVERTENCIA: BIZUM_NUMBER está usando el valor por defecto (12345). Configura BIZUM_NUMBER en las variables de entorno.');
  }
  if (CONTACT_PHONE === '961393959') {
    console.warn('⚠️  ADVERTENCIA: CONTACT_PHONE está usando el valor por defecto. Verifica que CONTACT_PHONE esté configurado correctamente.');
  }
}

// Configuración pública (valores que se pueden exponer al frontend)
export const getPublicConfig = () => ({
  bizumNumber: BIZUM_NUMBER,
  contactPhone: CONTACT_PHONE,
});
