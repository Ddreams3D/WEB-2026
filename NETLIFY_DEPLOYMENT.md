# Despliegue en Netlify - Guía Completa

## 📋 Preparativos

### 1. Configuración del Proyecto
El proyecto ya está configurado para Netlify con:
- ✅ `netlify.toml` - Configuración de build y redirects
- ✅ `next.config.js` - Configurado para exportación estática
- ✅ Script de build específico para Netlify

### 2. Variables de Entorno
Configura estas variables en Netlify Dashboard:

```bash
# Opcional
NEXT_PUBLIC_GA_TRACKING_ID=tu-id-google-analytics
NEXT_PUBLIC_SENTRY_DSN=tu-dsn-sentry
NEXT_PUBLIC_API_URL=tu-url-api
```

## 🚀 Métodos de Despliegue

### Método 1: Conectar Repositorio Git (Recomendado)

1. **Sube tu código a GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Configuración para Netlify"
   git push origin main
   ```

2. **En Netlify Dashboard:**
   - Ve a "Sites" → "Add new site" → "Import an existing project"
   - Conecta tu repositorio Git
   - Configura:
     - **Build command:** `npm run build`
     - **Publish directory:** `out`
     - **Node version:** `18`

3. **Configura las variables de entorno:**
   - Ve a Site settings → Environment variables
   - Agrega todas las variables del archivo `.env.example`

### Método 2: Despliegue Manual

1. **Build local:**
   ```bash
   npm run build
   ```

2. **Sube la carpeta `out` manualmente a Netlify**

## ⚙️ Configuraciones Importantes

### Redirects y Rewrites
El archivo `netlify.toml` incluye:
- Redirects para SPA routing
- Headers de seguridad
- Cache optimizado para assets estáticos

### Optimizaciones
- ✅ Compresión habilitada
- ✅ Cache de imágenes optimizado
- ✅ Bundle splitting configurado
- ✅ Headers de seguridad

## 🔧 Solución de Problemas

### Error: "Module not found"
- Verifica que todas las rutas de importación sean correctas
- Asegúrate de que `output: 'export'` esté en `next.config.js`

### Error: "Image optimization"
- Las imágenes de Next.js requieren configuración especial para static export
- Usa `unoptimized: true` en next.config.js si es necesario

### Error de Build
- Verifica que todas las dependencias estén en `dependencies` (no en `devDependencies`)
- Asegúrate de que Node.js sea versión 18+

## 📝 Checklist Pre-Despliegue

- [ ] Código subido a repositorio Git
- [ ] Variables de entorno configuradas en Netlify
- [ ] Build local exitoso (`npm run build`)
- [ ] Todas las rutas funcionando correctamente
- [ ] Imágenes y assets cargando correctamente

## 🌐 Post-Despliegue

1. **Verifica el sitio:** Prueba todas las rutas y funcionalidades
2. **Configura dominio personalizado** (opcional)
3. **Habilita HTTPS** (automático en Netlify)
4. **Configura analytics** si es necesario

---

¿Necesitas ayuda? Revisa los logs de build en Netlify Dashboard para más detalles sobre cualquier error.