import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const MAPPING_FILE = path.join(PROJECT_ROOT, 'src/data/image-mapping.json');

// Define manual mappings from missing local files to existing Firebase URLs
const MANUAL_MAPPINGS = {
  // Categories -> Placeholders
  '/images/categories/medical.jpg': '/images/ui/placeholders/placeholder-medical.svg',
  '/images/categories/architecture.jpg': '/images/ui/placeholders/placeholder-architectural.svg',
  '/images/categories/education.jpg': '/images/ui/placeholders/placeholder-educational.svg',
  '/images/categories/engineering.jpg': '/images/ui/placeholders/placeholder-engineering.svg',
  '/images/categories/art.jpg': '/images/ui/placeholders/placeholder-artistic.svg',

  // Seasonal -> Generic Placeholder
  '/images/seasonal/christmas-hero.jpg': '/images/ui/placeholders/placeholder.svg',
  '/images/seasonal/halloween-hero.jpg': '/images/ui/placeholders/placeholder.svg',
  '/images/seasonal/peru-hero.jpg': '/images/ui/placeholders/placeholder.svg',
  '/images/seasonal/valentines-hero.jpg': '/images/ui/placeholders/placeholder.svg',

  // Services OG -> Solutions Placeholder
  '/images/services-og.jpg': '/images/ui/placeholders/placeholder-solutions.svg'
};

async function addManualMappings() {
  try {
    if (!fs.existsSync(MAPPING_FILE)) {
      console.error('❌ Mapping file not found!');
      process.exit(1);
    }

    const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
    let addedCount = 0;

    console.log('🔄 Adding manual mappings for missing local files...');

    for (const [missingPath, existingKey] of Object.entries(MANUAL_MAPPINGS)) {
      if (mapping[existingKey]) {
        // Map the missing path to the SAME URL as the existing key
        mapping[missingPath] = mapping[existingKey];
        console.log(`✅ Mapped ${missingPath} -> ${existingKey} URL`);
        addedCount++;
      } else {
        console.warn(`⚠️ Could not find source URL for key: ${existingKey}`);
      }
    }

    fs.writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2), 'utf8');
    console.log(`\n🎉 Successfully added ${addedCount} manual mappings to image-mapping.json`);

  } catch (error) {
    console.error('❌ Error updating mapping file:', error);
    process.exit(1);
  }
}

addManualMappings();
