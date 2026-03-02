//RentAnything/utils/formatPrice.ts

/**
 * Formats a price with the 'Rs.' prefix and a rate-based suffix.
 * Example: formatPrice(2000, 'hourly') -> 'Rs.2000/h'
 * 
 * @param amount - The numerical amount to format. Can be a string or number.
 * @param rateType - The type of rate (hourly, daily, weekly, monthly).
 * @returns A formatted price string.
 */
export const formatPrice = (amount: number | string | undefined | null, rateType?: string): string => {
  if (amount === undefined || amount === null) return 'N/A';
  
  // Clean the amount - if it's a string with "Rs:" prefix, extract the number
  let numericAmount: number;
  if (typeof amount === 'string') {
    const cleaned = amount.replace(/[^\d.]/g, '');
    numericAmount = parseFloat(cleaned);
  } else {
    numericAmount = amount;
  }

  if (isNaN(numericAmount)) return 'N/A';

  // Format the number to remove decimals if they are .00
  const displayAmount = numericAmount % 1 === 0 ? numericAmount.toString() : numericAmount.toFixed(0);

  let suffix = '';
  if (rateType) {
    const type = rateType.toLowerCase();
    if (type === 'hourly' || type === 'h') suffix = '/h';
    else if (type === 'daily' || type === 'day') suffix = '/day';
    else if (type === 'weekly' || type === 'week') suffix = '/week';
    else if (type === 'monthly' || type === 'month') suffix = '/month';
  }

  return `Rs.${displayAmount}${suffix}`;
};
