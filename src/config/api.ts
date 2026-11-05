import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { createHttpClient } from '../features/auth/api/httpClient';

function resolveBaseUrl() {
  const configured = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  const fallback = Platform.OS === 'android' && !Device.isDevice ? 'http://10.0.2.2:5080' : 'http://127.0.0.1:5080';
  if (!configured && Device.isDevice && Platform.OS !== 'web') return '';
  const value = configured || fallback;
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error('EXPO_PUBLIC_API_BASE_URL має містити лише адресу Backend без шляху та облікових даних.');
  }
  if (!__DEV__ && url.protocol !== 'https:') throw new Error('Для production потрібен HTTPS Backend.');
  return value.replace(/\/$/, '');
}

export const apiBaseUrl = resolveBaseUrl();
const client = createHttpClient(apiBaseUrl);
export const apiRequest: typeof client = (path, options) => {
  if (!apiBaseUrl) return Promise.reject(new Error('Для телефона налаштуй EXPO_PUBLIC_API_BASE_URL на доступну адресу Backend.'));
  return client(path, options);
};
