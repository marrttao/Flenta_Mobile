import { useMemo } from 'react';

import { useTranslation } from './useTranslation';

import { getLocaleForLanguage } from '../utils/languages';
import { formatDate, formatNumber, formatRate, formatAmount } from '../utils/formatters';



interface Formatters
{
	locale: string;

	formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
	formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
	formatAmount: (amount: number) => string;
	formatRate: (rate: number) => string;
}



function useFormatters(): Formatters
{
	const { language } = useTranslation();
	const locale = useMemo(() => getLocaleForLanguage(language), [language]);

	return useMemo<Formatters>
	(
		() =>
		(
			{
				locale,

				formatDate: (date, options) => formatDate(date, locale, options),

				formatNumber: (value, options) => formatNumber(value, locale, options),

				formatAmount: (amount) => formatAmount(amount, locale),
				formatRate: (rate) => formatRate(rate, locale),
			}
		),
		[locale]
	);
}



export type { Formatters };

export { useFormatters };