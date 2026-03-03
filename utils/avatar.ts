//RentAnything/utils/avatar.ts

import { getImageUrl } from '@/utils/image';

export function getAvatarSource(profileImage?: string | null) {
  if (profileImage && profileImage.trim().length > 0) {
    return { uri: getImageUrl(profileImage) };
  }
  return require('@/assets/images/profile_icon.avif');
}
