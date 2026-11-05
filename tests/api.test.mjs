import test from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, createHttpClient } from '../src/features/auth/api/httpClient.ts';
import { createAuthApi } from '../src/features/auth/api/authApi.ts';
import { createIdempotentRequest } from '../src/features/banking/api/idempotency.ts';
import { parseAmount } from '../src/features/banking/utils/money.ts';
import { normalizeIncomingPath, readCallbackCode } from '../src/features/auth/utils/callback.ts';

test('HTTP sends backend auth and idempotency headers, handles 204 and validation Problem Details', async () => {
  const calls = []; const responses = [new Response(null, { status: 204 }), Response.json({ errors: { amount: ['Invalid amount'] }, code: 'amount.invalid' }, { status: 400 })];
  const client = createHttpClient('https://api.example.test/', async (url, options) => { calls.push({ url, options }); return responses.shift(); });
  assert.equal(await client('/api/profile', { method: 'PUT', body: { displayName: 'Maris' }, token: 'access', idempotencyKey: 'operation' }), null);
  assert.equal(calls[0].url, 'https://api.example.test/api/profile'); assert.equal(calls[0].options.headers.Authorization, 'Bearer access');
  assert.equal(calls[0].options.headers['Idempotency-Key'], 'operation'); assert.equal(calls[0].options.body, '{"displayName":"Maris"}');
  await assert.rejects(client('/api/accounts'), (error) => error instanceof ApiError && error.status === 400 && error.code === 'amount.invalid' && error.message === 'Invalid amount');
});

test('HTTP handles offline, malformed success and non-JSON errors', async () => {
  await assert.rejects(createHttpClient('https://api.test', async () => { throw new Error('Network'); })('/api/accounts'), (error) => error.status === 0);
  await assert.rejects(createHttpClient('https://api.test', async () => new Response('<html>bad</html>'))('/api/accounts'), (error) => error.code === 'client.invalid_response');
  await assert.rejects(createHttpClient('https://api.test', async () => new Response('<html>bad</html>', { status: 502 }))('/api/accounts'), (error) => error.status === 502);
});

test('HTTP refuses absolute URLs before exposing a token', async () => {
  let called = false; const request = createHttpClient('https://api.test', async () => { called = true; return Response.json({}); });
  await assert.rejects(request('https://bad.test/api/profile', { token: 'secret' })); assert.equal(called, false);
});

test('mobile auth asks backend to select mobile callbacks and sends PKCE to exchange', async () => {
  const calls = []; const api = createAuthApi(async (path, options) => { calls.push({ path, ...options }); return {}; });
  await api.register('a@example.test', 'long-password', 'Name', 'challenge'); await api.recover('a@example.test', 'challenge'); await api.exchange('code', 'verifier');
  assert.equal(calls[0].body.client, 'mobile'); assert.equal(calls[1].body.client, 'mobile');
  assert.deepEqual(calls[2].body, { code: 'code', codeVerifier: 'verifier' });
});

test('lost monetary response reuses the operation key; completion allocates a new one', async () => {
  let id = 0; const keys = []; const execute = createIdempotentRequest(async (_path, options) => { keys.push(options.idempotencyKey); if (keys.length === 1) throw new ApiError('Offline', 0); return { status: 'Completed' }; }, () => `key-${++id}`);
  await assert.rejects(execute('/api/accounts/a/top-ups', { amount: 5 })); await execute('/api/accounts/a/top-ups', { amount: 5 }); await execute('/api/accounts/a/top-ups', { amount: 5 });
  assert.deepEqual(keys, ['key-1', 'key-1', 'key-2']);
});

test('concurrent duplicate money submissions share one request', async () => {
  let resolve; let calls = 0; const gate = new Promise((yes) => { resolve = yes; });
  const execute = createIdempotentRequest(async () => { calls++; return gate; }, () => 'key');
  const a = execute('/api/finance/exchanges', { quoteId: 'a' }); const b = execute('/api/finance/exchanges', { quoteId: 'a' }); resolve({ status: 'Completed' });
  assert.deepEqual(await a, await b); assert.equal(calls, 1);
});

test('distinct payloads keep separate keys and preserve unresolved operations', async () => {
  let id = 0; const keys = []; const execute = createIdempotentRequest(async (_path, options) => { keys.push(options.idempotencyKey); throw new ApiError('Offline', 0); }, () => `key-${++id}`);
  await assert.rejects(execute('/api/accounts/a/top-ups', { amount: 5 })); await assert.rejects(execute('/api/accounts/a/top-ups', { amount: 6 }));
  await assert.rejects(execute('/api/accounts/a/top-ups', { amount: 5 })); assert.deepEqual(keys, ['key-1', 'key-2', 'key-1']);
});

test('a definitive rejected transaction releases its key', async () => {
  let id = 0; const keys = []; const execute = createIdempotentRequest(async (_path, options) => { keys.push(options.idempotencyKey); return { status: 'Rejected' }; }, () => `key-${++id}`);
  await execute('/api/transactions/internal', { amount: 5 }); await execute('/api/transactions/internal', { amount: 5 }); assert.deepEqual(keys, ['key-1', 'key-2']);
});

test('incoming mobile links preserve PKCE code and reject other apps or hosts', () => {
  assert.equal(normalizeIncomingPath('flenta-mobile://app/auth/reset-password?code=abc%2B123'), '/auth/reset-password?code=abc%2B123');
  assert.equal(normalizeIncomingPath('flenta-mobile://app/auth/confirm-email?code=abc'), '/auth/confirm-email?code=abc');
  for (const url of ['https://bad.test/auth/reset-password?code=abc', 'flenta-mobile://evil/auth/reset-password', 'javascript:alert(1)', 'broken']) assert.equal(normalizeIncomingPath(url), '/');
  assert.equal(readCallbackCode({ code: 'abc' }), 'abc');
  assert.throws(() => readCallbackCode({ code: ['a', 'b'] })); assert.throws(() => readCallbackCode({ error: 'expired', code: 'abc' })); assert.throws(() => readCallbackCode({}));
});

test('money input accepts decimal commas without rounding invalid amounts', () => {
  assert.equal(parseAmount('12,50'), 12.5); assert.equal(parseAmount('0.01'), 0.01);
  for (const value of ['', '0', '-1', '0.001', '1e3', 'Infinity', '10000000000.01']) assert.throws(() => parseAmount(value));
});
