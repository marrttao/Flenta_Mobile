export const currencyKeys =
{
	all: ['currency'] as const,
	latest: (base: string) => [...currencyKeys.all, 'latest', base] as const,
};