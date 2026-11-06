const LANGUAGES =
[
	{ "reduction": "en" , "name": "EN", "nativeName": "English" },
	{ "reduction": "pl" , "name": "PL", "nativeName": "Polski" },
	{ "reduction": "de" , "name": "DE", "nativeName": "Deutsch" },
	{ "reduction": "uk" , "name": "UA", "nativeName": "Українська" },
] as const;

type Language = (typeof LANGUAGES)[number]["reduction"];



const DEFAULT_LANGUAGE: Language = "en";



const isSupportedLanguage = (language: string): language is Language => LANGUAGES.some(lang => lang.reduction === language);
const getLocaleForLanguage = (language: Language): string => { return LANGUAGES.find((_language) => _language.reduction === language)?.reduction ?? `${DEFAULT_LANGUAGE}-US`; }



export type { Language };

export { LANGUAGES, DEFAULT_LANGUAGE }

export { isSupportedLanguage, getLocaleForLanguage }