// Simulación de envío de emails
// En producción, usar un servicio como SendGrid, Resend, o AWS SES

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<void> => {
  // Simulación: en producción aquí se enviaría el email real
  console.log('📧 Email enviado:');
  console.log(`Para: ${to}`);
  console.log(`Asunto: ${subject}`);
  console.log(`Contenido: ${html}`);
  console.log('---');
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 100));
};

export const sendWelcomeEmail = async (email: string, nombre: string) => {
  const html = `
    <h1>¡Bienvenido a Reservas Cumbres!</h1>
    <p>Hola ${nombre},</p>
    <p>Tu cuenta ha sido creada exitosamente. Ya puedes comenzar a reservar pistas deportivas.</p>
    <p>Si solicitaste precio especial (alumno/familia/ex-alumno), tu solicitud está siendo revisada por un administrador.</p>
    <p>Saludos,<br>Equipo de Reservas Cumbres</p>
  `;
  await sendEmail(email, 'Bienvenido a Reservas Cumbres', html);
};

export const sendReservationCreatedEmail = async (
  email: string,
  nombre: string,
  reservaId: string,
  numeroCuenta: string,
  monto: number
) => {
  const html = `
    <h1>Reserva Creada</h1>
    <p>Hola ${nombre},</p>
    <p>Tu solicitud de reserva ha sido creada exitosamente (ID: ${reservaId}).</p>
    <p><strong>Importante:</strong> Realiza la transferencia bancaria al siguiente número de cuenta:</p>
    <p style="font-size: 18px; font-weight: bold; color: #2563eb;">${numeroCuenta}</p>
    <p><strong>Monto:</strong> €${monto.toFixed(2)}</p>
    <p><strong>Concepto:</strong> Reserva Pistas</p>
    <p>Una vez realizada la transferencia, sube el comprobante en la aplicación para completar tu solicitud.</p>
    <p>Saludos,<br>Equipo de Reservas Cumbres</p>
  `;
  await sendEmail(email, 'Reserva Creada - Realiza el Pago', html);
};

export const sendReservationApprovedEmail = async (
  email: string,
  nombre: string,
  reservaId: string
) => {
  const html = `
    <h1>¡Reserva Aprobada!</h1>
    <p>Hola ${nombre},</p>
    <p>Tu reserva (ID: ${reservaId}) ha sido aprobada. El pago ha sido verificado correctamente.</p>
    <p>Tu pista está confirmada. ¡Disfruta de tu actividad deportiva!</p>
    <p>Saludos,<br>Equipo de Reservas Cumbres</p>
  `;
  await sendEmail(email, 'Reserva Aprobada', html);
};

export const sendReservationRejectedEmail = async (
  email: string,
  nombre: string,
  reservaId: string,
  motivo: string
) => {
  const html = `
    <h1>Reserva Rechazada</h1>
    <p>Hola ${nombre},</p>
    <p>Lamentamos informarte que tu reserva (ID: ${reservaId}) ha sido rechazada.</p>
    <p><strong>Motivo:</strong> ${motivo}</p>
    <p>Si crees que esto es un error, por favor contacta con atención al cliente.</p>
    <p>Saludos,<br>Equipo de Reservas Cumbres</p>
  `;
  await sendEmail(email, 'Reserva Rechazada', html);
};

