import type { AuthRequest, AuthUser } from '../../auth/types';
export const profileApi = {
  get: (request: AuthRequest) => request<AuthUser>('/api/profile'),
  update: (request: AuthRequest, displayName: string) => request<AuthUser>('/api/profile', { method: 'PUT', body: { displayName } }),
  changePassword: (request: AuthRequest, newPassword: string) => request<void>('/api/auth/password', { method: 'PUT', body: { newPassword } }),
};
