import type { StorageAdapter } from "./types";



class SecureStorageAdapter implements StorageAdapter
{
	async getItem(key: string): Promise<string | null>
	{
		if (typeof window === 'undefined') { return null; }
		return window.sessionStorage.getItem(key);
	}
	async setItem(key: string, value: string): Promise<void>
	{
		if (typeof window === 'undefined') { return; }
		window.sessionStorage.setItem(key, value);
	}
	async removeItem(key: string): Promise<void>
	{
		if (typeof window === 'undefined') { return; }
		window.sessionStorage.removeItem(key);
	}
}



export { SecureStorageAdapter };