import { ProductImageViewType, ProductImage } from '@/shared/types';

// Helper para limpiar stopwords y generar slug SEO optimizado
export const cleanAndSlugify = (text: string): string => {
  // Lista de palabras vacías (stopwords) en español e inglés técnico común
  const stopwords = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 
    'y', 'e', 'o', 'u', 'de', 'del', 'al', 'con', 'en', 'para', 'por', 'sin', 'sobre',
    'img', 'image', 'imagen', 'foto', 'photo', 'dsc', 'pic', 'file', 'archivo', 'copia', 'copy',
    'whatsapp', 'screenshot', 'captura', 'pantalla'
  ]);
  
  // Remover extensión si existe
  const lastDotIndex = text.lastIndexOf('.');
  const textNoExt = lastDotIndex > 0 ? text.substring(0, lastDotIndex) : text;
  
  return textNoExt.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remover acentos
    .replace(/[^a-z0-9\s-_]/g, "") // Remover caracteres especiales
    .replace(/[\s-_]+/g, "-") // Unificar separadores
    .split('-')
    .filter(w => !stopwords.has(w) && w.length > 1) // Filtrar stopwords y letras sueltas
    .join('-');
};

// Helper para generar nombre SEO inteligente
export const generateSeoFilename = (
  productName: string | undefined, 
  originalFile: File, 
  viewType: ProductImageViewType, 
  existingImages: ProductImage[]
): string => {
  // 1. Determinar el slug base (Nombre del producto o nombre del archivo)
  let baseSlug = '';
  if (productName) {
    baseSlug = cleanAndSlugify(productName);
  } else {
    baseSlug = cleanAndSlugify(originalFile.name);
  }

  // Fallback si el nombre quedó vacío después de limpiar
  if (!baseSlug) baseSlug = 'producto-ddreams3d';

  // 2. Determinar sufijo según tipo de vista
  let suffix = '';
  
  if (viewType !== 'otro') {
    // Si es un tipo estándar, lo usamos
    suffix = `-${viewType}`;
  } else {
    // Si es "otro", intentamos rescatar palabras clave del nombre original del archivo
    // que no estén ya en el nombre del producto
    const originalSlug = cleanAndSlugify(originalFile.name);
    const productSlugParts = baseSlug.split('-');
    
    // Encontrar partes del nombre original que no estén en el nombre del producto
    const extraParts = originalSlug.split('-').filter(part => !productSlugParts.includes(part));
    
    if (extraParts.length > 0) {
      suffix = `-${extraParts.join('-')}`;
    }
  }

  // 3. Manejo de duplicados/contadores
  // Contamos cuántas imágenes de este "tipo" o con este "baseSlug" existen
  const similarImages = existingImages.filter(img => {
    // Si tiene el mismo viewType, es un "hermano"
    if (img.viewType === viewType) return true;
    return false;
  });

  const count = similarImages.length;
  
  // Construir nombre final
  let finalName = `${baseSlug}${suffix}`;
  
  // Si ya hay imágenes de este tipo, agregamos contador
  if (count > 0) {
    finalName += `-${count + 1}`;
  }

  return finalName;
};

// Helper para comprimir imágenes en el cliente antes de subir
export const compressImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
              resolve(file); // Fallback: return original if canvas fails
              return;
          }

          // Max dimensions (Full HD is enough for web product images)
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                  resolve(blob);
              } else {
                  resolve(file); // Fallback
              }
            },
            'image/jpeg',
            0.85 // 85% quality (better for products)
          );
        };
        img.onerror = (err) => {
          console.warn('Image load error, using original file', err);
          resolve(file);
        };
      };
      reader.onerror = (err) => {
        console.warn('FileReader error, using original file', err);
        resolve(file);
      };
    } catch (e) {
      console.warn('Compression error, using original file', e);
      resolve(file);
    }
  });
};
