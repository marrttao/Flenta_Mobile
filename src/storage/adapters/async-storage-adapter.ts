import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StorageAdapter } from './types'



class AsyncStorageAdapter implements StorageAdapter
{
	async getItem(key: string): Promise<string | null>
	{
		try { return await AsyncStorage.getItem(key); }
		catch (error) { console.warn(`[AsyncStorageAdapter.getItem] Failed to read: ${key} - ${String(error)}`); return null; }
	}
	async setItem(key: string, value: string): Promise<void>
	{
		try { await AsyncStorage.setItem(key, value); }
		catch (error) { console.warn(`[AsyncStorageAdapter.setItem] Failed to write: ${key} - ${String(error)}`); }
	}
	async removeItem(key: string): Promise<void>
	{
		try { await AsyncStorage.removeItem(key); }
		catch (error) { console.warn(`[AsyncStorageAdapter.setItem] Failed to remove: ${key} - ${String(error)}`); }
	}

	async clear(): Promise<void>
	{
		try { await AsyncStorage.clear(); }
		catch (error) { console.warn(`[AsyncStorageAdapter.setItem] Failed to clear: ${String(error)}`); }
	}
}



export { AsyncStorageAdapter };