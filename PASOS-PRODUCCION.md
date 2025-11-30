# 🚀 Guía Completa para Producción - Reservas Cumbres

Esta guía te llevará paso a paso para preparar y desplegar la aplicación en producción usando Vercel para el frontend y Railway/Render para el backend.

---

## 📋 Índice

1. [Preparación Inicial](#1-preparación-inicial)
2. [Configuración del Backend](#2-configuración-del-backend)
3. [Despliegue del Backend](#3-despliegue-del-backend)
4. [Configuración del Frontend](#4-configuración-del-frontend)
5. [Despliegue del Frontend en Vercel](#5-despliegue-del-frontend-en-vercel)
6. [Configuración Final](#6-configuración-final)
7. [Verificación y Testing](#7-verificación-y-testing)
8. [Mantenimiento](#8-mantenimiento)

---

## 1. Preparación Inicial

### 1.1 Verificar que todo funciona localmente

```bash
# Desde la raíz del proyecto
npm run dev
```

Asegúrate de que:
- ✅ El backend inicia en `http://localhost:3001`
- ✅ El frontend inicia en `http://localhost:3000`
- ✅ Puedes hacer login/registro
- ✅ Puedes crear reservas
- ✅ El panel admin funciona

### 1.2 Verificar que las imágenes están en su lugar

Asegúrate de que todas las imágenes estén en `frontend/public/images/`:
- Logo del colegio
- Imágenes de pistas
- Imágenes del campus
- Imágenes de features (opcional)

### 1.3 Hacer commit final

```bash
git add -A
git commit -m "Preparación para producción"
git push origin main
```

---

## 2. Configuración del Backend

### 2.1 Cambiar a MySQL (Recomendado para producción)

```bash
cd backend
npm run db:switch:mysql
```

O manualmente:
```bash
cp prisma/schema.mysql.prisma prisma/schema.prisma
```

### 2.2 Preparar variables de entorno para producción

Crea un archivo `.env.production` (no lo subas a git) con:

```env
# Base de Datos (MySQL en producción)
DATABASE_URL="mysql://usuario:contraseña@host:puerto/nombre_bd"

# JWT (IMPORTANTE: Cambia esto por un secreto seguro)
JWT_SECRET="tu-secret-super-seguro-aqui-genera-uno-nuevo"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=production

# CORS (URL de tu frontend en Vercel)
CORS_ORIGIN="https://tu-app.vercel.app"

# Email (opcional, para producción real)
EMAIL_FROM="noreply@reservascumbres.com"

# Uploads
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

**⚠️ IMPORTANTE**: 
- Genera un nuevo `JWT_SECRET` seguro (puedes usar: `openssl rand -base64 32`)
- No uses el mismo `JWT_SECRET` de desarrollo
- La `DATABASE_URL` será proporcionada por tu servicio de base de datos

### 2.3 Opciones de Base de Datos (Gratuitas)

#### Opción A: Railway (⭐ RECOMENDADO - MySQL gratuito)
1. Ve a [railway.app](https://railway.app)
2. Crea una cuenta gratuita (con GitHub)
3. En tu proyecto, click en "New" → "Database" → "MySQL"
4. Railway creará una base de datos MySQL automáticamente
5. Copia la `DATABASE_URL` de las variables de entorno del servicio
6. **Ventajas**: 
   - 500 horas gratis al mes (suficiente para desarrollo/pruebas)
   - MySQL nativo
   - Muy fácil de configurar
   - Incluido si ya usas Railway para el backend

#### Opción B: Aiven (MySQL gratuito con límites)
1. Ve a [aiven.io](https://aiven.io)
2. Crea una cuenta gratuita
3. Crea un nuevo servicio MySQL
4. Plan gratuito: 1 instancia, 1GB RAM, 10GB almacenamiento
5. Copia la `DATABASE_URL` de conexión
6. **Ventajas**: 
   - MySQL real y gratuito
   - Buena para desarrollo y pruebas pequeñas
   - **Desventajas**: Límites de recursos

#### Opción C: Supabase (PostgreSQL - Gratis)
1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Copia la `DATABASE_URL` (PostgreSQL)
5. **⚠️ IMPORTANTE**: Necesitarás ajustar el schema para PostgreSQL
   - Cambia `provider = "postgresql"` en `schema.prisma`
   - Algunos tipos pueden necesitar ajustes
6. **Ventajas**: 
   - 500MB gratis, muy generoso
   - PostgreSQL es muy robusto
   - **Desventajas**: Requiere cambios en el schema

#### Opción D: Render (PostgreSQL - Gratis)
1. Ve a [render.com](https://render.com)
2. Crea una cuenta gratuita
3. Click en "New" → "PostgreSQL"
4. Render creará una base de datos PostgreSQL
5. Copia la `DATABASE_URL` interna
6. **⚠️ IMPORTANTE**: Necesitarás ajustar el schema para PostgreSQL
7. **Ventajas**: 
   - PostgreSQL gratis
   - **Desventajas**: Requiere cambios en el schema, se duerme después de inactividad

#### Opción E: Clever Cloud (MySQL - Gratis con límites)
1. Ve a [clever-cloud.com](https://clever-cloud.com)
2. Crea una cuenta gratuita
3. Crea un addon MySQL
4. Plan gratuito disponible con límites
5. **Ventajas**: MySQL nativo
6. **Desventajas**: Límites de recursos y tiempo

#### Opción F: TiDB Cloud (MySQL compatible - Gratis)
1. Ve a [tidbcloud.com](https://tidbcloud.com)
2. Crea una cuenta gratuita
3. Crea un cluster gratuito
4. Compatible con MySQL
5. **Ventajas**: MySQL compatible, generoso en recursos gratis
6. **Desventajas**: Puede ser más complejo de configurar

### 🎯 Recomendación

**Para empezar rápido**: Usa **Railway** (Opción A)
- Es la más fácil de configurar
- MySQL nativo (no necesitas cambiar el schema)
- Incluido si ya usas Railway para el backend
- 500 horas gratis al mes es suficiente para desarrollo/pruebas

**Si necesitas más recursos gratis**: Usa **Supabase** (Opción C)
- PostgreSQL es muy robusto
- 500MB gratis es generoso
- Requiere ajustar el schema pero es una vez

---

## 3. Despliegue del Backend

### Opción A: Railway (Recomendado)

1. **Crear cuenta en Railway**
   - Ve a [railway.app](https://railway.app)
   - Inicia sesión con GitHub

2. **Crear nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

3. **Configurar el servicio**
   - Railway detectará automáticamente el backend
   - O manualmente:
     - Click en "New Service" → "GitHub Repo"
     - Selecciona tu repositorio
     - En "Root Directory" pon: `backend`

4. **Configurar variables de entorno**
   - Ve a "Variables" en tu servicio
   - Añade todas las variables del `.env.production`:
     ```
     DATABASE_URL=mysql://...
     JWT_SECRET=tu-secret-aqui
     JWT_EXPIRES_IN=7d
     PORT=3001
     NODE_ENV=production
     CORS_ORIGIN=https://tu-app.vercel.app
     UPLOAD_DIR=./uploads
     MAX_FILE_SIZE=5242880
     ```

5. **Configurar base de datos MySQL (GRATIS)**
   - Click en "New" → "Database" → "MySQL"
   - Railway creará una base de datos MySQL automáticamente (gratis)
   - Copia la `DATABASE_URL` de las variables de entorno del servicio de base de datos
   - Pégala en las variables de entorno de tu servicio backend
   - **Nota**: Railway ofrece 500 horas gratis al mes, suficiente para desarrollo

6. **Configurar build y start**
   - Build Command: `npm install --include=dev && npm run build && npx prisma generate && npx prisma db push --accept-data-loss`
   - Start Command: `npm start`
   - O en "Settings" → "Deploy":
     - Build Command: `npm install --include=dev && npm run build && npx prisma generate && npx prisma db push --accept-data-loss`
     - Start Command: `npm start`
   - **Nota**: Usamos `prisma db push` en lugar de `migrate deploy` porque estamos cambiando de SQLite (desarrollo) a MySQL (producción). Esto sincroniza el schema directamente sin conflictos de migraciones.

7. **Desplegar**
   - Railway desplegará automáticamente
   - Espera a que termine el build
   - Copia la URL pública (algo como: `https://tu-backend.up.railway.app`)

### Opción B: Render

1. **Crear cuenta en Render**
   - Ve a [render.com](https://render.com)
   - Inicia sesión con GitHub

2. **Crear nuevo Web Service**
   - Click en "New" → "Web Service"
   - Conecta tu repositorio
   - Configura:
     - **Name**: `reservas-cumbres-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install --include=dev && npm run build && npx prisma generate && npx prisma db push --accept-data-loss`
     - **Start Command**: `npm start`
     - **Nota**: Usamos `prisma db push` porque estamos cambiando de SQLite a MySQL. Esto sincroniza el schema directamente.

3. **Configurar variables de entorno**
   - En "Environment Variables", añade todas las del `.env.production`

4. **Crear base de datos PostgreSQL (GRATIS)**
   - Click en "New" → "PostgreSQL"
   - Render creará una base de datos PostgreSQL (gratis)
   - Copia la `DATABASE_URL` interna
   - **⚠️ IMPORTANTE**: Necesitarás ajustar el schema para PostgreSQL:
     - Cambia `provider = "postgresql"` en `prisma/schema.prisma`
     - Algunos tipos pueden necesitar ajustes (ver `backend/README-DATABASE.md`)
   - **Nota**: La base de datos se "duerme" después de inactividad (se despierta automáticamente)

5. **Desplegar**
   - Render desplegará automáticamente
   - Copia la URL pública

### 3.1 Ejecutar migraciones

Una vez desplegado, ejecuta las migraciones:

```bash
# Si usas Railway, puedes hacerlo desde la consola web o CLI
# Si usas Render, puedes usar el shell web

# Conectarte a la base de datos y ejecutar:
npx prisma migrate deploy
```

O desde la consola web de Railway/Render:
```bash
cd backend
npx prisma migrate deploy
```

### 3.2 Verificar que el backend funciona

1. Abre la URL de tu backend en el navegador
2. Deberías ver un mensaje de error 404 (normal, no hay ruta raíz)
3. Prueba: `https://tu-backend.up.railway.app/api/spaces`
4. Deberías ver un JSON con las pistas (o array vacío si no hay datos)

### 3.3 Crear usuario admin (si es necesario)

Si no tienes datos, puedes ejecutar el seed:

```bash
# Desde la consola web de Railway/Render o localmente con DATABASE_URL de producción
cd backend
npm run seed
```

**⚠️ CUIDADO**: Solo haz esto si la base de datos está vacía.

---

## 4. Configuración del Frontend

### 4.1 Crear archivo de configuración para Vercel

Crea `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 4.2 Preparar variables de entorno

Crea un archivo `.env.production` en `frontend/` (no lo subas a git):

```env
VITE_API_URL=https://tu-backend.up.railway.app/api
```

**⚠️ IMPORTANTE**: 
- Reemplaza `https://tu-backend.up.railway.app` con la URL real de tu backend
- La URL debe terminar en `/api` si tu backend sirve las rutas bajo `/api`

---

## 5. Despliegue del Frontend en Vercel

### 5.1 Crear cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub

### 5.2 Importar proyecto

1. Click en "Add New..." → "Project"
2. Importa tu repositorio de GitHub
3. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (debería detectarse automáticamente)
   - **Output Directory**: `dist` (debería detectarse automáticamente)
   - **Install Command**: `npm install` (debería detectarse automáticamente)

### 5.3 Configurar variables de entorno

1. En "Environment Variables", añade:
   ```
   VITE_API_URL = https://tu-backend.up.railway.app/api
   ```
   - **⚠️ IMPORTANTE**: Reemplaza con la URL real de tu backend
   - Asegúrate de que esté disponible para "Production", "Preview" y "Development"

### 5.4 Desplegar

1. Click en "Deploy"
2. Vercel construirá y desplegará automáticamente
3. Espera a que termine (2-3 minutos)
4. Copia la URL de producción (algo como: `https://tu-app.vercel.app`)

### 5.5 Configurar dominio personalizado (Opcional)

1. En "Settings" → "Domains"
2. Añade tu dominio personalizado
3. Sigue las instrucciones de Vercel para configurar DNS

---

## 6. Configuración Final

### 6.1 Actualizar CORS en el backend

1. Ve a las variables de entorno de tu backend (Railway/Render)
2. Actualiza `CORS_ORIGIN` con la URL de tu frontend en Vercel:
   ```
   CORS_ORIGIN=https://tu-app.vercel.app
   ```
3. Reinicia el servicio del backend

### 6.2 Verificar que todo funciona

1. **Frontend**: Abre `https://tu-app.vercel.app`
2. **Registro**: Crea una cuenta de prueba
3. **Login**: Inicia sesión
4. **Reservas**: Crea una reserva de prueba
5. **Admin**: Si tienes usuario admin, prueba el panel

### 6.3 Configurar subida de archivos (Comprobantes)

**⚠️ IMPORTANTE**: Los archivos subidos se guardan localmente en el servidor. En producción, deberías usar:

#### Opción A: Cloudinary (Recomendado)
1. Crea cuenta en [cloudinary.com](https://cloudinary.com)
2. Obtén tus credenciales
3. Instala: `npm install cloudinary`
4. Modifica `backend/src/routes/reservations.ts` para usar Cloudinary

#### Opción B: AWS S3
1. Crea bucket en S3
2. Configura credenciales
3. Instala: `npm install @aws-sdk/client-s3`
4. Modifica el código para usar S3

#### Opción C: Mantener local (Solo para pruebas)
- Los archivos se guardarán en el servidor
- **Problema**: Se perderán si el servidor se reinicia (Railway/Render reinician contenedores)
- **Solución temporal**: Funciona pero no es ideal para producción

---

## 7. Verificación y Testing

### 7.1 Checklist de verificación

- [ ] Backend desplegado y accesible
- [ ] Frontend desplegado y accesible
- [ ] Variables de entorno configuradas correctamente
- [ ] CORS configurado correctamente
- [ ] Base de datos conectada
- [ ] Migraciones ejecutadas
- [ ] Usuario admin creado (si es necesario)
- [ ] Registro de usuarios funciona
- [ ] Login funciona
- [ ] Creación de reservas funciona
- [ ] Subida de comprobantes funciona
- [ ] Panel admin funciona
- [ ] Imágenes se cargan correctamente
- [ ] Responsive funciona en móvil

### 7.2 Testing en producción

1. **Prueba desde diferentes dispositivos**:
   - Desktop
   - Tablet
   - Móvil

2. **Prueba todas las funcionalidades**:
   - Registro
   - Login
   - Crear reserva
   - Subir comprobante
   - Aprobar/rechazar reserva (admin)
   - Ver reportes (admin)

3. **Verifica rendimiento**:
   - Tiempo de carga
   - Tiempo de respuesta de API
   - Tamaño de bundle

---

## 8. Mantenimiento

### 8.1 Actualizar la aplicación

1. Haz cambios en tu código local
2. Prueba localmente: `npm run dev`
3. Commit y push:
   ```bash
   git add -A
   git commit -m "Descripción de cambios"
   git push origin main
   ```
4. Vercel y Railway/Render desplegarán automáticamente

### 8.2 Ver logs

- **Vercel**: Dashboard → Tu proyecto → "Deployments" → Click en un deployment → "Functions" → Ver logs
- **Railway**: Dashboard → Tu servicio → "Deployments" → Ver logs
- **Render**: Dashboard → Tu servicio → "Logs"

### 8.3 Backup de base de datos

**PlanetScale**: Tiene backups automáticos
**Railway**: Configura backups manuales
**Render**: Configura backups manuales

### 8.4 Monitoreo

Considera añadir:
- **Sentry** para errores: [sentry.io](https://sentry.io)
- **Vercel Analytics** para métricas del frontend
- **Uptime monitoring**: UptimeRobot, Pingdom

---

## 🆘 Solución de Problemas

### Problema: Frontend no puede conectar con backend

**Solución**:
1. Verifica que `VITE_API_URL` esté configurado correctamente en Vercel
2. Verifica que el backend esté funcionando (abre la URL en el navegador)
3. Verifica CORS en el backend (`CORS_ORIGIN` debe incluir la URL de Vercel)

### Problema: Error 404 en rutas del frontend

**Solución**:
1. Verifica que `vercel.json` tenga el rewrite correcto
2. Asegúrate de que el build se complete correctamente

### Problema: Imágenes no se cargan

**Solución**:
1. Verifica que las imágenes estén en `frontend/public/images/`
2. Verifica que los nombres de archivo coincidan exactamente
3. Limpia la caché del navegador

### Problema: Base de datos no conecta

**Solución**:
1. Verifica que `DATABASE_URL` esté correcta
2. Verifica que la base de datos esté accesible desde internet
3. Verifica que las credenciales sean correctas

### Problema: Migraciones fallan

**Solución**:
1. Verifica que el schema esté actualizado
2. Ejecuta `npx prisma generate` antes de las migraciones
3. Verifica que la base de datos tenga los permisos necesarios

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel/Railway/Render
2. Verifica las variables de entorno
3. Prueba localmente primero
4. Consulta la documentación de Vercel/Railway/Render

---

## ✅ Checklist Final

Antes de considerar la app lista para producción:

- [ ] Backend desplegado y funcionando
- [ ] Frontend desplegado y funcionando
- [ ] Base de datos configurada y migrada
- [ ] Variables de entorno configuradas
- [ ] CORS configurado
- [ ] Usuario admin creado
- [ ] Todas las funcionalidades probadas
- [ ] Imágenes cargando correctamente
- [ ] Responsive funcionando
- [ ] Dominio personalizado configurado (opcional)
- [ ] Backup de base de datos configurado
- [ ] Monitoreo configurado (opcional)

---

**¡Felicitaciones! 🎉 Tu aplicación está lista para producción.**

