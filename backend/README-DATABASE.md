# Guía de Configuración de Base de Datos

Esta aplicación soporta tanto **SQLite** (desarrollo) como **MySQL** (producción).

## 🗄️ SQLite (Desarrollo - Actual)

### Configuración Actual
- **Provider**: SQLite
- **Archivo**: `backend/prisma/dev.db`
- **Schema**: `prisma/schema.prisma` (sin enums, usa String)

### Ventajas
- ✅ No requiere instalación de servidor
- ✅ Funciona inmediatamente
- ✅ Ideal para desarrollo local
- ✅ Base de datos en un solo archivo

### Uso
```bash
# El .env ya está configurado para SQLite
DATABASE_URL="file:./dev.db"

# Generar cliente y migrar
npx prisma generate
npx prisma migrate dev
```

---

## 🐬 MySQL (Producción)

### Configuración
- **Provider**: MySQL
- **Schema**: `prisma/schema.mysql.prisma` (con enums nativos)

### Cambiar a MySQL

#### Opción 1: Script Automático (Recomendado)
```bash
cd backend
./scripts/switch-to-mysql.sh
```

#### Opción 2: Manual
1. **Backup del schema actual:**
   ```bash
   cp prisma/schema.prisma prisma/schema.sqlite.prisma.backup
   ```

2. **Copiar schema de MySQL:**
   ```bash
   cp prisma/schema.mysql.prisma prisma/schema.prisma
   ```

3. **Actualizar `.env`:**
   ```env
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/reservas_cumbres"
   ```

4. **Regenerar y migrar:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

### Cambiar de vuelta a SQLite

#### Opción 1: Script Automático
```bash
cd backend
./scripts/switch-to-sqlite.sh
```

#### Opción 2: Manual
1. Restaurar el schema de SQLite
2. Actualizar `.env` a `file:./dev.db`
3. Regenerar y migrar

---

## 📋 Diferencias entre SQLite y MySQL

| Característica | SQLite | MySQL |
|---------------|--------|-------|
| Enums | ❌ No soportados (usa String) | ✅ Soportados nativamente |
| Transacciones | ✅ Básicas | ✅ Completas (ACID) |
| Concurrencia | ⚠️ Limitada | ✅ Alta |
| Escalabilidad | ⚠️ Archivo único | ✅ Servidor dedicado |
| Uso recomendado | Desarrollo | Producción |

---

## 🔄 Migración de Datos

Si necesitas migrar datos de SQLite a MySQL:

1. **Exportar datos de SQLite:**
   ```bash
   # Usar Prisma Studio o exportar manualmente
   npx prisma studio
   ```

2. **Importar a MySQL:**
   - Cambiar a MySQL siguiendo los pasos arriba
   - Usar el seed o importar manualmente

---

## ✅ Verificación

Para verificar qué base de datos estás usando:

```bash
# Ver el provider en schema.prisma
grep "provider" prisma/schema.prisma

# Ver la URL en .env
grep "DATABASE_URL" .env
```

---

## 🐛 Solución de Problemas

### Error: "Enum no soportado"
- **Causa**: Estás usando schema de MySQL con SQLite
- **Solución**: Cambia a schema de SQLite

### Error: "Connection refused"
- **Causa**: MySQL no está corriendo
- **Solución**: Inicia MySQL: `brew services start mysql` o `sudo systemctl start mysql`

### Error: "Database does not exist"
- **Causa**: La base de datos no existe en MySQL
- **Solución**: Crea la base de datos: `CREATE DATABASE reservas_cumbres;`

---

## 📝 Notas

- El código de la aplicación es **compatible con ambos** sistemas
- Los valores de enum se manejan como strings en el código
- Las consultas de Prisma funcionan igual en ambos
- Solo cambia el schema y la URL de conexión

