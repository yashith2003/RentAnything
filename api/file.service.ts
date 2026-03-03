//RentAnything/api/file.service.ts
import apiClient from './client';
import * as SecureStore from 'expo-secure-store';
import { Config } from '@/constants/config';
import { compressImage } from '@/utils/imageCompressor';

const fileService = {
  uploadImage: async (uri: string) => {
    // Compress before upload: resize to max 1600px, JPEG 82%
    const compressedUri = await compressImage(uri, { maxWidth: 1600 });

    const formData = new FormData();
    const filename = compressedUri.split('/').pop() || 'upload.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';

    formData.append('file', {
      uri,
      name: filename,
      type,
    } as any);

    // Using native fetch instead of Axios. Axios in React Native has notorious issues 
    // with FormData serialization which results in the backend receiving no file (400 Bad Request).
    const token = await SecureStore.getItemAsync('access_token');
    
    const response = await fetch(`${Config.API_URL}/items/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Accept': 'application/json',
        // Note: fetch will automatically set Content-Type with the correct form-data boundary
      },
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Upload failed (${response.status}): ${errText}`);
    }

    const result = await response.json();

    // Handle NestJS TransformInterceptor wrapper if present
    const url: string = result?.data?.url ?? result?.url;
    if (!url) throw new Error('Upload succeeded but no URL was returned from the server.');
    return { url };
  },
};

export default fileService;
