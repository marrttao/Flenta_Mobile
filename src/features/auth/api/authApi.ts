import type { ApiRequest } from './httpClient.ts';
import type { AuthSession, RegistrationResult } from '../types.ts';

export function createAuthApi(request: ApiRequest) {
  return {
    login: (email: string, password: string) => request<AuthSession>('/api/auth/login', { method: 'POST', body: { email, password } }),
    register: (email: string, password: string, displayName: string, codeChallenge: string) =>
      request<RegistrationResult>('/api/auth/register', { method: 'POST', body: { email, password, displayName, codeChallenge, client: 'mobile' } }),
    refresh: (refreshToken: string) => request<AuthSession>('/api/auth/refresh', { method: 'POST', body: { refreshToken } }),
    recover: (email: string, codeChallenge: string) => request<void>('/api/auth/recover', { method: 'POST', body: { email, codeChallenge, client: 'mobile' } }),
    exchange: (code: string, codeVerifier: string) => request<AuthSession>('/api/auth/exchange', { method: 'POST', body: { code, codeVerifier } }),
    logout: (token: string) => request<void>('/api/auth/logout', { method: 'POST', token }),
  };
}
export type AuthApi = ReturnType<typeof createAuthApi>;
