/**
 * Sanitizes a phone number by removing all characters except '+' and digits.
 * Example: "+94 (77) 123-4567" -> "+94771234567"
 * @param phone The raw phone number string
 * @returns The sanitized phone number string
 */
export const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // Keep only + and digits
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it's a 10-digit Sri Lankan number starting with 0, convert to international format
  if (/^0\d{9}$/.test(cleaned)) {
    cleaned = '+94' + cleaned.substring(1);
  }
  
  return cleaned;
};

/**
 * Filters an input string to allow only digits, '+', '(', ')', and '-'.
 * Basically prevents letters and other symbols.
 */
export const filterPhoneInput = (text: string): string => {
  return text.replace(/[^\d+()\- ]/g, '');
};
