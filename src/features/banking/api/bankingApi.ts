import * as Crypto from 'expo-crypto';
import type { AuthRequest } from '../../auth/types';
import type { Account, Card, CardSecrets, Transaction, Transfer, TransferQuote } from '../types';
import { createIdempotentRequest } from './idempotency';

export function createBankingApi(request: AuthRequest) {
  const operation = createIdempotentRequest(request, Crypto.randomUUID);
  return {
    snapshot: async (offset = 0) => {
      const [accounts, cards, transactions] = await Promise.all([
        request<Account[]>('/api/accounts'), request<Card[]>('/api/cards'), request<Transaction[]>(`/api/transactions?offset=${offset}&limit=20`),
      ]);
      return { accounts, cards, transactions };
    },
    openAccount: (currency = 'UAH') => request<Account>(`/api/accounts?currency=${encodeURIComponent(currency)}`, { method: 'POST' }),
    createCard: (accountId: string) => request<Card>('/api/cards', { method: 'POST', body: { accountId } }),
    changeCard: (id: string, action: 'block' | 'unblock' | 'close') => request<Card>(`/api/cards/${encodeURIComponent(id)}/${action}`, { method: 'POST' }),
    requisites: (id: string, password: string) => request<CardSecrets>(`/api/cards/${encodeURIComponent(id)}/requisites`, { method: 'POST', body: { password } }),
    topUp: (id: string, amount: number) => operation<Transaction>(`/api/accounts/${encodeURIComponent(id)}/top-ups`, { amount }),
    quote: (body: Transfer & { byIban: boolean }) => request<TransferQuote>('/api/transactions/quote', { method: 'POST', body }),
    transfer: (byIban: boolean, body: Transfer & { destinationAccountId?: string; iban?: string }) => operation<Transaction>(`/api/transactions/${byIban ? 'iban' : 'internal'}`, body),
  };
}
