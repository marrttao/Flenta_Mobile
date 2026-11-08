import * as SecureStore from 'expo-secure-store';

import type { StorageAdapter } from './types';



class SecureStorageAdapter implements StorageAdapter
{
	async getItem(key: string): Promise<string | null>
	{
		try { return await SecureStore.getItemAsync(key); }
		catch (error) { console.warn(`[SecureStorageAdapter.getItem] Failed to read: ${key} - ${String(error)}`); return null; }
	}
	async setItem(key: string, value: string): Promise<void>
	{
		try { await SecureStore.setItemAsync(key, value); }
		catch (error) { console.warn(`[SecureStorageAdapter.setItem] Failed to write: ${key} - ${String(error)}`); }
	}
	async removeItem(key: string): Promise<void>
	{
		try { await SecureStore.deleteItemAsync(key); }
		catch (error) { console.warn(`[SecureStorageAdapter.removeItem] Failed to remove: ${key} - ${String(error)}`); }
	}
}



export { SecureStorageAdapter };