import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const MAPPING_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'image-mapping.json');

const TARGET_FILES = [
  'src/data/products.data.ts',
  'src/data/categories.data.ts',
  'src/data/projects.data.ts',
  'src/config/images.ts',
  'src/shared/data/services-fallback.json',
  'src/data/seasonal-themes.json',
  'src/features/catalog/CatalogPageClient.tsx',
  'src/app/not-found.tsx',
  'src/app/(public)/complaints/page.tsx',
  'src/components/seo/LocalBusinessJsonLd.tsx',
  'src/app/(public)/services/page.tsx'
];

async function updateImageUrls() {
  try {
    // Read mapping file
    if (!fs.existsSync(MAPPING_FILE)) {
      console.error('❌ Mapping file not found:', MAPPING_FILE);
      process.exit(1);
    }
    
    const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
    
    // Sort keys by length descending to prevent partial replacements
    const sortedKeys = Object.keys(mapping).sort((a, b) => b.length - a.length);
    
    let totalReplacements = 0;
    
    for (const relativePath of TARGET_FILES) {
      const filePath = path.join(PROJECT_ROOT, relativePath);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ File not found, skipping: ${relativePath}`);
        continue;
      }
      
      let content = fs.readFileSync(filePath, 'utf8');
      let fileReplacements = 0;
      
      for (const localPath of sortedKeys) {
        const remoteUrl = mapping[localPath];
        
        // Escape special regex characters in the local path
        // We want to match the string literal in the source code
        // e.g. "/images/foo.png" -> "\/images\/foo\.png"
        // But simple string replacement replaceAll is better if available in Node environment (Node 15+)
        
        if (content.includes(localPath)) {
          // Use split/join for global replacement or replaceAll
          const parts = content.split(localPath);
          if (parts.length > 1) {
            content = parts.join(remoteUrl);
            fileReplacements += (parts.length - 1);
          }
        }
      }
      
      if (fileReplacements > 0) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated ${relativePath} (${fileReplacements} replacements)`);
        totalReplacements += fileReplacements;
      } else {
        console.log(`ℹ️ No replacements in ${relativePath}`);
      }
    }
    
    console.log(`\n🎉 Total replacements made: ${totalReplacements}`);
    
  } catch (error) {
    console.error('❌ Error updating files:', error);
    process.exit(1);
  }
}

updateImageUrls();
