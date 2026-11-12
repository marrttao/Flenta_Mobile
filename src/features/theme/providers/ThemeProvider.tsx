import { createContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { storageService, StorageKeys } from '../../../storage';

import type { Theme, ResolvedTheme } from '../types';



interface ThemeContextValue
{
	theme: Theme;
	resolvedTheme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
}

interface ThemeProviderProps
{
	children: ReactNode;
}



const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);



function toResolved(scheme: unknown): ResolvedTheme { return scheme === 'dark' ? 'dark' : 'light'; }
function toTheme(value: unknown): Theme { return value === 'light' || value === 'dark' || value === 'system' ? value : 'system'; }



function ThemeProvider({ children }: ThemeProviderProps)
{
	const [theme, setThemeState] = useState<Theme>('system');

	const platformScheme: unknown = useColorScheme();
	const systemTheme: ResolvedTheme = toResolved(platformScheme);

	const userChanged = useRef(false);

	useEffect
	(
		() =>
		{
			let active = true;

			(
				async () =>
				{
					try
					{
						const stored = await storageService.getItem<unknown>(StorageKeys.THEME);
						if (active && !userChanged.current) { setThemeState(toTheme(stored)); }
					}
					catch {}
				}
			)();

			return () => { active = false; };
		},
		[]
	);

	const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme;

	const setTheme = (newTheme: Theme) =>
	{
		userChanged.current = true;
		setThemeState(newTheme);
		void storageService.setItem(StorageKeys.THEME, newTheme).catch(() => {});
	};

	const value = useMemo<ThemeContextValue>
	(
		() => ({ theme, resolvedTheme, setTheme }),
		[theme, resolvedTheme]
	);



	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}



export type { ThemeContextValue, ThemeProviderProps };

export { ThemeContext, ThemeProvider };