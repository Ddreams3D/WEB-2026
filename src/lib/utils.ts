import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(text: string): string {
  // First, protect "3D" from being lowercased by replacing it with a placeholder
  const protectedText = text.toString().replace(/3D/g, 'THREE_D_PLACEHOLDER');
  
  const slug = protectedText
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
    
  // Restore "3D"
  return slug.replace(/three_d_placeholder/g, '3D');
}

/**
 * Formats a CSS object-position string for use in inline styles.
 * Converts "object-center" or "50% 50%" formats to valid CSS values.
 * Removes tailwind prefixes if present.
 */
export function formatImagePosition(position: string | undefined): string {
  if (!position) return 'center';
  
  return position
    .replace('object-', '')
    .replace('[', '')
    .replace(']', '')
    .replace('_', ' ');
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function extractMetadataFromFilename(filename: string): { name: string; tags: string[] } {
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  
  // Replace separators with spaces
  const cleanName = nameWithoutExt
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Capitalize first letter of each word for the Name
  const name = cleanName.replace(/\b\w/g, (l) => l.toUpperCase());

  // Generate tags (split by space, filter small words if needed)
  const tags = cleanName
    .toLowerCase()
    .split(" ")
    .filter(word => word.length > 2); // Filter out very short words like "de", "el"

  return { name, tags };
}
