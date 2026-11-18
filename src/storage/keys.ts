const StorageKeys =
{
	USER_CURRENCY_LIST: 'flenta.user_currency_list',
	THEME: 'flenta.theme',

	ACCESS_TOKEN: 'flenta.access_token',
	REFRESH_TOKEN: 'flenta.refresh_token',
	SESSION_USER_ID: 'flenta.session_user_id',
} as const;

type StorageKeys = (typeof StorageKeys)[keyof typeof StorageKeys];



const AuthStorageKeys = { PKCE: 'flenta.auth.pkce' } as const;



export { StorageKeys };

export { AuthStorageKeys };
