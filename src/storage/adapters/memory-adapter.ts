import type { StorageAdapter } from "./types";



class MemomryAdapter implements StorageAdapter
{
	private readonly _storage: Map<string, string> = new Map<string, string>();

	async getItem(key: string): Promise<string | null> { return this._storage.get(key) ?? null; }
	async setItem(key: string, value: string): Promise<void> { this._storage.set(key, value); }
	async removeItem(key: string): Promise<void> { this._storage.delete(key); }

	async clear?(): Promise<void> { this._storage.clear(); }
}



export { MemomryAdapter };