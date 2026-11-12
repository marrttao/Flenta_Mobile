import * as SecureStore from 'expo-secure-store';

import type { StorageAdapter } from './types';



class SecureStorageAdapter implements StorageAdapter
{
	async getItem(key: string): Promise<string | null> { return SecureStore.getItemAsync(key); }
	async setItem(key: string, value: string): Promise<void> { await SecureStore.setItemAsync(key, value); }
	async removeItem(key: string): Promise<void> { await SecureStore.deleteItemAsync(key); }
}



export { SecureStorageAdapter };