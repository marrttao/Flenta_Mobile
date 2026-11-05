import type { AsyncStorageAdapter } from '../../features/auth/types';

// Browser preview keeps secrets for this tab only. Native builds use SecureStore.
export const secureStorage: AsyncStorageAdapter = {
  async getItem(key) { return typeof window === 'undefined' ? null : window.sessionStorage.getItem(key); },
  async setItem(key, value) { window.sessionStorage.setItem(key, value); },
  async removeItem(key) { if (typeof window !== 'undefined') window.sessionStorage.removeItem(key); },
};
