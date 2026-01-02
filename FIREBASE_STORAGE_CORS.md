# Configuración de CORS para Firebase Storage

El problema que describes ("funciona en desarrollo pero falla en producción") es casi siempre causado por la falta de configuración CORS (Cross-Origin Resource Sharing) en tu bucket de Firebase Storage.

Por defecto, Firebase Storage bloquea las subidas desde dominios que no sean localhost. Para permitir subidas desde tu dominio de producción (ej. tu-sitio.vercel.app), necesitas configurar CORS.

## Paso 1: Instalar gsutil (Google Cloud SDK)

Si no tienes instalado `gsutil`, la forma más rápida es usar la consola web de Google Cloud Shell, que ya lo tiene instalado.

1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Asegúrate de seleccionar el proyecto correcto de Firebase.
3. Haz clic en el icono de **Activate Cloud Shell** en la parte superior derecha (icono de terminal >_).

## Paso 2: Crear el archivo de configuración

En la terminal de Cloud Shell (o en tu terminal local si tienes gsutil), crea un archivo `cors.json`:

```bash
nano cors.json
```

Pega el siguiente contenido y guarda (Ctrl+O, Enter, Ctrl+X):

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600
  }
]
```

> **Nota:** `["*"]` permite todos los dominios. Para mayor seguridad en el futuro, puedes cambiarlo por `["https://tudominio.com", "http://localhost:3000"]`.

## Paso 3: Aplicar la configuración

Ejecuta el siguiente comando, reemplazando `NOMBRE_DE_TU_BUCKET` con el nombre de tu bucket (generalmente `tu-proyecto.firebasestorage.app` o similar, lo puedes ver en la sección Storage de la consola de Firebase):

```bash
gsutil cors set cors.json gs://NOMBRE_DE_TU_BUCKET
```

Ejemplo:
```bash
gsutil cors set cors.json gs://ddreams3d.firebasestorage.app
```

## Paso 4: Verificar

Para verificar que se aplicó correctamente:

```bash
gsutil cors get gs://NOMBRE_DE_TU_BUCKET
```

## Solución Alternativa (Sin consola)

Si no puedes usar `gsutil`, verifica que no tengas reglas de seguridad (`storage.rules`) que bloqueen escrituras. Tu archivo de reglas debería verse algo así para permitir subidas a usuarios autenticados:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Puedes editar esto en la Consola de Firebase -> Storage -> Rules.
