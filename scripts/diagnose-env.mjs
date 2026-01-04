import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

console.log('--- DIAGNOSTICO DE VARIABLES DE ENTORNO ---');

// Función para leer variables de un archivo .env
function loadEnv(filename) {
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
      env[key] = value;
    }
  });
  return env;
}

// Cargar .env.local y .env
const envLocal = loadEnv('.env.local');
const envDefault = loadEnv('.env');
const combinedEnv = { ...process.env, ...envDefault, ...envLocal };

const keys = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let missing = 0;
keys.forEach(key => {
  const value = combinedEnv[key];
  if (!value) {
    console.error(`❌ FALTA: ${key}`);
    missing++;
  } else {
    console.log(`✅ ${key}: ${value.substring(0, 4)}... (Length: ${value.length})`);
  }
});

if (missing > 0) {
  console.error(`\n⚠️ FALTAN ${missing} VARIABLES CRÍTICAS DE FIREBASE.`);
} else {
  console.log('\n✅ Todas las variables de entorno de Firebase están presentes.');
}

if (missing > 0) {
  console.error(`\n⚠️ FALTAN ${missing} VARIABLES CRÍTICAS DE FIREBASE.`);
} else {
  console.log('\n✅ Todas las variables de entorno parecen estar presentes.');
}
