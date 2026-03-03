//RentAnything/utils/image.ts
import { Config } from '@/constants/config';

/**
 * Centrally manages image URL generation.
 * Handles:
 * 1. Absolute URLs (http/https)
 * 2. Relative server paths (prepends BASE_URL)
 * 3. Local URIs (file://, content://) - returns as is for local rendering if possible, or handles appropriately
 * 4. Null/Undefined - returns undefined or a placeholder
 */
export const getImageUrl = (url: string | null | undefined) => {
  if (!url || url === 'null' || url === 'undefined') {
    return 'https://via.placeholder.com/400?text=No+Image';
  }
  
  // If it's already an absolute URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a local URI/Data URI
  if (url.startsWith('file://') || url.startsWith('content://') || url.startsWith('data:')) {
    return url;
  }
  
  // Prepends BASE_URL for relative paths
  return `${Config.BASE_URL}/${url.startsWith('/') ? url.slice(1) : url}`;
};
