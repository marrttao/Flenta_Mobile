const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';



function base64ToBinary(input: string): string
{
	let output = '';
	let buffer = 0;
	let bits = 0;

	for (let index = 0; index < input.length; index++)
	{
		const character = input[index];
		if (character === '=') { break; }

		const value = BASE64_ALPHABET.indexOf(character);
		if (value < 0) { throw new Error(`Invalid base64 character: ${character}`); }

		buffer = (buffer << 6) | value;
		bits += 6;

		if (bits >= 8)
		{
			bits -= 8;
			output += String.fromCharCode((buffer >> bits) & 0xff);
			buffer &= (1 << bits) - 1;
		}
	}

	return output;
}

function base64UrlDecode(input: string): string
{
	const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
	const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

	const binary = base64ToBinary(padded);

	try { return decodeURIComponent(Array.from(binary).map((character) => '%' + ('00' + character.charCodeAt(0).toString(16)).slice(-2)).join('')); }
	catch { return binary; }
}

function decodeJwtPayload<Type = Record<string, unknown>>(token: string): Type | null
{
	if (typeof token !== 'string' || token.length === 0) { return null; }

	const parts = token.split('.');
	if (parts.length < 2) { return null; }

	try
	{
		const json = base64UrlDecode(parts[1]);
		const parsed: unknown = JSON.parse(json);
		
		if (typeof parsed !== 'object' || parsed === null) { return null; }
		
		return parsed as Type;
	}
	catch { return null; }
}

function getTokenExpiryMs(token: string): number | null
{
	const payload = decodeJwtPayload<{ exp?: number }>(token);
	if (!payload || typeof payload.exp !== 'number' || !Number.isFinite(payload.exp)) { return null; }
	return payload.exp * 1000;
}

function isTokenExpired(token: string | null, clockSkewMs = 5_000): boolean
{
	if (!token) { return true; }

	const payload = decodeJwtPayload<{ exp?: number }>(token);
	if (!payload) { return true; }
	if (typeof payload.exp !== 'number') { return false; }

	return Date.now() + clockSkewMs >= payload.exp * 1000;
}



export { base64ToBinary, decodeJwtPayload, getTokenExpiryMs, isTokenExpired };