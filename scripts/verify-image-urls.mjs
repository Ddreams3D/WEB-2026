
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const FILES_TO_CHECK = [
  'src/config/images.ts',
  'src/data/categories.data.ts',
  'src/data/products.data.ts',
  'src/data/projects.data.ts',
  'src/data/seasonal-themes.json',
  'src/shared/data/services-fallback.json'
];

async function verifyUrls() {
  console.log('🔍 Verifying image URLs in data files...');
  
  const urlsToCheck = new Set();
  const urlLocations = new Map(); // URL -> [locations]

  for (const relativePath of FILES_TO_CHECK) {
    const filePath = path.join(PROJECT_ROOT, relativePath);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${relativePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    // Regex to match URLs
    const urlRegex = /https?:\/\/[^\s"']+/g;
    let match;
    
    while ((match = urlRegex.exec(content)) !== null) {
      const url = match[0];
      // Filter for image extensions or firebase storage
      if (url.includes('firebasestorage') || url.match(/\.(jpg|jpeg|png|gif|svg|webp)/i)) {
        urlsToCheck.add(url);
        if (!urlLocations.has(url)) {
          urlLocations.set(url, []);
        }
        urlLocations.get(url).push(relativePath);
      }
    }
  }

  console.log(`Found ${urlsToCheck.size} unique image URLs to verify.`);

  let brokenCount = 0;
  const total = urlsToCheck.size;
  let current = 0;

  for (const url of urlsToCheck) {
    current++;
    process.stdout.write(`\rChecking ${current}/${total}...`);
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        process.stdout.write('\n');
        console.error(`❌ Broken URL (${response.status}): ${url}`);
        console.error(`   Found in: ${urlLocations.get(url).join(', ')}`);
        brokenCount++;
      }
    } catch (error) {
      process.stdout.write('\n');
      console.error(`❌ Fetch error: ${url}`);
      console.error(`   Error: ${error.message}`);
      console.error(`   Found in: ${urlLocations.get(url).join(', ')}`);
      brokenCount++;
    }
  }

  console.log('\n----------------------------------------');
  if (brokenCount === 0) {
    console.log('✅ All checked image URLs are valid!');
  } else {
    console.error(`⚠️ Found ${brokenCount} broken image URLs.`);
  }
}

verifyUrls().catch(console.error);
