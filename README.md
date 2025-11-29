# Reservas Cumbres - Sistema de Gestión de Reservas de Pistas Deportivas

Sistema web completo para la gestión de reservas de pistas deportivas de un colegio. Desarrollado con React + TypeScript + TailwindCSS en el frontend y Node.js + Express + TypeScript + Prisma en el backend.

## 🚀 Características

- **Gestión de Reservas**: Sistema completo de reservas con franjas horarias fijas entre semana y horario libre los fines de semana
- **Múltiples Pistas**: Césped, Multi y Pádel (2 pistas)
- **Sistema de Pagos**: Transferencia bancaria con subida de comprobante y aprobación por administrador
- **Roles de Usuario**: Admin y Usuario (con opción de precio especial para alumnos/familias/ex-alumnos)
- **Panel de Administración**: Gestión completa de reservas, usuarios, pistas, reportes y logs
- **Notificaciones por Email**: Sistema simulado de emails para notificaciones importantes
- **Páginas Legales**: Política de privacidad, normas de uso e información de emergencia

## 📋 Requisitos Previos

- Node.js 18+ y npm
- SQLite (incluido en macOS/Linux) - Para desarrollo
- MySQL 8+ (o compatible) - Para producción (opcional)
- Git

> **Nota**: La aplicación está configurada para funcionar con **SQLite** (desarrollo) y **MySQL** (producción). Ver [README-DATABASE.md](backend/README-DATABASE.md) para más detalles sobre cómo cambiar entre bases de datos.

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
cd "Reservas Cumbres"
```

### 2. Instalar dependencias

```bash
# Instalar dependencias del proyecto raíz
npm install

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### 3. Configurar variables de entorno

El archivo `.env` ya está creado con configuración de SQLite para desarrollo. Si quieres usar MySQL, edita `backend/.env`:

**Para desarrollo (SQLite - ya configurado):**
```env
DATABASE_URL="file:./dev.db"
```

**Para producción (MySQL):**
```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/reservas_cumbres"

# JWT
JWT_SECRET="tu-secret-super-seguro-aqui-cambiar-en-produccion"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# Email (simulado)
EMAIL_FROM="noreply@reservascumbres.com"

# Uploads
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

### 4. Configurar la base de datos

```bash
cd backend

# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Ejecutar seeds para crear datos de prueba
npm run seed
```

### 5. Iniciar la aplicación

**Opción 1: Desde la raíz del proyecto (recomendado)**

```bash
# Desde la raíz del proyecto
npm run dev
```

Esto iniciará tanto el backend (puerto 3001) como el frontend (puerto 3000).

**Opción 2: Por separado**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 6. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Prisma Studio** (opcional): `cd backend && npx prisma studio`

## 👤 Usuarios de Prueba

Después de ejecutar el seed, puedes usar:

- **Admin**: 
  - Email: `admin@cumbres.com`
  - Contraseña: `admin123`

- **Usuario de prueba**: 
  - Email: `usuario@test.com`
  - Contraseña: `user123`

## 📁 Estructura del Proyecto

```
Reservas Cumbres/
├── backend/
│   ├── src/
│   │   ├── routes/          # Rutas API
│   │   ├── middleware/      # Middleware (auth, etc.)
│   │   ├── utils/           # Utilidades (email, pricing, validation)
│   │   ├── prisma/          # Cliente Prisma y seeds
│   │   └── index.ts         # Punto de entrada
│   ├── prisma/
│   │   └── schema.prisma    # Esquema de base de datos
│   └── uploads/             # Comprobantes de pago (se crea automáticamente)
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── contexts/        # Contextos React (Auth)
│   │   ├── layouts/         # Layouts (Admin, User)
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── services/        # Servicios API
│   │   └── types/           # Tipos TypeScript
│   └── public/              # Archivos estáticos
└── README.md
```

## 🔑 Funcionalidades Principales

### Panel de Usuario

- **Nueva Reserva**: Selección de pista, fecha y franja horaria
- **Mis Reservas**: Ver estado de reservas y subir comprobantes de pago
- **Perfil**: Información del usuario y estado de solicitud de precio especial
- **Contacto**: Formulario de contacto/soporte

### Panel de Administración

- **Gestión de Reservas**: Ver, aprobar y rechazar reservas con filtros avanzados
- **Usuarios Pendientes**: Aprobar/rechazar solicitudes de precio especial
- **Gestión de Pistas**: Editar precios y configuración de pistas
- **Reportes**: Ingresos totales y por pista con filtros de fecha
- **Logs**: Historial completo de acciones del sistema
- **Exportación**: Exportar reservas a CSV

## 💳 Sistema de Pagos

1. El usuario crea una reserva
2. Se muestra el número de cuenta bancaria y el monto total
3. El usuario realiza la transferencia con concepto "Reserva Pistas"
4. El usuario sube el comprobante de pago
5. El administrador revisa y aprueba/rechaza la reserva
6. Se envía un email de notificación al usuario

## 📧 Sistema de Emails

El sistema incluye un simulador de emails que imprime los emails en la consola del servidor. En producción, se debe integrar con un servicio real como SendGrid, Resend o AWS SES.

## 🗄️ Base de Datos

El esquema de Prisma incluye:

- **User**: Usuarios del sistema
- **Space**: Pistas deportivas
- **Reservation**: Reservas
- **Payment**: Pagos y comprobantes
- **Log**: Logs de acciones del sistema

## 🚀 Despliegue

### Vercel (Frontend)

1. Conecta tu repositorio a Vercel
2. Configura el directorio raíz como `frontend`
3. Añade la variable de entorno `VITE_API_URL` con la URL de tu backend

### Railway / Render (Backend)

1. Conecta tu repositorio
2. Configura el directorio raíz como `backend`
3. Añade todas las variables de entorno del archivo `.env`
4. Configura el build command: `npm install && npm run build`
5. Configura el start command: `npm start`

### Base de Datos

La aplicación soporta tanto **SQLite** (desarrollo) como **MySQL** (producción).

**Para cambiar a MySQL en producción:**
1. Ver la guía completa en [backend/README-DATABASE.md](backend/README-DATABASE.md)
2. O usar el script: `./backend/scripts/switch-to-mysql.sh`

**Opciones de base de datos en producción:**
- **MySQL** (recomendado) - PlanetScale, Railway, o servidor propio
- **PostgreSQL** - Vercel Postgres, Railway, Supabase
  - Nota: Requiere ajustar el schema para PostgreSQL

Actualiza la `DATABASE_URL` en las variables de entorno según tu elección.

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT
- Validación de datos con Zod
- Sanitización de inputs
- Rutas protegidas por roles

## 📝 Scripts Disponibles

### Backend

- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm run build`: Compila TypeScript
- `npm run start`: Inicia el servidor en producción
- `npm run prisma:generate`: Genera el cliente de Prisma
- `npm run prisma:migrate`: Ejecuta migraciones
- `npm run prisma:studio`: Abre Prisma Studio
- `npm run seed`: Ejecuta el seed de datos

### Frontend

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Compila para producción
- `npm run preview`: Previsualiza el build de producción

## 🐛 Solución de Problemas

### Error de conexión a la base de datos

- Verifica que MySQL esté corriendo
- Revisa la `DATABASE_URL` en el archivo `.env`
- Asegúrate de que la base de datos existe

### Error al ejecutar migraciones

```bash
# Si hay conflictos, puedes resetear la base de datos (¡CUIDADO: borra todos los datos!)
npx prisma migrate reset
```

### Puerto ya en uso

- Cambia el puerto en el archivo `.env` (backend) o `vite.config.ts` (frontend)

## 📄 Licencia

Este proyecto está creado por Javier Sánchez Risen, es privado y está destinado al uso del Colegio Cumbres.

## 👥 Soporte

Para cualquier problema o pregunta, contacta conmigo: jav.sr@icloud.com.

---

**Desarrollado con ❤️ por Javier Sánchez para el Colegio Cumbres School**

