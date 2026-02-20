// api/file.service.ts
import apiClient from './client';

const fileService = {
  uploadImage: async (uri: string) => {
    const formData = new FormData();
    const filename = uri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image`;

    formData.append('file', {
      uri,
      name: filename,
      type,
    } as any);

    const response = await apiClient.post<{ url: string }>('/items/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};

export default fileService;
