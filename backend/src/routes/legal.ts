import { Router } from 'express';

const router = Router();

// Política de protección de datos
router.get('/privacidad', (req, res) => {
  res.json({
    titulo: 'Política de Protección de Datos',
    contenido: `
      <div style="max-width: 800px; margin: 0 auto;">
        <p style="color: #6b7280; margin-bottom: 2rem;"><strong>📅 Última actualización:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
        
        <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 1rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #1e40af; margin-top: 0;">🏢 1. Responsable del Tratamiento</h2>
          <p>El responsable del tratamiento de sus datos personales es el <strong>Colegio Cumbres</strong>, con domicilio en [DIRECCIÓN].</p>
        </div>
        
        <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 1rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #0c4a6e; margin-top: 0;">📊 2. Datos que Recopilamos</h2>
          <p>Recopilamos los siguientes datos personales:</p>
          <ul style="line-height: 1.8;">
            <li>👤 Nombre completo</li>
            <li>📧 Dirección de correo electrónico</li>
            <li>🆔 DNI</li>
            <li>📅 Información de reservas realizadas</li>
            <li>💳 Comprobantes de pago (cuando se suben)</li>
          </ul>
        </div>
        
        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 1rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #166534; margin-top: 0;">🎯 3. Finalidad del Tratamiento</h2>
          <p>Sus datos personales se utilizan para:</p>
          <ul style="line-height: 1.8;">
            <li>⚽ Gestionar las reservas de pistas deportivas</li>
            <li>💰 Procesar los pagos y verificar las transacciones</li>
            <li>📬 Enviar notificaciones sobre el estado de las reservas</li>
            <li>⚖️ Cumplir con las obligaciones legales</li>
          </ul>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #92400e; margin-top: 0;">⚖️ 4. Base Legal</h2>
          <p>El tratamiento de sus datos se basa en el <strong>consentimiento</strong> que otorga al registrarse y utilizar nuestros servicios, así como en la ejecución del contrato de reserva.</p>
        </div>
        
        <div style="background: #fce7f3; border-left: 4px solid #ec4899; padding: 1rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #9f1239; margin-top: 0;">💾 5. Conservación de Datos</h2>
          <p>Conservaremos sus datos personales mientras mantenga una cuenta activa y durante los plazos legalmente establecidos para cumplir con las obligaciones fiscales y contables.</p>
        </div>
        
        <div style="background: #ede9fe; border-left: 4px solid #8b5cf6; padding: 1rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #5b21b6; margin-top: 0;">✅ 6. Sus Derechos</h2>
          <p>Usted tiene derecho a:</p>
          <ul style="line-height: 1.8;">
            <li>👁️ Acceder a sus datos personales</li>
            <li>✏️ Rectificar datos inexactos</li>
            <li>🗑️ Solicitar la supresión de sus datos</li>
            <li>🚫 Oponerse al tratamiento</li>
            <li>📤 Portabilidad de datos</li>
            <li>↩️ Retirar el consentimiento en cualquier momento</li>
          </ul>
        </div>
        
        <div style="background: #dcfce7; border-left: 4px solid #10b981; padding: 1rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #065f46; margin-top: 0;">🔒 7. Seguridad</h2>
          <p>Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso no autorizado, la pérdida o la destrucción.</p>
        </div>
        
        <div style="background: #e0e7ff; border-left: 4px solid #6366f1; padding: 1rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #312e81; margin-top: 0;">📞 8. Contacto</h2>
          <p>Para ejercer sus derechos o realizar consultas sobre el tratamiento de sus datos, puede contactarnos a través de la sección de contacto de la aplicación.</p>
        </div>
      </div>
    `,
  });
});

// Información de emergencia
router.get('/emergencia', (req, res) => {
  res.json({
    titulo: 'Información de Emergencia',
    contenido: `
      <div style="max-width: 800px; margin: 0 auto;">
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #991b1b; margin-top: 0;">📞 Números de Emergencia</h2>
          <ul style="line-height: 2; font-size: 1.1rem;">
            <li><strong style="color: #dc2626;">🚨 Emergencias:</strong> <span style="font-size: 1.3rem; font-weight: bold; color: #dc2626;">112</span></li>
            <li><strong style="color: #1e40af;">👮 Policía:</strong> <span style="font-size: 1.2rem; font-weight: bold;">091</span></li>
            <li><strong style="color: #ea580c;">🚒 Bomberos:</strong> <span style="font-size: 1.2rem; font-weight: bold;">080</span></li>
            <li><strong style="color: #059669;">🚑 Ambulancias:</strong> <span style="font-size: 1.2rem; font-weight: bold;">061</span></li>
          </ul>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #92400e; margin-top: 0;">🏫 Contacto del Colegio</h2>
          <ul style="line-height: 2;">
            <li>📱 <strong>Teléfono:</strong> [TELÉFONO]</li>
            <li>📧 <strong>Email:</strong> [EMAIL]</li>
            <li>📍 <strong>Dirección:</strong> [DIRECCIÓN]</li>
          </ul>
        </div>
        
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #991b1b; margin-top: 0;">🚨 Protocolo de Emergencia en las Instalaciones</h2>
          <p style="font-weight: 600; margin-bottom: 1rem;">En caso de emergencia en las instalaciones deportivas:</p>
          <ol style="line-height: 2; padding-left: 1.5rem;">
            <li>😌 <strong>Mantenga la calma</strong></li>
            <li>📞 <strong>Llame inmediatamente al 112</strong></li>
            <li>📢 <strong>Informe al personal del colegio</strong></li>
            <li>👂 <strong>Siga las instrucciones del personal de emergencias</strong></li>
            <li>🚧 <strong>No bloquee las vías de acceso</strong> para los servicios de emergencia</li>
          </ol>
        </div>
        
        <div style="background: #dcfce7; border-left: 4px solid #10b981; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #065f46; margin-top: 0;">🏥 Primeros Auxilios</h2>
          <p>Las instalaciones cuentan con <strong>botiquín de primeros auxilios</strong>. En caso de lesión menor, contacte con el personal del colegio.</p>
        </div>
        
        <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #1e40af; margin-top: 0;">🛡️ Seguridad</h2>
          <p>Por favor, siga todas las normas de seguridad establecidas y utilice el <strong>equipo de protección adecuado</strong> según la actividad deportiva que realice.</p>
        </div>
      </div>
    `,
  });
});

