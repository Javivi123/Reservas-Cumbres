import { Router } from 'express';

const router = Router();

// Política de protección de datos
router.get('/privacidad', (req, res) => {
  res.json({
    titulo: 'Política de Protección de Datos',
    contenido: `
      <h1>Política de Protección de Datos</h1>
      <p><strong>Última actualización:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
      
      <h2>1. Responsable del Tratamiento</h2>
      <p>El responsable del tratamiento de sus datos personales es el Colegio Cumbres, con domicilio en [DIRECCIÓN].</p>
      
      <h2>2. Datos que Recopilamos</h2>
      <p>Recopilamos los siguientes datos personales:</p>
      <ul>
        <li>Nombre completo</li>
        <li>Dirección de correo electrónico</li>
        <li>DNI</li>
        <li>Información de reservas realizadas</li>
        <li>Comprobantes de pago (cuando se suben)</li>
      </ul>
      
      <h2>3. Finalidad del Tratamiento</h2>
      <p>Sus datos personales se utilizan para:</p>
      <ul>
        <li>Gestionar las reservas de pistas deportivas</li>
        <li>Procesar los pagos y verificar las transacciones</li>
        <li>Enviar notificaciones sobre el estado de las reservas</li>
        <li>Cumplir con las obligaciones legales</li>
      </ul>
      
      <h2>4. Base Legal</h2>
      <p>El tratamiento de sus datos se basa en el consentimiento que otorga al registrarse y utilizar nuestros servicios, así como en la ejecución del contrato de reserva.</p>
      
      <h2>5. Conservación de Datos</h2>
      <p>Conservaremos sus datos personales mientras mantenga una cuenta activa y durante los plazos legalmente establecidos para cumplir con las obligaciones fiscales y contables.</p>
      
      <h2>6. Sus Derechos</h2>
      <p>Usted tiene derecho a:</p>
      <ul>
        <li>Acceder a sus datos personales</li>
        <li>Rectificar datos inexactos</li>
        <li>Solicitar la supresión de sus datos</li>
        <li>Oponerse al tratamiento</li>
        <li>Portabilidad de datos</li>
        <li>Retirar el consentimiento en cualquier momento</li>
      </ul>
      
      <h2>7. Seguridad</h2>
      <p>Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la destrucción.</p>
      
      <h2>8. Contacto</h2>
      <p>Para ejercer sus derechos o realizar consultas sobre el tratamiento de sus datos, puede contactarnos a través de la sección de contacto de la aplicación.</p>
    `,
  });
});

// Información de emergencia
router.get('/emergencia', (req, res) => {
  res.json({
    titulo: 'Información de Emergencia',
    contenido: `
      <h1>Información de Emergencia</h1>
      
      <h2>Números de Emergencia</h2>
      <ul>
        <li><strong>Emergencias:</strong> 112</li>
        <li><strong>Policía:</strong> 091</li>
        <li><strong>Bomberos:</strong> 080</li>
        <li><strong>Ambulancias:</strong> 061</li>
      </ul>
      
      <h2>Contacto del Colegio</h2>
      <ul>
        <li><strong>Teléfono:</strong> [TELÉFONO]</li>
        <li><strong>Email:</strong> [EMAIL]</li>
        <li><strong>Dirección:</strong> [DIRECCIÓN]</li>
      </ul>
      
      <h2>Protocolo de Emergencia en las Instalaciones</h2>
      <p>En caso de emergencia en las instalaciones deportivas:</p>
      <ol>
        <li>Mantenga la calma</li>
        <li>Llame inmediatamente al 112</li>
        <li>Informe al personal del colegio</li>
        <li>Siga las instrucciones del personal de emergencias</li>
        <li>No bloquee las vías de acceso para los servicios de emergencia</li>
      </ol>
      
      <h2>Primeros Auxilios</h2>
      <p>Las instalaciones cuentan con botiquín de primeros auxilios. En caso de lesión menor, contacte con el personal del colegio.</p>
      
      <h2>Seguridad</h2>
      <p>Por favor, siga todas las normas de seguridad establecidas y utilice el equipo de protección adecuado según la actividad deportiva que realice.</p>
    `,
  });
});

// Normas de uso
router.get('/normas', (req, res) => {
  res.json({
    titulo: 'Normas de Uso de las Instalaciones',
    contenido: `
      <h1>Normas de Uso de las Instalaciones Deportivas</h1>
      
      <h2>1. Reservas</h2>
      <ul>
        <li>Las reservas deben realizarse con al menos 24 horas de antelación</li>
        <li>No se pueden reservar fechas pasadas</li>
        <li>Las reservas son personales e intransferibles</li>
        <li>El pago debe realizarse antes de la confirmación de la reserva</li>
      </ul>
      
      <h2>2. Horarios</h2>
      <ul>
        <li><strong>Lunes a Viernes:</strong> 17:30 - 22:00 (franjas fijas)</li>
        <li><strong>Sábados y Domingos:</strong> 8:00 - 20:00 (horario libre)</li>
        <li>Las instalaciones deben quedar libres 10 minutos antes del final de la franja reservada</li>
      </ul>
      
      <h2>3. Uso de las Instalaciones</h2>
      <ul>
        <li>Respete el horario reservado</li>
        <li>Mantenga las instalaciones limpias y ordenadas</li>
        <li>Utilice el equipo deportivo adecuado</li>
        <li>No se permite el consumo de alcohol ni tabaco en las instalaciones</li>
        <li>Los menores deben estar acompañados por un adulto responsable</li>
      </ul>
      
      <h2>4. Cancelaciones y Reembolsos</h2>
      <ul>
        <li>Las cancelaciones deben realizarse con al menos 48 horas de antelación</li>
        <li>Las cancelaciones tardías no serán reembolsadas</li>
        <li>En caso de condiciones meteorológicas adversas, se evaluará caso por caso</li>
      </ul>
      
      <h2>5. Iluminación</h2>
      <ul>
        <li>El uso de la iluminación tiene un coste adicional (excepto en pistas de pádel donde está incluida)</li>
        <li>La iluminación debe solicitarse al realizar la reserva</li>
      </ul>
      
      <h2>6. Comportamiento</h2>
      <ul>
        <li>Se espera un comportamiento respetuoso hacia otros usuarios y el personal</li>
        <li>No se tolerará ningún tipo de violencia, acoso o comportamiento inapropiado</li>
        <li>El incumplimiento de las normas puede resultar en la prohibición de uso de las instalaciones</li>
      </ul>
      
      <h2>7. Responsabilidad</h2>
      <ul>
        <li>Los usuarios son responsables de cualquier daño causado a las instalaciones o equipamiento</li>
        <li>El colegio no se hace responsable de lesiones personales durante el uso de las instalaciones</li>
        <li>Se recomienda tener un seguro deportivo personal</li>
      </ul>
      
      <h2>8. Modificaciones</h2>
      <p>El colegio se reserva el derecho de modificar estas normas en cualquier momento. Los usuarios serán notificados de los cambios.</p>
    `,
  });
});

export { router as legalRoutes };

