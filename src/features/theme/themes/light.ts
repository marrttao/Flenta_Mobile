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
	buttonText:		 { fontFamily: fonts.medium, fontSize: 18, fontWeight: fontWeights.medium },
	smallButtonText: { fontFamily: fonts.medium, fontSize: 16, fontWeight: fontWeights.medium },
	inputLabel:		 { fontFamily: fonts.medium, fontSize: 16, fontWeight: fontWeights.medium },
	secondaryLabel:	 { fontFamily: fonts.medium, fontSize: 14, fontWeight: fontWeights.medium },
} as const;



const lightTheme: AppTheme =
{
	scheme: 'light',

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
			success: palette.lightSuccess,
			error: palette.lightError,
			warning: palette.lightWarning,
			info: palette.lightInfo
		},

		white: palette.white,
		black: palette.black,
		transparent: palette.transparent,

		neutral:
		{
			bg: palette.lightBg,
			base: palette.lightBase,
			divider: palette.lightDivider,
			primary: palette.lightPrimary,
			secondary: palette.lightSecondary,
			tertiary: palette.lightTertiary
		},

		action:
		{
			primary: palette.lightActionPrimary,
			primaryText: palette.lightActionPrimaryText,
			secondary: palette.lightActionSecondary,
			secondaryText: palette.lightActionSecondaryText,
			link: palette.lightActionLink
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



export { lightTheme };