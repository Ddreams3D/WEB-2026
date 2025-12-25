import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const placeholderNames = [
  'placeholder-innovation',
  'placeholder-precision',
  'placeholder-solutions',
  'placeholder-printing',
  'placeholder-modeling',
  'placeholder-prototyping',
  'placeholder-production',
  'placeholder-engineering',
  'placeholder-certification',
  'placeholder-prototype',
  'placeholder-architectural',
  'placeholder-mechanical',
  'placeholder-medical',
  'placeholder-artistic',
  'placeholder-educational',
  'placeholder-team',
  'placeholder-facility',
  'placeholder-process',
  'placeholder-upload',
  'placeholder-review',
  'placeholder-printing-process',
  'placeholder-post-process',
  'placeholder-delivery'
];

const svgTemplate = (name) => `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f0f0f0"/>
  <text x="50%" y="50%" font-family="Arial" font-size="24" text-anchor="middle" dominant-baseline="middle" fill="#888888">${name}</text>
</svg>`;

placeholderNames.forEach(name => {
  const filePath = path.join(__dirname, `${name}.svg`);
  fs.writeFileSync(filePath, svgTemplate(name));
  console.log(`Created: ${filePath}`);
});

console.log('All placeholders created successfully!');