import * as SecureStore from 'expo-secure-store';
import type { AsyncStorageAdapter } from '../../features/auth/types';

export const secureStorage: AsyncStorageAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY }),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};
