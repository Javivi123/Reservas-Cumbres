# 🚀 Guía Rápida de Producción

> **Documentación completa**: Ver [PASOS-PRODUCCION.md](./PASOS-PRODUCCION.md) para instrucciones detalladas paso a paso.

## Resumen Rápido

### Backend (Railway/Render)
1. Conecta repositorio
2. Root Directory: `backend`
3. Variables de entorno: Ver `.env.example`
4. Build: `npm install && npm run build && npx prisma generate && npx prisma migrate deploy`
5. Start: `npm start`

### Frontend (Vercel)
1. Conecta repositorio
2. Root Directory: `frontend`
3. Variable de entorno: `VITE_API_URL=https://tu-backend.up.railway.app/api`
4. Build y deploy automático

### Base de Datos
- **Desarrollo**: SQLite (ya configurado)
- **Producción**: MySQL (PlanetScale, Railway, o servidor propio)
- Cambiar: `npm run db:switch:mysql` en `backend/`

## Checklist Rápido

- [ ] Backend desplegado
- [ ] Frontend desplegado
- [ ] `VITE_API_URL` configurado
- [ ] `CORS_ORIGIN` configurado
- [ ] Base de datos migrada
- [ ] Usuario admin creado

**Ver [PASOS-PRODUCCION.md](./PASOS-PRODUCCION.md) para detalles completos.**

