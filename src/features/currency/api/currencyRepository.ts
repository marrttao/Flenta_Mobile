import type { OperationResult } from '../types';



const MOCK_DELAY_MS = 350;

async function buyCurrency(currencyCode: string, amount: number): Promise<OperationResult>
{
	await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
	return { success: true, message: `Successfully bought ${amount} ${currencyCode}` };
}

async function sellCurrency(currencyCode: string, amount: number): Promise<OperationResult>
{
	await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
	return { success: true, message: `Successfully sold ${amount} ${currencyCode}` };
}



export const currencyRepository = { buyCurrency, sellCurrency };