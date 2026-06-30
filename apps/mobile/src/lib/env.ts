import { Platform } from 'react-native';

const localApiBaseUrl = Platform.select({
  android: 'http://10.0.2.2:3000',
  default: 'http://localhost:3000',
});

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? localApiBaseUrl;

export const APP_SCHEME = 'templatemobile';
