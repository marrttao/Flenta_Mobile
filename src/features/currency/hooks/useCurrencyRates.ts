import { useQuery, queryOptions } from '@tanstack/react-query';

import type { FrankfurterLatestResponse } from '../types';

import { DEAFAULT_BASE_CURRENCY } from '../utils/constants';
import { currencyKeys } from './queryKeys';

import { fetchLatestRates } from '../api/frankfurterApi';



export interface UseCurrencyRatesResult
{
	data: FrankfurterLatestResponse | null;
	isLoading: boolean;
	error: string | null;

	refetchRates: () => void;
}



function useCurrencyRates(baseCurrency: string = DEAFAULT_BASE_CURRENCY): UseCurrencyRatesResult
{
	const query = useQuery
	(
		queryOptions
		(
			{
				queryKey: currencyKeys.latest(baseCurrency),
				staleTime: 60_000,

				queryFn: ({ signal }) => fetchLatestRates(baseCurrency, signal)
			}
		)
	);

	return {
		data: query.data ?? null,
		isLoading: query.isLoading,
		error: query.error instanceof Error ? query.error.message : query.error ? 'Unknown error' : null,

		refetchRates: () => { void query.refetch(); },
	};
}



export { useCurrencyRates };