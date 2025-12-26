const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Función para extraer iconos únicos de los archivos
function extractUsedIcons() {
  try {
    // Buscar todas las importaciones de iconos
    const grepResult = execSync(
      'grep -r "from [\'\"]@/lib/icons[\'\"]" src/ --include="*.tsx" --include="*.ts"',
      { cwd: process.cwd(), encoding: 'utf8' }
    );

    const usedIcons = new Set();
    const lines = grepResult.split('\n').filter(line => line.trim());

    lines.forEach(line => {
      // Extraer la parte de importación
      const match = line.match(/import\s*{([^}]+)}\s*from\s*['"]@\/lib\/icons['"]/); 
      if (match) {
        const imports = match[1]
          .split(',')
          .map(imp => imp.trim())
          .map(imp => {
            // Manejar alias (ej: User as UserIcon)
            const aliasMatch = imp.match(/^(\w+)\s+as\s+\w+$/);
            return aliasMatch ? aliasMatch[1] : imp;
          })
          .filter(imp => imp && imp !== '');
        
        imports.forEach(icon => usedIcons.add(icon));
      }
    });

    return Array.from(usedIcons).sort();
  } catch (error) {
    console.error('Error extracting icons:', error.message);
    return [];
  }
}

// Generar el nuevo archivo de iconos optimizado
function generateOptimizedIconsFile(usedIcons) {
  const iconImports = usedIcons.join(',\n  ');
  const iconExports = usedIcons.join(',\n  ');

  const optimizedContent = `// Iconos optimizados - solo los que se usan realmente
// Generado automaticamente - no editar manualmente

import {
  ${iconImports}
} from 'lucide-react';

// Exportacion de iconos utilizados
export {
  ${iconExports}
};

// Alias para compatibilidad
export { Image as ImageIcon } from 'lucide-react';
`;

  return optimizedContent;
}

// Ejecutar la optimización
console.log('Extrayendo iconos utilizados...');
const usedIcons = extractUsedIcons();
console.log(`Encontrados ${usedIcons.length} iconos únicos:`);
console.log(usedIcons.join(', '));

const optimizedContent = generateOptimizedIconsFile(usedIcons);

// Crear backup del archivo original
const iconsPath = path.join(process.cwd(), 'src/lib/icons.ts');
const backupPath = path.join(process.cwd(), 'src/lib/icons.backup.ts');

if (fs.existsSync(iconsPath)) {
  fs.copyFileSync(iconsPath, backupPath);
  console.log('Backup creado en:', backupPath);
}

// Escribir el archivo optimizado
fs.writeFileSync(iconsPath, optimizedContent);
console.log('Archivo icons.ts optimizado generado!');
console.log(`Reducción estimada: de ~361 líneas a ~${optimizedContent.split('\n').length} líneas`);