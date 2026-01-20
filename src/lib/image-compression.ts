
/**
 * Purist Image Compression Utility
 * Uses native Canvas API to compress images without external dependencies.
 */

interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number; // 0 to 1
    type?: 'image/jpeg' | 'image/png' | 'image/webp';
}

export async function compressImage(file: File, options: CompressionOptions = {}): Promise<File> {
    const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.8,
        type = 'image/webp'
    } = options;

    // If not an image, return original
    if (!file.type.startsWith('image/')) return file;
    // If SVG, return original (canvas ruins SVG)
    if (file.type === 'image/svg+xml') return file;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.src = url;
        
        img.onload = () => {
            URL.revokeObjectURL(url);
            
            let width = img.width;
            let height = img.height;

            // Calculate new dimensions keeping aspect ratio
            if (width > maxWidth) {
                height = Math.round((height * maxWidth) / width);
                width = maxWidth;
            }
            if (height > maxHeight) {
                width = Math.round((width * maxHeight) / height);
                height = maxHeight;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // High quality smoothing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Compression failed'));
                        return;
                    }
                    
                    // Create new file with same name but potentially new extension
                    const newExt = type.split('/')[1];
                    const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
                    const newName = `${originalName}.${newExt}`;
                    
                    const compressedFile = new File([blob], newName, {
                        type: type,
                        lastModified: Date.now(),
                    });

                    // Optimization check: If compressed is larger, return original
                    if (compressedFile.size > file.size) {
                        resolve(file);
                    } else {
                        resolve(compressedFile);
                    }
                },
                type,
                quality
            );
        };

        img.onerror = (err) => {
            URL.revokeObjectURL(url);
            reject(err);
        };
    });
}
