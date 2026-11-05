import test from 'node:test';
import assert from 'node:assert/strict';
import { SessionService } from '../src/features/auth/services/sessionService.ts';
import { ApiError } from '../src/features/auth/api/httpClient.ts';
import { StorageKeys } from '../src/storage/keys.ts';

const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const session = (token = 'old', id = 'user-1', expiresIn = 3600) => ({ accessToken: token, refreshToken: `refresh-${token}`, expiresIn,
  user: { id, email: `${id}@example.test`, displayName: id, emailConfirmed: true } });
function fixture(overrides = {}) {
  const stored = new Map();
  const storage = { async getItem(key) { return stored.get(key) ?? null; }, async setItem(key, value) { stored.set(key, value); }, async removeItem(key) { stored.delete(key); }, ...overrides.storage };
  const api = { async refresh() { return session('new'); }, async logout() {}, ...overrides.api };
  const service = new SessionService(api, overrides.send ?? (async () => ({ ok: true })), storage);
  const login = (value = session()) => service.completeAuthentication(value, service.beginAuthentication());
  return { service, login, stored };
}

test('concurrent 401 responses rotate once and retry each request with the new token', async () => {
  let refreshes = 0; const gate = deferred(); const ready = deferred(); const tokens = [];
  const { service, login, stored } = fixture({ api: { refresh: () => { refreshes++; ready.resolve(); return gate.promise; } },
    send: async (_path, { token }) => { tokens.push(token); if (token === 'old') throw new ApiError('Expired', 401); return token; } });
  await login(); const a = service.request('/api/accounts'); const b = service.request('/api/cards');
  await ready.promise; gate.resolve(session('new'));
  assert.deepEqual(await Promise.all([a, b]), ['new', 'new']); assert.equal(refreshes, 1);
  assert.equal(stored.get(StorageKeys.REFRESH_TOKEN), 'refresh-new'); assert.equal(tokens.filter((value) => value === 'new').length, 2);
});

test('logout while refresh is running prevents reauthentication and a request replay', async () => {
  const gate = deferred(); const ready = deferred(); let sends = 0;
  const { service, login, stored } = fixture({ api: { refresh: () => { ready.resolve(); return gate.promise; } }, send: async () => { sends++; throw new ApiError('Expired', 401); } });
  await login(); const request = service.request('/api/accounts'); const rejected = assert.rejects(request, /Сесію змінено/);
  await ready.promise; await service.logout(); gate.resolve(session('new')); await rejected;
  assert.equal(service.getSnapshot().user, null); assert.equal(stored.has(StorageKeys.REFRESH_TOKEN), false); assert.equal(sends, 1);
});

test('a stale response from another account is rejected', async () => {
  const gate = deferred(); const ready = deferred();
  const { service, login } = fixture({ send: async () => { ready.resolve(); return gate.promise; } });
  await login(); const request = service.request('/api/accounts'); const rejected = assert.rejects(request, /Сесію змінено/);
  await ready.promise; await login(session('other', 'user-2')); gate.resolve({ owner: 'user-1' }); await rejected;
  assert.equal(service.getSnapshot().user.id, 'user-2');
});

test('a late refresh from an old account cannot replace the new login', async () => {
  const gate = deferred(); const ready = deferred();
  const { service, login, stored } = fixture({ api: { refresh: () => { ready.resolve(); return gate.promise; } }, send: async () => { throw new ApiError('Expired', 401); } });
  await login(); const request = service.request('/api/accounts'); const rejected = assert.rejects(request);
  await ready.promise; await login(session('second', 'user-2')); gate.resolve(session('late')); await rejected;
  assert.equal(service.getSnapshot().user.id, 'user-2'); assert.equal(stored.get(StorageKeys.REFRESH_TOKEN), 'refresh-second');
});

test('terminal refresh failure clears the session; an offline refresh preserves it', async () => {
  for (const status of [401, 0, 503]) {
    const { service, login, stored } = fixture({ api: { async refresh() { throw new ApiError('Failure', status); } }, send: async () => { throw new ApiError('Expired', 401); } });
    await login(); await assert.rejects(service.request('/api/accounts'));
    assert.equal(Boolean(service.getSnapshot().user), status !== 401); assert.equal(stored.has(StorageKeys.REFRESH_TOKEN), status !== 401);
  }
});

