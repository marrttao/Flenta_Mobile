export interface AuthUser { id: string; email: string; displayName: string; emailConfirmed: boolean }
export interface AuthSession { accessToken: string; refreshToken: string; expiresIn: number; user: AuthUser }
export interface RegistrationResult { requiresEmailConfirmation: boolean; session: AuthSession | null }
export interface AuthRequestOptions {
  method?: string;
  body?: unknown;
  idempotencyKey?: string;
  signal?: AbortSignal;
}
export type AuthRequest = <T>(path: string, options?: AuthRequestOptions) => Promise<T>;
export interface AsyncStorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
