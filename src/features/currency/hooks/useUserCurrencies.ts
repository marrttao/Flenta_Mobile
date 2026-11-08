import { useEffect, useRef, useState } from 'react';

import type { UserCurrency } from '../../../typification';

import { storageService, StorageKeys } from '../../../storage/index';
import { isUserCurrencyList, reorderUserCurrencies } from '../utils/userCurrencies';



const DEFAULT_CURRENCIES: UserCurrency[] = [{ code: 'USD', order: 0 }, { code: 'EUR', order: 1 }];



export interface UseUserCurrenciesResult
{
	currencies: UserCurrency[];
	
	addCurrency: (code: string) => Promise<void>;
	removeCurrency: (code: string) => Promise<void>;
	reorderCurrencies: (newOrder: string[]) => Promise<void>;
}



function useUserCurrencies(): UseUserCurrenciesResult
{
	const [currencies, setCurrencies] = useState<UserCurrency[]>(DEFAULT_CURRENCIES);
	const currenciesRef = useRef<UserCurrency[]>(DEFAULT_CURRENCIES);
	const loading = useRef<Promise<void>>(Promise.resolve());
	const writes = useRef<Promise<void>>(Promise.resolve());

	useEffect
	(
		() =>
		{
			let active = true;
			loading.current = (
				async () =>
				{
					const stored = await storageService.getItem<unknown>(StorageKeys.USER_CURRENCY_LIST);
					if (!active) { return; }
			
					const next = isUserCurrencyList(stored) ? stored : DEFAULT_CURRENCIES;
					currenciesRef.current = next;
					setCurrencies(next);
				}
			)();
			return () => { active = false; };
		},
		[]
	);

	const persist = (next: UserCurrency[]) =>
	{
		writes.current = writes.current.catch(() => {}).then(() => storageService.setItem(StorageKeys.USER_CURRENCY_LIST, next));
		return writes.current;
	};

	const addCurrency = async (code: string) =>
	{
		if (!/^[A-Z]{3}$/.test(code)) { return; }
		await loading.current;

		const previous = currenciesRef.current;
		if (previous.some((currency) => currency.code === code)) { return; }

		const next = [...previous, { code, order: previous.length }];
		currenciesRef.current = next;
		
		setCurrencies(next);
		await persist(next);
	};

	const removeCurrency = async (code: string) =>
	{
		await loading.current;
		const previous = currenciesRef.current;
		const next = previous.filter((currency) => currency.code !== code).map((currency, index) => ({ ...currency, order: index }));

		currenciesRef.current = next;
		
		setCurrencies(next);
		await persist(next);
	};

	const reorderCurrencies = async (newOrder: string[]) =>
	{
		await loading.current;
		const previous = currenciesRef.current;
		const next = reorderUserCurrencies(previous, newOrder);

		currenciesRef.current = next;
		
		setCurrencies(next);
		await persist(next);
	};

	return { currencies, addCurrency, removeCurrency, reorderCurrencies };
}



export { useUserCurrencies };
