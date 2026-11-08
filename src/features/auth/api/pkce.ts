import * as Crypto from 'expo-crypto';
import { SecureStorageAdapter } from '../../../storage/adapters/secure-storage-adapter';
import { AuthStorageKeys } from '../../../storage/keys';

export type PkcePurpose = 'confirm-email' | 'reset-password';
interface PkceValue { verifier: string; createdAt: number; purpose: PkcePurpose }

const authStorage = new SecureStorageAdapter();

export async function startPkce(purpose: PkcePurpose)
{
    const random = await Crypto.getRandomBytesAsync(32);
    const verifier = Array.from(random, (value) => value.toString(16).padStart(2, '0')).join('');
    const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, { encoding: Crypto.CryptoEncoding.BASE64 });
    await authStorage.setItem(AuthStorageKeys.PKCE, JSON.stringify({ verifier, createdAt: Date.now(), purpose }));
    return digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function getVerifier(purpose: PkcePurpose)
{
    let stored: PkceValue | null = null;
    try { stored = JSON.parse(await authStorage.getItem(AuthStorageKeys.PKCE) ?? 'null') as PkceValue | null; } catch {}
    if (!stored || !/^[a-f0-9]{64}$/.test(stored.verifier) || stored.purpose !== purpose || !Number.isFinite(stored.createdAt)
      || Date.now() - stored.createdAt > 60 * 60 * 1000 || stored.createdAt > Date.now())
    { throw new Error('Запроси новий лист у цьому застосунку та відкрий посилання на цьому самому пристрої.'); }
    return stored.verifier;
}

export const clearVerifier = () => authStorage.removeItem(AuthStorageKeys.PKCE);