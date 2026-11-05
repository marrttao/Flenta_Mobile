import type { Transaction } from '../types';
import { money } from './money';
export function transactionMessage(value: Transaction) {
  if (value.status !== 'Completed') throw new Error(value.failureCode ? `Операцію відхилено: ${value.failureCode}` : `Статус операції: ${value.status}`);
  return `Операцію виконано: ${money(value.amount, value.currency)}.`;
}