// Normas de uso
router.get('/normas', (req, res) => {
  res.json({
    titulo: 'Normas de Uso de las Instalaciones',
    contenido: `
      <div style="max-width: 800px; margin: 0 auto;">
        <div style="background: #dcfce7; border-left: 4px solid #10b981; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #065f46; margin-top: 0;">📅 1. Reservas</h2>
          <ul style="line-height: 2;">
            <li>⏰ Las reservas deben realizarse con <strong>al menos 24 horas de antelación</strong></li>
            <li>🚫 No se pueden reservar fechas pasadas</li>
            <li>👤 Las reservas son <strong>personales e intransferibles</strong></li>
            <li>💳 El pago debe realizarse <strong>antes de la confirmación</strong> de la reserva</li>
          </ul>
        </div>
        
        <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #1e40af; margin-top: 0;">🕐 2. Horarios</h2>
          <ul style="line-height: 2;">
            <li>📆 <strong>Lunes a Viernes:</strong> <span style="color: #1e40af; font-weight: bold;">17:30 - 22:00</span> (franjas fijas)</li>
            <li>📆 <strong>Sábados y Domingos:</strong> <span style="color: #1e40af; font-weight: bold;">8:00 - 20:00</span> (horario libre)</li>
            <li>⏱️ Las instalaciones deben quedar libres <strong>10 minutos antes</strong> del final de la franja reservada</li>
          </ul>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #92400e; margin-top: 0;">⚽ 3. Uso de las Instalaciones</h2>
          <ul style="line-height: 2;">
            <li>⏰ <strong>Respete el horario reservado</strong></li>
            <li>🧹 <strong>Mantenga las instalaciones limpias y ordenadas</strong></li>
            <li>🎾 <strong>Utilice el equipo deportivo adecuado</strong></li>
            <li>🚭 <strong>No se permite el consumo de alcohol ni tabaco</strong> en las instalaciones</li>
            <li>👨‍👩‍👧 <strong>Los menores deben estar acompañados</strong> por un adulto responsable</li>
          </ul>
        </div>
        
        <div style="background: #fce7f3; border-left: 4px solid #ec4899; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #9f1239; margin-top: 0;">❌ 4. Cancelaciones y Reembolsos</h2>
          <ul style="line-height: 2;">
            <li>⏰ Las cancelaciones deben realizarse con <strong>al menos 48 horas de antelación</strong></li>
            <li>💰 Las cancelaciones tardías <strong>no serán reembolsadas</strong></li>
            <li>🌧️ En caso de condiciones meteorológicas adversas, se evaluará caso por caso</li>
          </ul>
        </div>
        
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #92400e; margin-top: 0;">💡 5. Iluminación</h2>
          <ul style="line-height: 2;">
            <li>💰 El uso de la iluminación tiene un <strong>coste adicional</strong> (excepto en pistas de pádel donde está incluida)</li>
            <li>📝 La iluminación debe <strong>solicitarse al realizar la reserva</strong></li>
          </ul>
        </div>
        
        <div style="background: #ede9fe; border-left: 4px solid #8b5cf6; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #5b21b6; margin-top: 0;">🤝 6. Comportamiento</h2>
          <ul style="line-height: 2;">
            <li>🙏 Se espera un <strong>comportamiento respetuoso</strong> hacia otros usuarios y el personal</li>
            <li>🚫 <strong>No se tolerará ningún tipo de violencia, acoso o comportamiento inapropiado</strong></li>
            <li>⚠️ El incumplimiento de las normas puede resultar en la <strong>prohibición de uso</strong> de las instalaciones</li>
          </ul>
        </div>
        
        <div style="background: #fee2e2; border-left: 4px solid #ef4444; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #991b1b; margin-top: 0;">⚖️ 7. Responsabilidad</h2>
          <ul style="line-height: 2;">
            <li>🔧 Los usuarios son <strong>responsables de cualquier daño</strong> causado a las instalaciones o equipamiento</li>
            <li>🏥 El colegio <strong>no se hace responsable de lesiones personales</strong> durante el uso de las instalaciones</li>
            <li>🛡️ Se recomienda tener un <strong>seguro deportivo personal</strong></li>
          </ul>
        </div>
        
        <div style="background: #e0e7ff; border-left: 4px solid #6366f1; padding: 1.5rem; margin-bottom: 2rem; border-radius: 8px;">
          <h2 style="color: #312e81; margin-top: 0;">📝 8. Modificaciones</h2>
          <p>El colegio se reserva el derecho de <strong>modificar estas normas en cualquier momento</strong>. Los usuarios serán notificados de los cambios.</p>
        </div>
      </div>
    `,
  });
});

export { router as legalRoutes };

