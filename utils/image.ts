
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
  if (!url) return undefined;
  
  // If it's already an absolute URL (http or https)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a local URI (common in buggy existing data)
  // We don't prepend BASE_URL to these
  if (url.startsWith('file://') || url.startsWith('content://') || url.startsWith('data:')) {
    return url;
  }
  
  // If it's a relative path from our server
  return `${Config.BASE_URL}/${url.startsWith('/') ? url.slice(1) : url}`;
};
