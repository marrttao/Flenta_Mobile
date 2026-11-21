import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import type { AppTheme, ColorScheme, ThemeMode } from '../types';

import { storageService, StorageKeys } from '../../../storage';

import { darkTheme } from '../themes/dark';
import { lightTheme } from '../themes/light';


interface ThemeContextValue
{
	mode: ThemeMode;
	scheme: ColorScheme;
	theme: AppTheme;

	setMode: (mode: ThemeMode) => void;
}

interface ThemeProviderProps
{
	children: ReactNode;
}



const DEFAULT_MODE: ThemeMode = 'system';



function toColorScheme(rawScheme: unknown): ColorScheme { return rawScheme === 'dark' ? 'dark' : 'light'; }
function toThemeMode(value: unknown): ThemeMode
{
	if (value === 'light' || value === 'dark' || value === 'system') { return value; }
	return DEFAULT_MODE;
}



const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function ThemeProvider({ children }: ThemeProviderProps)
{
	const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);

	const platformScheme: unknown = useColorScheme();
	const systemScheme: ColorScheme = toColorScheme(platformScheme);

	const userChangedRef = useRef(false);

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
						if (active && !userChangedRef.current) { setModeState(toThemeMode(stored)); }
					} catch (error: unknown) { console.warn('ThemeProvider: failed to restore theme mode from storage', error); }
				}
			)();

			return () => { active = false; };
		},
		[]
	);

	const scheme: ColorScheme = mode === 'system' ? systemScheme : mode;
	const theme: AppTheme = scheme === 'dark' ? darkTheme : lightTheme;

	const setMode = useCallback
	(
		(nextMode: ThemeMode) =>
		{
			userChangedRef.current = true;
			
			setModeState(nextMode);

			void storageService.setItem(StorageKeys.THEME, nextMode).catch((error: unknown) => { console.warn('ThemeProvider: failed to persist theme mode', error); });
		},
		[]
	);

	const value = useMemo<ThemeContextValue>
	(
		() => ({ mode, scheme, theme, setMode }),
		[mode, scheme, theme, setMode]
	);

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}



export type { ThemeContextValue, ThemeProviderProps };

export { ThemeContext, ThemeProvider };