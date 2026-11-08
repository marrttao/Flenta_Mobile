import type { UserCurrency } from '../../../typification';



function isUserCurrencyList(value: unknown): value is UserCurrency[]
{
	if (!Array.isArray(value)) { return false; }

	const codes = new Set<string>();
	return value.every
	(
		(item) =>
		{
			if (typeof item !== 'object' || item === null || typeof item.code !== 'string' || !/^[A-Z]{3}$/.test(item.code) || !Number.isInteger(item.order) || item.order < 0 || codes.has(item.code))
			{ return false; }

			codes.add(item.code);
			return true;
		}
	);
}

function reorderUserCurrencies(previous: UserCurrency[], newOrder: string[]): UserCurrency[]
{
	const remaining = new Map(previous.map((currency) => [currency.code, currency]));
	const ordered: UserCurrency[] = [];

	for (const code of newOrder)
	{
		const currency = remaining.get(code);
		if (!currency) { continue; }

		ordered.push(currency);
		remaining.delete(code);
	}

	return [...ordered, ...remaining.values()].map((currency, order) => ({ ...currency, order }));
}



export { isUserCurrencyList, reorderUserCurrencies };