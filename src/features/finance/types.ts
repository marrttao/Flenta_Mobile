export interface Rates { date: string; source: string; uahPerUnit: Record<string, number> }
export interface Goal {
  id: string; fundingAccountId: string; name: string; currency: string; target: number; balance: number; progressPercent: number;
  deadline: string | null; mode: 'Off' | 'Percentage' | 'RoundUp'; percentage: number; roundUpStep: number; archived: boolean;
}
export type GoalSettings = Pick<Goal, 'name' | 'target' | 'deadline' | 'mode' | 'percentage' | 'roundUpStep'>;
export interface ExchangeQuote { id: string; receivedAmount: number; destinationCurrency: string; rate: number; fee: number; expiresAt: string }
export interface CurrencyAnalytics { currency: string; availableBalance: number; savingsBalance: number; income: number; expenses: number; fees: number; cashback: number }
export interface Analytics { from: string; through: string; currencies: CurrencyAnalytics[] }
