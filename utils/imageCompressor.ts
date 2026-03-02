// utils/imageCompressor.ts
import * as ImageManipulator from 'expo-image-manipulator';

export interface CompressOptions {
  /** Maximum width in pixels. Height scales proportionally. Default: 1600 */
  maxWidth?: number;
  /** JPEG quality 0–1. Default: 0.82 */
  quality?: number;
}

/**
 * Resizes and compresses an image URI before upload.
 * Returns a new URI pointing to the compressed JPEG.
 */
export async function compressImage(
  uri: string,
  { maxWidth = 1600, quality = 0.82 }: CompressOptions = {},
): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth } }],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
  );
  return result.uri;
}
