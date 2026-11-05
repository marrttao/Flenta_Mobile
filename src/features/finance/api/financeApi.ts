import * as Crypto from 'expo-crypto';
import type { AuthRequest } from '../../auth/types';
import type { Transaction } from '../../banking/types';
import { createIdempotentRequest } from '../../banking/api/idempotency';
import type { Analytics, ExchangeQuote, Goal, GoalSettings, Rates } from '../types';

export function createFinanceApi(request: AuthRequest) {
  const money = createIdempotentRequest(request, Crypto.randomUUID);
  return {
    goals: () => request<Goal[]>('/api/goals'),
    rates: () => request<Rates>('/api/finance/rates'),
    cashback: () => request<{ percentage: number; transactions: Transaction[] }>('/api/finance/cashback'),
    analytics: (from: string, through: string) => request<Analytics>(`/api/finance/analytics?from=${encodeURIComponent(from)}&through=${encodeURIComponent(through)}`),
    createGoal: (body: { fundingAccountId: string; name: string; target: number; deadline: string | null }) => request<Goal>('/api/goals', { method: 'POST', body }),
    updateGoal: (id: string, body: GoalSettings) => request<Goal>(`/api/goals/${encodeURIComponent(id)}`, { method: 'PUT', body }),
    archiveGoal: (id: string) => request<Goal>(`/api/goals/${encodeURIComponent(id)}/archive`, { method: 'POST' }),
    moveGoal: (id: string, withdraw: boolean, amount: number) => money<Transaction>(`/api/goals/${encodeURIComponent(id)}/${withdraw ? 'withdrawals' : 'deposits'}`, { amount }),
    quote: (sourceAccountId: string, destinationAccountId: string, amount: number) => request<ExchangeQuote>('/api/finance/exchange-quotes', { method: 'POST', body: { sourceAccountId, destinationAccountId, amount } }),
    exchange: (quoteId: string) => money<Transaction>('/api/finance/exchanges', { quoteId }),
    purchase: (cardId: string, amount: number) => money<Transaction>('/api/finance/purchases', { cardId, amount }),
  };
}
