import type { AuthRequest } from '../../auth/types';
export interface KycStatus { provider: string; status: string; canAccess: boolean; sandbox: boolean; failureCode: string | null; updatedAt: string | null }
export interface KycSession { sessionId: string; url: string; sandbox: boolean }
export const kycApi = {
  status: (request: AuthRequest) => request<KycStatus>('/api/kyc'),
  refresh: (request: AuthRequest) => request<KycStatus>('/api/kyc/refresh', { method: 'POST' }),
  session: (request: AuthRequest) => request<KycSession>('/api/kyc/session', { method: 'POST' }),
};
