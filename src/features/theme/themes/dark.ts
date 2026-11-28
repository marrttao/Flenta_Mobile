import {
	palette,
	fonts,
	spacing,
	radii,
	opacity,
	zIndex,
	iconSizes,
	fontWeights,
} from '../tokens';

import type { AppTheme } from '../types';



const typography =
{
	h1: { fontFamily: fonts.extrabold, fontSize: 64, fontWeight: fontWeights.extrabold },
	h2: { fontFamily: fonts.extrabold, fontSize: 48, fontWeight: fontWeights.extrabold },
	h3: { fontFamily: fonts.bold, fontSize: 40, fontWeight: fontWeights.bold },
	h4: { fontFamily: fonts.bold, fontSize: 32, fontWeight: fontWeights.bold },
	h5: { fontFamily: fonts.semibold, fontSize: 24, fontWeight: fontWeights.semibold },
	h6: { fontFamily: fonts.semibold, fontSize: 20, fontWeight: fontWeights.semibold },

	bodyLarge:		 { fontFamily: fonts.regular, fontSize: 18, fontWeight: fontWeights.regular },
	bodyText:		 { fontFamily: fonts.regular, fontSize: 16, fontWeight: fontWeights.regular },
	bodySmall:		 { fontFamily: fonts.regular, fontSize: 14, fontWeight: fontWeights.regular },
	buttonText:		 { fontFamily: fonts.medium, fontSize: 18, fontWeight: fontWeights.medium },
	smallButtonText: { fontFamily: fonts.medium, fontSize: 16, fontWeight: fontWeights.medium },
	inputLabel:		 { fontFamily: fonts.medium, fontSize: 16, fontWeight: fontWeights.medium },
	secondaryLabel:	 { fontFamily: fonts.medium, fontSize: 14, fontWeight: fontWeights.medium },
} as const;



const darkTheme: AppTheme =
{
	scheme: 'dark',

	colors:
	{
		brand:
		{
			flentaViolet: palette.brand.flentaViolet,
			deepIris: palette.brand.deepIris,
			softLavender: palette.brand.softLavender,
			flowMint: palette.brand.flowMint,
			actionSoft: palette.brand.actionSoft
		},

		gradients:
		{
			signatureFlow: palette.gradients.signatureFlow,
			softLavender: palette.gradients.softLavender,
			digitalGrowth: palette.gradients.digitalGrowth
		},

		feedback:
		{
			success: palette.darkSuccess,
			error: palette.darkError,
			warning: palette.darkWarning,
			info: palette.transparent
		},

		white: palette.white,
		black: palette.black,
		transparent: palette.transparent,

		neutral:
		{
			bg: palette.darkBg,
			base: palette.darkBase,
			divider: palette.darkDivider,
			primary: palette.darkPrimary,
			secondary: palette.darkSecondary,
			tertiary: palette.darkTertiary
		},

		action:
		{
			primary: palette.darkActionPrimary,
			primaryText: palette.darkActionPrimaryText,
			secondary: palette.darkActionSecondary,
			secondaryText: palette.darkActionSecondaryText,
			link: palette.darkActionLink
		},
	},

	typography:
	{
		...typography,
	},

	spacing,
	radii,
	opacity,
	zIndex,
	iconSizes
};



export { darkTheme };