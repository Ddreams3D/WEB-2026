#!/usr/bin/env node

/**
 * Script para optimizar las importaciones de iconos de lucide-react
 * Reemplaza las importaciones directas por importaciones desde el archivo centralizado
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Directorio base del proyecto
const srcDir = path.join(__dirname, '../src');

// Función para leer archivos recursivamente
function findTsxFiles() {
  return glob.sync('**/*.{tsx,ts}', {
    cwd: srcDir,
    ignore: ['lib/icons.ts', 'scripts/**/*']
  });
}

// Función para actualizar las importaciones en un archivo
function updateImportsInFile(filePath) {
  const fullPath = path.join(srcDir, filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  let hasChanges = false;

  // Buscar importaciones de lucide-react
  const lucideImportRegex = /import\s*{([^}]+)}\s*from\s*['"]lucide-react['"];?/g;
  
  content = content.replace(lucideImportRegex, (match, imports) => {
    hasChanges = true;
    // Limpiar y formatear las importaciones
    const cleanImports = imports
      .split(',')
      .map(imp => imp.trim())
      .filter(imp => imp.length > 0)
      .join(', ');
    
    return `import { ${cleanImports} } from '@/lib/icons';`;
  });

  if (hasChanges) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Actualizado: ${filePath}`);
    return true;
  }
  
  return false;
}

// Función principal
function main() {
  console.log('🚀 Iniciando optimización de iconos de lucide-react...');
  
  const files = findTsxFiles();
  let updatedCount = 0;
  
  files.forEach(file => {
    if (updateImportsInFile(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\n📊 Resumen:`);
  console.log(`   - Archivos analizados: ${files.length}`);
  console.log(`   - Archivos actualizados: ${updatedCount}`);
  console.log(`   - Archivos sin cambios: ${files.length - updatedCount}`);
  
  if (updatedCount > 0) {
    console.log('\n✨ Optimización completada. Las importaciones de iconos ahora usan el archivo centralizado.');
    console.log('💡 Esto debería mejorar el tree-shaking y reducir el tamaño del bundle.');
  } else {
    console.log('\n✅ No se encontraron archivos que necesiten actualización.');
  }
}

// Verificar si glob está disponible
try {
  require('glob');
  main();
} catch (error) {
  console.error('❌ Error: El paquete "glob" no está instalado.');
  console.log('💡 Instálalo con: npm install --save-dev glob');
  process.exit(1);
}