export interface Account { id: string; iban: string; currency: string; balance: number; createdAt: string }
export interface Card { id: string; accountId: string; maskedNumber: string; status: string; expiryMonth: number; expiryYear: number; sandbox: boolean }
export interface CardSecrets { number: string; cvv: string; expiryMonth: number; expiryYear: number; sandbox: boolean }
export interface Transaction {
  id: string; kind: string; status: string; amount: number; fee: number; currency: string;
  createdAt: string; failureCode: string | null; sourceAccountId: string | null; destinationAccountId: string | null;
}
export interface TransferQuote { amount: number; fee: number; total: number; currency: string; sufficientFunds: boolean }
export interface Transfer { sourceAccountId: string; amount: number }
