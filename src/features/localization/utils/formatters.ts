function formatDate(date: Date | string, locale: string, options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' }): string
{
	const dateObject = typeof date === 'string' ? new Date(date) : date;
	return new Intl.DateTimeFormat(locale, options).format(dateObject);
}

function formatNumber(value: number, locale: string, options?: Intl.NumberFormatOptions): string { return new Intl.NumberFormat(locale, options).format(value); }
function formatRate(rate: number, locale: string): string { return formatNumber(rate, locale, { minimumFractionDigits: 4, maximumFractionDigits: 4 }); }
function formatAmount(amount: number, locale: string): string { return formatNumber(amount, locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }



export { formatDate };
export { formatNumber };
export { formatRate, formatAmount };