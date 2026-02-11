// api/client.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Config } from '@/constants/config';

const apiClient = axios.create({
  baseURL: Config.API_URL,
  timeout: Config.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for injecting JWT token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration or unauthorized access
      // Potential logic: Refresh token or redirect to login
      console.warn('Unauthorized access - potential token expiration');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
