import fs from 'fs';
import path from 'path';

// Cargar variables de entorno manualmente
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    try {
      const envPath = path.resolve(process.cwd(), file);
      if (fs.existsSync(envPath)) {
        console.log(`Cargando variables de ${file}...`);
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const [key, ...valueParts] = trimmed.split('=');
            const value = valueParts.join('=');
            if (key && value) {
              const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
              process.env[key.trim()] = cleanValue;
            }
          }
        });
        return;
      }
    } catch (e) {
      console.warn(`No se pudo leer ${file}`);
    }
  }
}

loadEnv();

const BUCKET_NAME = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

if (!BUCKET_NAME) {
  console.error('❌ Error: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET no definido en .env.local');
  process.exit(1);
}

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const DATA_DIR = path.resolve(process.cwd(), 'src/data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const MAPPING_FILE = path.join(DATA_DIR, 'image-mapping.json');

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json',
    '.stl': 'model/stl'
  };
  return types[ext] || 'application/octet-stream';
}

async function uploadFileRest(filePath, remotePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);
    
    // Codificar path para URL (las barras '/' se convierten en %2F)
    const encodedPath = encodeURIComponent(remotePath);
    
    // URL de la API REST de Firebase Storage
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o?name=${encodedPath}`;
    
    process.stdout.write(`Subiendo ${remotePath}... `);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        // 'Authorization': 'Bearer ...' // Si necesitas auth, aquí va el token. 
        // Por ahora asumimos reglas públicas o desarrollo.
      },
      body: fileBuffer
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    // Construir URL pública de descarga usando el token generado
    const token = data.downloadTokens;
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET_NAME}/o/${encodedPath}?alt=media&token=${token}`;
    
    console.log(`✅ OK`);
    return downloadUrl;

  } catch (error) {
    console.log(`❌ Error`);
    console.error(`  -> ${error.message}`);
    if (error.message.includes('403')) {
      console.error('  -> PERMISOS DENEGADOS. Asegúrate de que tus reglas de Storage en Firebase Console permitan escritura pública temporalmente:');
      console.error('     allow write: if true;');
    }
    return null;
  }
}

async function processDirectory(directory, baseRemotePath, mapping) {
  const items = fs.readdirSync(directory);

  for (const item of items) {
    const fullPath = path.join(directory, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath, `${baseRemotePath}/${item}`, mapping);
    } else {
      if (!item.match(/\.(jpg|jpeg|png|svg|webp|gif|glb|gltf|stl)$/i)) continue;
      
      const relativePath = fullPath.replace(PUBLIC_DIR, '').replace(/\\/g, '/');
      const remotePath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;

      const url = await uploadFileRest(fullPath, remotePath);
      if (url) {
        mapping[relativePath] = url;
      }
    }
  }
}

async function main() {
  console.log('🚀 Iniciando script de migración (Modo REST API)...');
  console.log('-----------------------------------------------------------');
  console.log(`Directorio origen: ${PUBLIC_DIR}`);
  console.log(`Bucket destino: ${BUCKET_NAME}`);
  console.log('-----------------------------------------------------------\n');

  const mapping = {};
  
  const imagesDir = path.join(PUBLIC_DIR, 'images');
  if (fs.existsSync(imagesDir)) {
    await processDirectory(imagesDir, 'images', mapping);
  } else {
    console.error('⚠️ No se encontró la carpeta public/images');
  }

  // Guardar resultado
  fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  
  console.log('\n-----------------------------------------------------------');
  console.log(`✨ Migración Finalizada.`);
  console.log(`📄 Mapeo de URLs guardado en: ${MAPPING_FILE}`);
}

main().catch(console.error);
