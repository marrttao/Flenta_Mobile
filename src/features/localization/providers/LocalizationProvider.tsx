import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

import { getByPath } from '../utils/getByPath';

import { DEFAULT_LANGUAGE, type Language } from '../utils/languages';

import en from '../../../locales/en.json';
import pl from '../../../locales/pl.json';
import de from '../../../locales/de.json';
import uk from '../../../locales/uk.json';



type Dictionary = typeof en;



interface LocalizationContextValue
{
	language: Language;
	setLanguage: (language: Language) => void;
	translate: (key: string) => string;
}

interface LocalizationProvidersProps
{
	children: ReactNode;
	defaultLanguage?: Language;
}



const dictionaries: Record<Language, Dictionary> = { en, pl, de, uk };



const LocalizationContext = createContext<LocalizationContextValue | null>(null);

function LocalizationProvider({ children, defaultLanguage = DEFAULT_LANGUAGE }: LocalizationProvidersProps)
{
	const [language, setLanguage] = useState<Language>(defaultLanguage);

	const translate = useCallback
	(
		(key: string): string => getByPath(dictionaries[language], key) ?? key,
		[language]
	);

	const value = useMemo<LocalizationContextValue>
	(
		() => ({ language, setLanguage, translate }),
		[language, translate]
	);

	return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
}



export type { LocalizationContextValue };

export { LocalizationContext, LocalizationProvider };