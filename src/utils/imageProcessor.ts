// SPARE Client-Side Image Processor
// Compress, resize, and convert client uploads to modern WebP format before storage/upload.

export interface ProcessedImage {
  thumbnailUrl: string; // ~400px width for cards & feeds
  mediumUrl: string;    // ~800px width for detail modal
  originalUrl: string;  // ~1024px WebP max
  blob: Blob;
  sizeBytes: number;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB raw limit
export const MAX_PHOTOS_PER_LISTING = 4;

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image (JPEG, PNG, WebP).' };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'Image file is too large (Maximum 5MB).' };
  }
  return { valid: true };
}

/**
 * Process raw File on HTML Canvas into WebP at specified maximum dimension
 */
export function compressImageFile(
  file: File,
  maxDimension: number = 1024,
  quality: number = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image object'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target?.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format if supported, fallback to JPEG
        try {
          const webpDataUrl = canvas.toDataURL('image/webp', quality);
          resolve(webpDataUrl);
        } catch (err) {
          const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(jpegDataUrl);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generate Thumbnail, Medium, and Full WebP formats from a single File
 */
export async function processListingPhoto(file: File): Promise<ProcessedImage> {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file');
  }

  const [thumbnailUrl, mediumUrl, originalUrl] = await Promise.all([
    compressImageFile(file, 400, 0.78),  // Card thumbnail
    compressImageFile(file, 800, 0.82),  // Detail view
    compressImageFile(file, 1024, 0.85), // Full view
  ]);

  // Convert thumbnailUrl data string to Blob size calculation
  const sizeBytes = Math.round((originalUrl.length * 3) / 4);

  return {
    thumbnailUrl,
    mediumUrl,
    originalUrl,
    blob: new Blob([originalUrl]),
    sizeBytes,
  };
}