test('a second 401 after refresh ends the session without an infinite retry', async () => {
  let refreshes = 0; let sends = 0;
  const { service, login } = fixture({ api: { async refresh() { refreshes++; return session('new'); } }, send: async () => { sends++; throw new ApiError('Unauthorized', 401); } });
  await login(); await assert.rejects(service.request('/api/accounts')); assert.equal(sends, 2); assert.equal(refreshes, 1); assert.equal(service.getSnapshot().user, null);
});

test('startup restore collapses duplicate calls and persists the rotated refresh token only', async () => {
  let refreshes = 0;
  const { service, stored } = fixture({ api: { async refresh(token) { refreshes++; assert.equal(token, 'refresh-saved'); return session('restored'); } } });
  stored.set(StorageKeys.REFRESH_TOKEN, 'refresh-saved'); await Promise.all([service.restore(), service.restore()]);
  assert.equal(refreshes, 1); assert.equal(service.getSnapshot().isRestoringSession, false); assert.equal(service.getSnapshot().user.id, 'user-1');
  assert.deepEqual([...stored], [[StorageKeys.REFRESH_TOKEN, 'refresh-restored']]);
});

test('offline startup keeps the saved refresh token so restoration can be retried', async () => {
  let offline = true;
  const { service, stored } = fixture({ api: { async refresh() { if (offline) throw new ApiError('Offline', 0); return session('restored'); } } });
  stored.set(StorageKeys.REFRESH_TOKEN, 'refresh-saved'); await service.restore();
  assert.equal(stored.get(StorageKeys.REFRESH_TOKEN), 'refresh-saved'); assert.ok(service.getSnapshot().error); assert.equal(service.getSnapshot().isRestoringSession, false);
  offline = false; await service.restore(); assert.equal(service.getSnapshot().user.id, 'user-1'); assert.equal(service.getSnapshot().error, '');
});

test('late startup restore cannot replace a login', async () => {
  const gate = deferred(); const ready = deferred();
  const { service, login, stored } = fixture({ api: { refresh: () => { ready.resolve(); return gate.promise; } } });
  stored.set(StorageKeys.REFRESH_TOKEN, 'refresh-saved'); const restore = service.restore(); await ready.promise;
  await login(session('login', 'user-2')); gate.resolve(session('restored')); await restore;
  assert.equal(service.getSnapshot().user.id, 'user-2'); assert.equal(stored.get(StorageKeys.REFRESH_TOKEN), 'refresh-login');
});

test('serialized secure storage writes cannot leave an old token after logout', async () => {
  const gate = deferred(); const ready = deferred(); const values = new Map();
  const { service, login } = fixture({ storage: { async setItem(key, value) { ready.resolve(); await gate.promise; values.set(key, value); }, async removeItem(key) { values.delete(key); } } });
  const loggingIn = login(); await ready.promise; const loggingOut = service.logout(); gate.resolve(); await Promise.all([loggingIn, loggingOut]);
  assert.equal(service.getSnapshot().user, null); assert.equal(values.size, 0);
});

test('expired sessions refresh proactively and do not invalidate KYC for the same owner', async () => {
  const tokens = []; const { service, login } = fixture({ send: async (_path, options) => { tokens.push(options.token); return true; } });
  await login(session('old', 'user-1', 0)); const epoch = service.getSnapshot().kycEpoch;
  await service.request('/api/accounts'); assert.deepEqual(tokens, ['new']); assert.equal(service.getSnapshot().kycEpoch, epoch);
});

test('KYC errors invalidate status; KYC endpoint errors do not recursively invalidate it', async () => {
  const { service, login } = fixture({ send: async () => { throw new ApiError('KYC', 403, 'kyc.required'); } });
  await login(); const epoch = service.getSnapshot().kycEpoch;
  await assert.rejects(service.request('/api/accounts')); assert.equal(service.getSnapshot().kycEpoch, epoch + 1);
  await assert.rejects(service.request('/api/kyc')); assert.equal(service.getSnapshot().kycEpoch, epoch + 1);
});
