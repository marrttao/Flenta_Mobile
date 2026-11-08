enum StorageKeys
{
	USER_CURRENCY_LIST = 'flenta.user_currency_list',
	THEME = 'flenta.theme',

	ACCESS_TOKEN = 'flenta.access_token',
	REFRESH_TOKEN = 'flenta.refresh_token',
	SESSION_USER_ID = 'flenta.session_user_id',
}



const AuthStorageKeys = { PKCE: 'flenta.auth.pkce' } as const;



export { StorageKeys };

export { AuthStorageKeys };