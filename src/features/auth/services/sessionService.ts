import { ApiError, type ApiRequest } from '../api/httpClient.ts';
import type { AuthApi } from '../api/authApi.ts';
import type { AsyncStorageAdapter, AuthRequest, AuthSession, AuthUser } from '../types.ts';
import { StorageKeys } from '../../../storage/keys.ts';

export interface SessionState { user: AuthUser | null; isRestoringSession: boolean; expiresAt: number | null; kycEpoch: number; error: string }

// Provider-independent lifecycle, following Desktop's version guard and single refresh.
export class SessionService {
  private session: AuthSession | null = null;
  private version = 0;
  private refreshInFlight: { version: number; promise: Promise<AuthSession> } | null = null;
  private restoreInFlight: Promise<void> | null = null;
  private writes: Promise<void> = Promise.resolve();
  private listeners = new Set<() => void>();
  private state: SessionState = { user: null, isRestoringSession: true, expiresAt: null, kycEpoch: 0, error: '' };
  private api: AuthApi;
  private send: ApiRequest;
  private storage: AsyncStorageAdapter;

  constructor(api: AuthApi, send: ApiRequest, storage: AsyncStorageAdapter) { this.api = api; this.send = send; this.storage = storage; }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private update(patch: Partial<SessionState>) { this.state = { ...this.state, ...patch }; this.listeners.forEach((listener) => listener()); }
  private persist(value: AuthSession | null) {
    // Serialize native writes so logout cannot be undone by an older refresh write.
    this.writes = this.writes.catch(() => {}).then(() => value
      ? this.storage.setItem(StorageKeys.REFRESH_TOKEN, value.refreshToken)
      : this.storage.removeItem(StorageKeys.REFRESH_TOKEN));
    return this.writes;
  }
  private async accept(value: AuthSession | null) {
    const ownerChanged = this.session?.user.id !== value?.user.id;
    this.session = value;
    this.update({ user: value?.user ?? null, expiresAt: value ? Date.now() + value.expiresIn * 1000 : null,
      kycEpoch: this.state.kycEpoch + (ownerChanged ? 1 : 0), error: '' });
    try { await this.persist(value); }
    catch { this.update({ error: 'Не вдалося оновити захищене сховище сесії. Повтори вихід перед закриттям застосунку.' }); }
  }
  beginAuthentication() { this.version += 1; return this.version; }
  async completeAuthentication(value: AuthSession, version: number) {
    this.assertVersion(version);
    await this.accept(value);
  }
  private assertVersion(version: number) {
    if (version !== this.version) throw new Error('Сесію змінено. Повтори дію.');
  }
  restore = (): Promise<void> => {
    if (this.restoreInFlight) return this.restoreInFlight;
    const version = this.version;
    this.update({ isRestoringSession: true, error: '' });
    this.restoreInFlight = (async () => {
      try {
        const token = await this.storage.getItem(StorageKeys.REFRESH_TOKEN);
        if (version !== this.version || !token) return;
        const value = await this.api.refresh(token);
        if (version === this.version) await this.accept(value);
      } catch (error) {
        if (version !== this.version) return;
        if (error instanceof ApiError && [400, 401, 403].includes(error.status)) await this.accept(null);
        else this.update({ error: 'Не вдалося відновити сесію. Перевір з’єднання й повтори спробу.' });
      } finally {
        this.restoreInFlight = null;
        this.update({ isRestoringSession: false });
      }
    })();
    return this.restoreInFlight;
  };
  private refresh(): Promise<AuthSession> {
    const version = this.version;
    if (this.refreshInFlight?.version === version) return this.refreshInFlight.promise;
    if (!this.session) return Promise.reject(new Error('Увійди до облікового запису.'));
    const promise = this.api.refresh(this.session.refreshToken).then(async (value) => {
      this.assertVersion(version);
      await this.accept(value);
      this.assertVersion(version);
      return value;
    }).catch(async (error: unknown) => {
      if (version === this.version && error instanceof ApiError && [400, 401, 403].includes(error.status)) {
        this.version += 1;
        await this.accept(null);
      }
      throw error;
    }).finally(() => { if (this.refreshInFlight?.promise === promise) this.refreshInFlight = null; });
    this.refreshInFlight = { version, promise };
    return promise;
  }
  refreshIfNeeded = async () => {
    if (this.session && (this.state.expiresAt ?? 0) - Date.now() < 30_000) await this.refresh();
  };
  request: AuthRequest = async <T>(path: string, options = {}): Promise<T> => {
    if (!this.session) throw new Error('Увійди до облікового запису.');
    const version = this.version;
    await this.refreshIfNeeded();
    this.assertVersion(version);
    const token = this.session!.accessToken;
    const send = async (accessToken: string) => {
      try {
        const result = await this.send<T>(path, { ...options, token: accessToken });
        this.assertVersion(version);
        return result;
      } catch (error) {
        if (version === this.version && error instanceof ApiError && error.code?.startsWith('kyc.') && !path.startsWith('/api/kyc')) {
          this.update({ kycEpoch: this.state.kycEpoch + 1 });
        }
        throw error;
      }
    };
    try { return await send(token); }
    catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401 || version !== this.version || !this.session) throw error;
      const current = this.session.accessToken !== token ? this.session : await this.refresh();
      this.assertVersion(version);
      try { return await send(current.accessToken); }
      catch (retryError) {
        if (version === this.version && retryError instanceof ApiError && retryError.status === 401) {
          this.version += 1;
          await this.accept(null);
        }
        throw retryError;
      }
    }
  };
  logout = async () => {
    const token = this.session?.accessToken;
    this.version += 1;
    await this.accept(null);
    if (token) await this.api.logout(token);
  };
  updateUser = (user: AuthUser) => {
    if (this.session?.user.id === user.id) { this.session = { ...this.session, user }; this.update({ user }); }
  };
}
