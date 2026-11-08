import type { StorageAdapter } from "./types";



class SecureStorageAdapter implements StorageAdapter
{
	async getItem(key: string): Promise<string | null>
	{
		try
		{
			if (typeof window === 'undefined' || !window.sessionStorage) { return null; }
			return window.sessionStorage.getItem(key);
		}
		catch (error) { console.warn(`[SecureStoreAdapter.getItem.web] Failed to read: ${key} - ${String(error)}`); return null; }
	}
	async setItem(key: string, value: string): Promise<void>
	{
		try
		{
			if (typeof window === 'undefined' || !window.sessionStorage) { return; }
			window.sessionStorage.setItem(key, value);
		}
		catch (error) { console.warn(`[SecureStoreAdapter.setItem.web] Failed to write: ${key} - ${String(error)}`); }
	}
	async removeItem(key: string): Promise<void>
	{
		try
		{
			if (typeof window === 'undefined' || !window.sessionStorage) { return; }
			window.sessionStorage.removeItem(key);
		}
		catch (error) { console.warn(`[SecureStoreAdapter.removeItem.web] Failed to remove: ${key} - ${String(error)}`); }
	}
}



export { SecureStorageAdapter };