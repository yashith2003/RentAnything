// utils/errorMapper.ts

export const mapAuthError = (backendMessage: string, t: any): string => {
  const message = backendMessage.toLowerCase();

  if (message.includes('email already registered') || message.includes('email_already_exists')) {
    return t('auth.errors.emailTaken', 'This email is already registered. Please login or use another email.');
  }

  if (message.includes('email must be an email')) {
    return t('auth.errors.invalidEmail', 'Please enter a valid email address.');
  }

  if (message.includes('phone number already registered') || message.includes('phone_already_exists')) {
    return t('auth.errors.phoneTaken', 'This phone number is already registered. Please login or use another phone number.');
  }

  if (message.includes('invalid otp')) {
    return t('auth.errors.invalidOtp', 'Invalid verification code. Please try again.');
  }

  if (message.includes('user not found')) {
    return t('auth.errors.userNotFound', 'User not found. Please register first.');
  }

  if (message.includes('something went wrong') || message.includes('failed to fetch')) {
    return t('common.somethingWentWrong', 'Something went wrong. Please check your connection.');
  }

  // Fallback to the backend message if it's already "pretty" or if we don't have a map
  return backendMessage;
};
