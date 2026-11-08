import { useMemo } from 'react';

import { calculateCrossRate } from '../utils/crossRate';



function useCrossRate(amount: number, from: string, to: string, rates: Record<string, number> | null): number | null
{
	return useMemo
	(
		() =>
		{
			if (!rates || !Number.isFinite(amount) || amount <= 0) { return null; }
			if (from === to) { return amount; }

			const rateFrom = rates[from];
			const rateTo = rates[to];
			if (!Number.isFinite(rateFrom) || rateFrom <= 0 || !Number.isFinite(rateTo) || rateTo <= 0) { return null; }

			const result = calculateCrossRate(amount, rateFrom, rateTo);
			return Number.isFinite(result) ? result : null;
		},
		[amount, from, to, rates]
	);
}



export { useCrossRate };