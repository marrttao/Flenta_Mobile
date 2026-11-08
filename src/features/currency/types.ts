interface FrankfurterLatestResponse
{
	amount: number;
	base: string;
	date: string;
	rates: Record<string, number>;
}

interface CurrencyRate
{
	code: string;
	rate: number;
	date: string;
}

interface OperationResult
{
	success: boolean;
	message?: string;
}



export type { FrankfurterLatestResponse, CurrencyRate, OperationResult };