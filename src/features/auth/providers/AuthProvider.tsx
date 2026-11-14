import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import { apiRequest } from '../../../config/api';
import { SecureStorageAdapter } from '../../../storage/adapters/secure-storage-adapter';
import { createAuthApi } from '../api/authApi';
import { clearVerifier, getVerifier, startPkce, type PkcePurpose } from '../api/pkce';
import { SessionService } from '../services/sessionService';
import type { AuthSessionInfo } from '../types';

const authStorage = new SecureStorageAdapter();

function createAuth() {
  const api = createAuthApi(apiRequest);
  const sessions = new SessionService(api, apiRequest, authStorage);
  const exchanges = new Map<string, Promise<void>>();
  return {
    sessions,
    login: async (email: string, password: string) => {
      const version = sessions.beginAuthentication();
      await sessions.completeAuthentication(await api.login(email.trim(), password), version);
    },
    register: async (email: string, password: string, name: string) => {
      const version = sessions.beginAuthentication();
      const challenge = await startPkce('confirm-email');
      const result = await api.register(email.trim(), password, name.trim(), challenge);
      if (result.session) { await sessions.completeAuthentication(result.session, version); await clearVerifier(); }
      return result;
    },
    recover: async (email: string) => { await api.recover(email.trim(), await startPkce('reset-password')); },
    exchangeCode: (code: string, purpose: PkcePurpose) => {
      const key = `${purpose}:${code}`;
      const existing = exchanges.get(key);
      if (existing) return existing;
      const version = sessions.beginAuthentication();
      // Retain successful exchanges in memory so duplicate link events do not consume a code twice.
      const promise = (async () => {
        const verifier = await getVerifier(purpose);
        await sessions.completeAuthentication(await api.exchange(code, verifier), version);
        await clearVerifier();
      })().catch((error: unknown) => { exchanges.delete(key); throw error; });
      exchanges.set(key, promise);
      return promise;
    },
    logout: async () => {
      exchanges.clear();
      try { await sessions.logout(); } finally { await clearVerifier(); }
    },
    // Exposed for idle-timeout "stay here" and future feature-driven refreshes.
    refreshSession: () => sessions.refresh().then(() => {}),
  };
}
type Auth = ReturnType<typeof createAuth>;
const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const auth = useMemo(createAuth, []);
  useEffect(() => { void auth.sessions.restore(); }, [auth]);
  useEffect(() => {
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') void auth.sessions.refreshIfNeeded().catch(() => {});
    });
    return () => listener.remove();
  }, [auth]);
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error('AuthProvider is required.');
  const state = useSyncExternalStore(auth.sessions.subscribe, auth.sessions.getSnapshot, auth.sessions.getSnapshot);

  const sessionInfo = useMemo<AuthSessionInfo | null>(() => {
    if (!state.user) return null;
    return {
      expiresAt: state.expiresAt,
      msUntilExpiry: state.expiresAt ? state.expiresAt - Date.now() : null,
      expiresIn: state.expiresAt ? Math.max(0, Math.floor((state.expiresAt - Date.now()) / 1000)) : null,
    };
  }, [state.user, state.expiresAt]);

  return {
    ...state,
    login: auth.login,
    register: auth.register,
    recover: auth.recover,
    exchangeCode: auth.exchangeCode,
    logout: auth.logout,
    request: auth.sessions.request,
    updateUser: auth.sessions.updateUser,
    retryRestore: auth.sessions.restore,
    refreshSession: auth.refreshSession,
    sessionInfo,
  };
}