import { supabaseAdmin } from './supabase';

/**
 * Upload an image to Supabase Storage
 * @param file - The file to upload (File or Blob)
 * @param path - The path within the bucket (e.g., 'icons/report-id.png')
 * @param bucket - The bucket name (default: 'showcase-images')
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(
  file: File | Blob,
  path: string,
  bucket: string = 'showcase-images'
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true, // Overwrite if exists
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Delete an image from Supabase Storage
 * @param path - The path within the bucket
 * @param bucket - The bucket name (default: 'showcase-images')
 */
export async function deleteImage(
  path: string,
  bucket: string = 'showcase-images'
): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Generate a unique filename for an uploaded image
 * @param reportId - The report ID
 * @param type - The type of image (icon or screenshot)
 * @param originalName - The original filename
 * @returns A unique filename
 */
export function generateImageFilename(
  reportId: string,
  type: 'icon' | 'screenshot',
  originalName: string
): string {
  const ext = originalName.split('.').pop() || 'png';
  const timestamp = Date.now();
  return `${type}/${reportId}-${timestamp}.${ext}`;
}
