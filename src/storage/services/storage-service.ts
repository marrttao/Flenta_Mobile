import type { StorageAdapter } from "../adapters/types";

import { AsyncStorageAdapter } from "../adapters/async-storage-adapter";
import { SecureStorageAdapter } from "../adapters/secure-storage-adapter";

import { NON_SENSITIVE_KEYS, SENSITIVE_KEYS } from "../utils/policy";
import { StorageKeys } from "../keys";

import { isSensitiveKey } from "../utils/policy";



interface StorageServiceOptions
{
	sensitive?: StorageAdapter;
	nonSensitive?: StorageAdapter;
}



class StorageService
{
	private readonly _sensitiveAdapter: StorageAdapter;
	private readonly _nonSensitiveAdapter: StorageAdapter;

	constructor(options: StorageServiceOptions = {})
	{
		this._sensitiveAdapter = options.sensitive ?? new SecureStorageAdapter();
		this._nonSensitiveAdapter = options.nonSensitive ?? new AsyncStorageAdapter();
	}

	private _adapterForKey(key: StorageKeys): StorageAdapter { return isSensitiveKey(key) ? this._sensitiveAdapter : this._nonSensitiveAdapter; }

	async getItem<Type>(key: StorageKeys, typeName?: string): Promise<Type | null>
	{
		const rawItem = await this._adapterForKey(key).getItem(key);
		if (rawItem === null) { return null; }

		try { return JSON.parse(rawItem) as Type; }
		catch (error)
		{
			const name = typeName ?? 'unknown';
			console.warn(`[StorageService.get<${name}>] Failed to parse value: ${key} - ${String(error)}`);

			return null;
		}
	}
	async setItem<Type>(key: StorageKeys, value: Type): Promise<void>
	{
		try
		{
			const rawItem = JSON.stringify(value);
			if (rawItem === undefined) { return; }
			await this._adapterForKey(key).setItem(key, rawItem);
		}
		catch (error) { console.warn(`[StorageService.set] Failed to stringify value: ${key} - ${String(error)}`); return; }
	}
	async removeItem(key: StorageKeys): Promise<void> { await this._adapterForKey(key).removeItem(key); }

	async clearSensitive(): Promise<void> { for (const key of SENSITIVE_KEYS) { await this._sensitiveAdapter.removeItem(key); } }
	async clearNonSensitive(): Promise<void> { for (const key of NON_SENSITIVE_KEYS) { await this._nonSensitiveAdapter.removeItem(key); } }
	async clearAll(): Promise<void> { await this.clearSensitive(); await this.clearNonSensitive(); }
}

const storageService = new StorageService();



export type { StorageServiceOptions };

export { storageService, StorageService };