# 🆓 Opciones Gratuitas de Base de Datos - Reservas Cumbres

Esta guía te ayuda a elegir la mejor opción gratuita de base de datos para tu aplicación.

---

## 🎯 Recomendación Principal: Railway MySQL

**La opción más fácil y recomendada es Railway con MySQL:**

✅ **Ventajas:**
- MySQL nativo (no necesitas cambiar el schema)
- 500 horas gratis al mes (suficiente para desarrollo/pruebas)
- Muy fácil de configurar
- Incluido si ya usas Railway para el backend
- No se "duerme" como otras opciones

❌ **Desventajas:**
- Límite de horas (pero 500h es mucho para desarrollo)

**Cómo configurarlo:**
1. Ve a [railway.app](https://railway.app)
2. Crea cuenta gratuita con GitHub
3. En tu proyecto, click "New" → "Database" → "MySQL"
4. Railway crea la base de datos automáticamente
5. Copia la `DATABASE_URL` de las variables de entorno

---

## 📊 Comparación de Opciones Gratuitas

| Servicio | Tipo | Gratis | Ventajas | Desventajas |
|----------|------|--------|----------|-------------|
| **Railway** | MySQL | ✅ 500h/mes | Fácil, MySQL nativo, no se duerme | Límite de horas |
| **Aiven** | MySQL | ✅ Limitado | MySQL real | Límites de recursos |
| **Supabase** | PostgreSQL | ✅ 500MB | Muy generoso, robusto | Requiere cambiar schema |
| **Render** | PostgreSQL | ✅ Limitado | PostgreSQL gratis | Se duerme, requiere cambios |
| **Clever Cloud** | MySQL | ✅ Limitado | MySQL nativo | Límites estrictos |
| **TiDB Cloud** | MySQL compatible | ✅ Limitado | Compatible MySQL | Más complejo |

---

## 🚀 Guías Rápidas por Opción

### Opción 1: Railway MySQL (⭐ RECOMENDADO)

```bash
# 1. Ve a railway.app y crea cuenta
# 2. Crea proyecto → New → Database → MySQL
# 3. Copia DATABASE_URL
# 4. Úsala en variables de entorno del backend
```

**No necesitas cambiar nada en el código** - MySQL nativo funciona directamente.

---

### Opción 2: Supabase PostgreSQL

```bash
# 1. Ve a supabase.com y crea cuenta
# 2. Crea nuevo proyecto
# 3. Copia DATABASE_URL (PostgreSQL)
# 4. Cambia schema.prisma:
#    - provider = "postgresql"
#    - Ajusta tipos si es necesario
# 5. Ejecuta: npx prisma generate && npx prisma migrate deploy
```

**Ventajas**: 500MB gratis, muy generoso
**Desventajas**: Requiere cambiar el schema

---

### Opción 3: Aiven MySQL

```bash
# 1. Ve a aiven.io y crea cuenta
# 2. Crea servicio MySQL
# 3. Copia DATABASE_URL
# 4. Úsala directamente (MySQL nativo)
```

**Ventajas**: MySQL real, gratis
**Desventajas**: Límites de recursos (1GB RAM, 10GB almacenamiento)

---

### Opción 4: Render PostgreSQL

```bash
# 1. Ve a render.com y crea cuenta
# 2. New → PostgreSQL
# 3. Copia DATABASE_URL interna
# 4. Cambia schema.prisma a PostgreSQL
# 5. Ejecuta migraciones
```

**Ventajas**: PostgreSQL gratis
**Desventajas**: Se duerme después de inactividad, requiere cambios

---

## 🔄 Cambiar de SQLite a MySQL/PostgreSQL

### Para MySQL (Railway, Aiven, etc.)

```bash
cd backend
npm run db:switch:mysql
# O manualmente:
# cp prisma/schema.mysql.prisma prisma/schema.prisma
npx prisma generate
npx prisma migrate deploy
```

### Para PostgreSQL (Supabase, Render, etc.)

```bash
cd backend
# Edita prisma/schema.prisma:
# - Cambia provider = "postgresql"
# - Ajusta tipos si es necesario
npx prisma generate
npx prisma migrate deploy
```

---

## 💡 Consejos

1. **Para empezar rápido**: Usa Railway MySQL
2. **Si necesitas más recursos**: Considera Supabase PostgreSQL
3. **Para producción pequeña**: Railway o Aiven son suficientes
4. **Para producción grande**: Considera planes de pago o servidor propio

---

## ⚠️ Importante

- **Backups**: Configura backups automáticos si es posible
- **Límites**: Revisa los límites de cada servicio
- **Migración**: Puedes cambiar de servicio más adelante si es necesario
- **Producción**: Para producción real, considera planes de pago

---

## 📚 Recursos

- [Railway Docs](https://docs.railway.app)
- [Supabase Docs](https://supabase.com/docs)
- [Aiven Docs](https://aiven.io/docs)
- [Render Docs](https://render.com/docs)

---

**Recomendación final**: Empieza con **Railway MySQL** - es la opción más fácil y no requiere cambios en el código.

