import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';
import { useAuth } from '../../auth/providers/AuthProvider';
import { kycApi, type KycStatus } from '../api/kycApi';

const KYC_ENABLED = !['false', '0', 'no'].includes(
  (process.env.EXPO_PUBLIC_ENABLE_KYC ?? 'true').trim().toLowerCase(),
);

const DISABLED_STATUS: KycStatus = {
  provider: 'disabled',
  status: 'Disabled',
  canAccess: true,
  sandbox: false,
  failureCode: null,
  updatedAt: null,
};

interface KycContextValue { status: KycStatus | null; pending: boolean; error: string; load: (synchronize?: boolean) => Promise<KycStatus | null> }
const KycContext = createContext<KycContextValue | null>(null);

export function KycProvider({ children }: PropsWithChildren) {
  const { user, request, kycEpoch } = useAuth();
  const owner = user?.id;
  const identity = `${owner ?? ''}:${kycEpoch}`;
  const latest = useRef(identity);
  useLayoutEffect(() => {
    latest.current = identity;
    return () => { latest.current = ''; };
  }, [identity]);
  const inFlight = useRef<{ identity: string; promise: Promise<KycStatus | null> } | null>(null);
  const [result, setResult] = useState<{ identity: string; status: KycStatus | null; error: string } | null>(null);
  const load = useCallback((synchronize = false): Promise<KycStatus | null> => {
    if (!KYC_ENABLED) return Promise.resolve(DISABLED_STATUS);
    if (!owner) return Promise.resolve(null);
    if (inFlight.current?.identity === identity) return inFlight.current.promise;
    const promise = (synchronize ? kycApi.refresh(request) : kycApi.status(request)).then((status) => {
      if (latest.current === identity) setResult({ identity, status, error: '' });
      return status;
    }).catch((failure: unknown) => {
      if (latest.current === identity) setResult({ identity, status: null, error: failure instanceof Error ? failure.message : 'Не вдалося перевірити статус.' });
      throw failure;
    }).finally(() => { if (inFlight.current?.promise === promise) inFlight.current = null; });
    inFlight.current = { identity, promise };
    return promise;
  }, [owner, identity, request]);
  useEffect(() => { void load().catch(() => {}); }, [load]);
  const active = result?.identity === identity ? result : null;
  const status = active?.status ?? null;
  useEffect(() => {
    if (!KYC_ENABLED) return;
    if (!owner) return;
    const listener = AppState.addEventListener('change', (state) => { if (state === 'active') void load(true).catch(() => {}); });
    const timer = setInterval(() => {
      if (AppState.currentState === 'active' && status && !status.canAccess && ['InProgress', 'PendingReview', 'NeedsResubmission'].includes(status.status)) {
        void load(true).catch(() => {});
      }
    }, 15_000);
    return () => { listener.remove(); clearInterval(timer); };
  }, [owner, status, load]);
  if (!KYC_ENABLED) {
    return (
      <KycContext.Provider value={{ status: DISABLED_STATUS, pending: false, error: '', load: () => Promise.resolve(DISABLED_STATUS) }}>
        {children}
      </KycContext.Provider>
    );
  }
  return <KycContext.Provider value={{ status, pending: Boolean(owner && !active), error: active?.error ?? '', load }}>{children}</KycContext.Provider>;
}
export function useKyc() { const value = useContext(KycContext); if (!value) throw new Error('KycProvider is required.'); return value; }