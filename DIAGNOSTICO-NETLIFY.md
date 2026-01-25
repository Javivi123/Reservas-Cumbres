# 🔍 Diagnóstico de Conexión Netlify → Render

## ✅ Checklist de Verificación

### 1. Verificar Variable de Entorno en Netlify

1. Ve a tu sitio en [Netlify Dashboard](https://app.netlify.com)
2. Click en tu sitio → **Site settings** → **Environment variables**
3. Verifica que existe:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://tu-backend.onrender.com` (sin `/api` al final)
   - ⚠️ **IMPORTANTE:** No debe tener `/api` al final

### 2. Verificar que el Backend esté Funcionando

Abre en tu navegador:
```
https://tu-backend.onrender.com/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "Servidor funcionando correctamente"
}
```

Si no funciona:
- El backend puede estar dormido (Render free tier)
- Espera 30 segundos y recarga
- Verifica los logs en Render

### 3. Verificar CORS en el Backend

El backend debe tener `app.use(cors())` sin restricciones (ya está así).

Si quieres ser más específico, puedes configurar CORS para permitir solo Netlify:

```typescript
app.use(cors({
  origin: [
    'https://tu-sitio.netlify.app',
    'https://tu-sitio--*.netlify.app', // Preview deployments
  ],
  credentials: true,
}));
```

Pero con `app.use(cors())` sin opciones debería funcionar.

### 4. Verificar en la Consola del Navegador

1. Abre tu sitio en Netlify
2. Abre la consola del navegador (F12)
3. Ve a la pestaña **Console**
4. Busca estos mensajes:
   - ✅ `🌐 API_URL en producción: https://tu-backend.onrender.com`
   - ❌ Si ves errores de CORS o conexión, anótalos

### 5. Verificar en la Pestaña Network

1. Abre la pestaña **Network** en las herramientas de desarrollador
2. Intenta hacer login o cargar una página
3. Busca peticiones a `/api/...`
4. Click en una petición fallida
5. Verifica:
   - **Request URL:** ¿Es la URL correcta del backend?
   - **Status:** ¿Qué código de error muestra?
   - **Headers:** ¿Hay errores de CORS?

## 🐛 Errores Comunes y Soluciones

### Error: "Failed to fetch" o "Network Error"
**Causa:** `VITE_API_URL` no está configurado o está mal configurado
**Solución:**
1. Verifica que `VITE_API_URL` esté en Netlify
2. El valor debe ser `https://tu-backend.onrender.com` (sin `/api`)
3. Redespliega el sitio después de cambiar variables

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Causa:** El backend no permite el origen de Netlify
**Solución:**
1. Verifica que el backend tenga `app.use(cors())` sin restricciones
2. O configura CORS específicamente para Netlify (ver paso 3)

### Error: "404 Not Found"
**Causa:** La URL del backend está mal o el backend no está funcionando
**Solución:**
1. Verifica que la URL del backend sea correcta
2. Prueba acceder directamente a `https://tu-backend.onrender.com/api/health`
3. Si no funciona, el backend puede estar dormido (espera 30 segundos)

### Error: "503 Service Unavailable"
**Causa:** El backend en Render está dormido (free tier)
**Solución:**
1. Espera 30-60 segundos
2. Recarga la página
3. La primera petición puede tardar en despertar el servicio

## 🔧 Pasos para Solucionar

### Paso 1: Verificar Variables en Netlify
```
1. Netlify Dashboard → Tu sitio → Site settings → Environment variables
2. Verifica VITE_API_URL = https://tu-backend.onrender.com
3. Si no existe, créala
4. Si existe pero está mal, edítala
```

### Paso 2: Redesplegar
```
1. Netlify Dashboard → Tu sitio → Deploys
2. Click en "Trigger deploy" → "Deploy site"
3. Espera a que termine el build
```

### Paso 3: Verificar Backend
```
1. Abre https://tu-backend.onrender.com/api/health
2. Debe responder con {"status":"ok"}
3. Si no responde, verifica los logs en Render
```

### Paso 4: Probar en el Navegador
```
1. Abre tu sitio en Netlify
2. Abre la consola (F12)
3. Intenta hacer login
4. Revisa los errores en la consola
```

## 📝 Información para Debugging

Cuando reportes un error, incluye:

1. **URL de tu sitio Netlify:** `https://...`
2. **URL de tu backend Render:** `https://...`
3. **Valor de VITE_API_URL en Netlify:** `...`
4. **Error en la consola del navegador:** (copia el error completo)
5. **Screenshot de la pestaña Network:** (si es posible)

## 🚀 Comandos Útiles

### Verificar variable en build
En los logs de build de Netlify, busca:
```
🌐 API_URL en producción: https://...
```

Si no aparece o aparece `/api`, la variable no está configurada correctamente.

### Probar conexión manualmente
Abre la consola del navegador en tu sitio y ejecuta:
```javascript
fetch('https://tu-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Si funciona, el backend está bien. Si no, hay un problema de CORS o el backend no está funcionando.
