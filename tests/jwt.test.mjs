import test from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import { decodeJwtPayload, getTokenExpiryMs, isTokenExpired } from '../src/features/auth/utils/jwtUtils.ts';

const token = payload => `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;

test('JWT expiry handles future and expired tokens without trusting other claims', () => {
  const future = Math.floor(Date.now() / 1000) + 3600;
  assert.equal(getTokenExpiryMs(token({ exp: future })), future * 1000);
  assert.equal(isTokenExpired(token({ exp: future })), false);
  assert.equal(isTokenExpired(token({ exp: 1 })), true);
  assert.equal(decodeJwtPayload(token({ name: 'Оля' })).name, 'Оля');
});

test('missing, malformed and overflowing expirations are treated as expired', () => {
  for (const payload of [{}, { exp: '3600' }, { exp: null }, { exp: 1e308 }, [], 42]) {
    assert.equal(getTokenExpiryMs(token(payload)), null);
    assert.equal(isTokenExpired(token(payload)), true);
  }
  for (const value of [null, '', 'broken', 'a.invalid.b']) assert.equal(isTokenExpired(value), true);
});
