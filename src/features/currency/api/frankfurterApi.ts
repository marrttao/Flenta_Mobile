import type { FrankfurterLatestResponse } from '../types';



const BASE_URL = 'https://api.frankfurter.dev';



async function fetchLatestRates(baseCurrency: string = 'USD', signal?: AbortSignal): Promise<FrankfurterLatestResponse>
{
	const response = await fetch(`${BASE_URL}/v1/latest?base=${baseCurrency}`, { signal });
	if (!response.ok) { throw new Error(`[frankfurterApi].fetchLatestRates() error: ${response.status} ${response.statusText}`); }
	
	return response.json() as Promise<FrankfurterLatestResponse>;
}

async function fetchCrossRate(from: string, to: string, signal?: AbortSignal): Promise<number>
{
	const response = await fetch(`${BASE_URL}/v2/rate/${from}/${to}`, { signal });
	if (!response.ok) { throw new Error(`[frankfurterApi].fetchCrossRate() error: ${response.status} ${response.statusText}`); }

	const data = await response.json() as { rate: number };
	return data.rate;
}



export { fetchLatestRates, fetchCrossRate };