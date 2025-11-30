# 📸 Guía de Imágenes - Reservas Cumbres

Este documento explica dónde colocar las imágenes proporcionadas para que se muestren correctamente en la aplicación.

## 📁 Estructura de Carpetas

Las imágenes deben colocarse en las siguientes ubicaciones dentro de `frontend/public/images/`:

```
frontend/public/images/
├── logo/
│   ├── cumbres-logo.png          # Logo de Cumbres School Valencia con fondo (imagen 1) - Para headers
│   └── cumbres-logo-nobg.jpg     # Logo de Cumbres School Valencia sin fondo - Para footer
├── pistas/
│   ├── cesped.jpg                # Campo de césped (imagen 2)
│   ├── multi.jpg                 # Campo multideporte (imagen 3 o 4)
│   ├── padel-1.jpg               # Pista de pádel 1 (imagen 5, 6 o 7)
│   └── padel-2.jpg               # Pista de pádel 2 (imagen 5, 6 o 7 - diferente)
├── instalaciones/
│   ├── campus-1.jpg              # Vista general del campus (imagen 8) - Para hero section
│   └── campus-2.jpg              # Vista aérea del campus (imagen 9) - Para footer
└── features/
    ├── reservas-faciles.jpg      # Imagen para tarjeta "Reservas Fáciles"
    ├── multiples-pistas.jpg       # Imagen para tarjeta "Múltiples Pistas"
    └── precios-especiales.jpg     # Imagen de alumnos sonriendo para "Precios Especiales"
```

## 🖼️ Mapeo de Imágenes

### Logo (Imagen 1)
- **Ubicación**: 
  - `logo/cumbres-logo.png` - Logo con fondo (para headers)
  - `logo/cumbres-logo-nobg.jpg` - Logo sin fondo (para footer)
- **Uso**: 
  - **Con fondo** (`cumbres-logo.png`): Se muestra en headers de todas las páginas (redondeado)
  - **Sin fondo** (`cumbres-logo-nobg.jpg`): Se muestra en la sección del footer de HomePage

### Campo de Césped (Imagen 2)
- **Ubicación**: `pistas/cesped.jpg`
- **Uso**: Se muestra en la tarjeta de "Pista césped" en la página de nueva reserva

### Campo Multideporte (Imágenes 3 y 4)
- **Ubicación**: `pistas/multi.jpg`
- **Uso**: Se muestra en la tarjeta de "Pista multi" en la página de nueva reserva
- **Nota**: Puedes usar cualquiera de las dos imágenes (3 o 4) o ambas si quieres diferenciar

### Pistas de Pádel (Imágenes 5, 6 y 7)
- **Ubicación**: 
  - `pistas/padel-1.jpg` (para Pista pádel 1)
  - `pistas/padel-2.jpg` (para Pista pádel 2)
- **Uso**: Se muestran en las tarjetas de "Pista pádel 1" y "Pista pádel 2" respectivamente
- **Sugerencia**: Usa imágenes diferentes para cada pista (ej: imagen 5 para padel-1, imagen 6 para padel-2)

### Vistas del Campus (Imágenes 8 y 9)
- **Ubicación**: 
  - `instalaciones/campus-1.jpg` (imagen 8)
  - `instalaciones/campus-2.jpg` (imagen 9)
- **Uso**: 
  - `campus-1.jpg`: Se usa como imagen de fondo con overlay en la sección hero de HomePage (mejorada visualmente)
  - `campus-2.jpg`: Se muestra prominentemente en la sección del footer de HomePage

### Imágenes de Features (Nuevas)
- **Ubicación**: `features/`
- **Archivos**:
  - `reservas-faciles.jpg` - Para la tarjeta "Reservas Fáciles"
  - `multiples-pistas.jpg` - Para la tarjeta "Múltiples Pistas"
  - `precios-especiales.jpg` - Imagen de alumnos sonriendo para "Precios Especiales"
- **Uso**: Se muestran en círculos redondeados en las 3 tarjetas de características de la página de inicio
- **Recomendación**: Imágenes cuadradas (200x200px o 300x300px) para mejor visualización

## 📝 Instrucciones de Colocación

1. **Crea las carpetas** si no existen:
   ```bash
   cd frontend/public/images
   mkdir -p logo pistas instalaciones
   ```

2. **Coloca las imágenes** con los nombres exactos indicados arriba

3. **Formatos recomendados**:
   - Logo: PNG con fondo transparente (preferible) o JPG
   - Pistas: JPG (optimizado para web, resolución recomendada: 800x600px o superior)
   - Campus: JPG (resolución recomendada: 1920x1080px o superior)

4. **Optimización** (opcional pero recomendado):
   - Comprime las imágenes antes de subirlas para mejorar el rendimiento
   - Herramientas recomendadas: TinyPNG, ImageOptim, o Squoosh

## ⚠️ Notas Importantes

- Los nombres de archivo son **case-sensitive** en algunos sistemas
- Si una imagen no se encuentra, la aplicación mostrará un fallback (emoji o gradiente)
- Las imágenes se cargan desde `/images/...` (ruta pública de Vite)
- Asegúrate de que las imágenes tengan permisos de lectura adecuados

## 🔄 Actualización de Imágenes

Si necesitas cambiar una imagen:
1. Reemplaza el archivo con el mismo nombre
2. Si cambias el nombre, actualiza `frontend/src/utils/images.ts`
3. Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)

