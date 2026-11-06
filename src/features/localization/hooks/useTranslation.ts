import { useContext } from 'react';

import { LocalizationContext, type LocalizationContextValue } from '../providers/LocalizationProvider';



function useTranslation(): LocalizationContextValue
{
	const context = useContext(LocalizationContext);

	if (!context) { throw new Error('useTranslation must be used within a LocalizationProvider'); }

	return context;
}



export { useTranslation };