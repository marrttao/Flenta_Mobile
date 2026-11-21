import { useContext } from 'react';

import type { ThemeContextValue } from '../providers/ThemeProvider';
import { ThemeContext } from '../providers/ThemeProvider';



function useTheme(): ThemeContextValue
{
	const context = useContext(ThemeContext);

	if (!context) { throw new Error('useTheme must be used within a ThemeProvider'); }

	return context;
}



export { useTheme };