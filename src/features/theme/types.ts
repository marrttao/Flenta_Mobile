import type { TextStyle } from 'react-native';

import type {
	spacing,
	radii,
	opacity,
	zIndex,
	iconSizes,
} from './tokens';



type ColorScheme = 'light' | 'dark';
type ThemeMode = 'light' | 'dark' | 'system';



interface TypographyToken
{
	fontFamily: string;
	fontSize: number;
	fontWeight: TextStyle['fontWeight'];
}

interface ThemeColors
{
	brand:
	{
		flentaViolet: string;
		deepIris: string;
		softLavender: string;
		flowMint: string;
		actionSoft: string;
	};

	gradients:
	{
		signatureFlow: readonly [string, string, string];
		softLavender: readonly [string, string, string];
		digitalGrowth: readonly [string, string, string];
	};

	feedback:
	{
		success: string;
		error: string;
		warning: string;
		info: string;
	};

	white: string;
	black: string;
	transparent: string;

	neutral:
	{
		bg: string;
		base: string;
		divider: string;
		primary: string;
		secondary: string;
		tertiary: string;
	};

	action:
	{
		primary: string;
		primaryText: string;
		secondary: string;
		secondaryText: string;
		link: string;
	};
}

interface ThemeTypography
{
	h1: TypographyToken;
	h2: TypographyToken;
	h3: TypographyToken;
	h4: TypographyToken;
	h5: TypographyToken;
	h6: TypographyToken;

	bodyLarge: TypographyToken;
	bodyText: TypographyToken;
	bodySmall: TypographyToken;
	buttonText: TypographyToken;
	smallButtonText: TypographyToken;
	inputLabel: TypographyToken;
	secondaryLabel: TypographyToken;
}

interface AppTheme
{
	scheme: ColorScheme;

	colors: ThemeColors;
	typography: ThemeTypography;
	spacing: typeof spacing;
	radii: typeof radii;
	opacity: typeof opacity;
	zIndex: typeof zIndex;
	iconSizes: typeof iconSizes;
}



export type {
	ColorScheme,
	ThemeMode,
	TypographyToken,
	ThemeColors,
	ThemeTypography,
	AppTheme,
};