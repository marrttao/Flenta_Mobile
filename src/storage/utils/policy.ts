import { StorageKeys } from '../keys';



const SENSITIVE_KEYS: ReadonlySet<StorageKeys> = new Set
(
	[
		StorageKeys.ACCESS_TOKEN,
		StorageKeys.REFRESH_TOKEN,
		StorageKeys.SESSION_USER_ID,
	]
)

const NON_SENSITIVE_KEYS: ReadonlySet<StorageKeys> = new Set
(
	[
		StorageKeys.USER_CURRENCY_LIST,
		StorageKeys.THEME,
	]
)



function isSensitiveKey(key: StorageKeys): boolean { return SENSITIVE_KEYS.has(key); }



export { SENSITIVE_KEYS, NON_SENSITIVE_KEYS };
export { isSensitiveKey };