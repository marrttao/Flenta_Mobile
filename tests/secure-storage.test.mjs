import test from 'node:test';
import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import * as store from './fixtures/secure-store.mjs';
import { SessionService } from '../src/features/auth/services/sessionService.ts';
import { StorageKeys } from '../src/storage/keys.ts';
import { SecureStorageAdapter as WebStorage } from '../src/storage/adapters/secure-storage-adapter.web.ts';

// Replace only the native bridge; exercise the real adapter and session service.
const hook = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'expo-secure-store') return {
      url: new URL('./fixtures/secure-store.mjs', import.meta.url).href, shortCircuit: true,
    };
    return nextResolve(specifier, context);
  },
});
const { SecureStorageAdapter } = await import('../src/storage/adapters/secure-storage-adapter.ts');
hook.deregister();

test('native secure storage reads, writes and removes values', async () => {
  store.reset();
  const adapter = new SecureStorageAdapter();
  await adapter.setItem('key', 'value');
  assert.equal(await adapter.getItem('key'), 'value');
  await adapter.removeItem('key');
  assert.equal(await adapter.getItem('key'), null);
});

test('native secure storage propagates read, write and delete failures', async () => {
  store.reset();
  const adapter = new SecureStorageAdapter();
  const failure = new Error('Native bridge unavailable');
  store.configureFailure(failure);
  try {
    await assert.rejects(adapter.getItem('key'), (error) => error === failure);
    await assert.rejects(adapter.setItem('key', 'value'), (error) => error === failure);
    await assert.rejects(adapter.removeItem('key'), (error) => error === failure);
  } finally { store.reset(); }
});

test('failed logout storage deletion is visible and can be retried', async () => {
  store.reset();
  const adapter = new SecureStorageAdapter();
  const session = { accessToken: 'access', refreshToken: 'refresh', expiresIn: 3600,
    user: { id: 'user', email: 'user@example.test', displayName: 'User', emailConfirmed: true } };
  const service = new SessionService({ async logout() {} }, async () => ({}), adapter);
  await service.completeAuthentication(session, service.beginAuthentication());
  store.configureFailure(new Error('Native deletion failed'));
  await service.logout();
  assert.equal(service.getSnapshot().user, null);
  assert.match(service.getSnapshot().error, /захищене сховище/);
  store.configureFailure(null);
  assert.equal(await adapter.getItem(StorageKeys.REFRESH_TOKEN), 'refresh');
  await service.logout();
  assert.equal(await adapter.getItem(StorageKeys.REFRESH_TOKEN), null);
  assert.equal(service.getSnapshot().error, '');
});

test('failed native reads are reported during startup restore', async () => {
  store.reset();
  store.configureFailure(new Error('Native read failed'));
  const service = new SessionService({}, async () => ({}), new SecureStorageAdapter());
  try {
    await service.restore();
    assert.equal(service.getSnapshot().user, null);
    assert.equal(service.getSnapshot().isRestoringSession, false);
    assert.match(service.getSnapshot().error, /відновити сесію/);
  } finally { store.reset(); }
});

test('web preview propagates browser storage failures', async () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    get sessionStorage() { throw new Error('Browser storage blocked'); },
  } });
  try {
    const adapter = new WebStorage();
    await assert.rejects(adapter.getItem('key'), /Browser storage blocked/);
    await assert.rejects(adapter.setItem('key', 'value'), /Browser storage blocked/);
    await assert.rejects(adapter.removeItem('key'), /Browser storage blocked/);
  } finally {
    if (original) Object.defineProperty(globalThis, 'window', original);
    else delete globalThis.window;
  }
});

test('web storage permits server rendering without window', async () => {
  const adapter = new WebStorage();
  assert.equal(await adapter.getItem('key'), null);
  await adapter.setItem('key', 'value');
  await adapter.removeItem('key');
});
