// constants/config.ts
import Constants from 'expo-constants';

// For local development with a physical device, use your machine's local IP address
// instead of localhost. Example: 'http://192.168.1.5:3008/api'
const LOCAL_HOST = '10.0.2.2'; // Standard for Android Emulator to host machine
const BASE_URL = `http://${LOCAL_HOST}:3008/api`;

export const Config = {
  API_URL: BASE_URL,
  TIMEOUT: 10000,
};
