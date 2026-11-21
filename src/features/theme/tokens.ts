const palette =
{
	// Accents
	brand:
	{
		flentaViolet:   '#4F3CFB',
		deepIris:       'rgb(48, 39, 92)',
		softLavender:   '#A99AFF',
		flowMint:       '#B8F0D5',
		actionSoft:     '#E8E4FF',
	},
	gradients:
	{
		signatureFlow: ['#6558F5', '#5146E5', '#29234F'],
		softLavender: ['#D6CEFF', '#A99AFF', '#7166C9'],
		digitalGrowth: ['#5146E5', '#4D5588', '#86E3C0'],
	},



	// Light Mode
		// Neutral
			lightBg:        '#F7F6FC',
			lightBase:      '#FFFFFF',
			lightDivider:   '#DCD8E9',
			lightPrimary:   '#24213A',
			lightSecondary: '#625E75',
			lightTertiary:  '#777286',
		
		// Actions
			lightActionPrimary: 	  '#5146E5',
			lightActionPrimaryText:   '#FFFFFF',
			lightActionSecondary: 	  '#E8E4FF',
			lightActionSecondaryText: '#30275C',
			lightActionLink: 		  '#5146E5',

		// Feedback Primitives
			lightSuccess: '#C1F7DA',
			lightWarning: '#FFE8BB',
			lightError: '#FBD3D9',
			lightInfo: '#C6BCFF',

	// Dark Mode
		// Neutral
			darkBg:         '#15151E',
			darkBase:       '#20202C',
			darkDivider:    '#3D384D',
			darkPrimary:    '#FAF2FA',
			darkSecondary:  '#8985C9',
			darkTertiary:   '#9692A7',
		
		// Actions
			darkActionPrimary: 		 '#A99AFF',
			darkActionPrimaryText: 	 '#201A38',
			darkActionSecondary: 	 '#332C54',
			darkActionSecondaryText: '#E5DFFF',
			darkActionLink: 		 '#A99AFF',

		// Feedback Primitives
			darkSuccess: '#1A4336',
			darkWarning: '#6C4B1E',
			darkError: '#602135',



	white:          '#FFFFFF',
	black:          '#000000',
	transparent: 'transparent',
} as const;

const fonts =
{
	extrabold: 'Manrope-ExtraBold',
	bold:      'Manrope-Bold',
	semibold:  'Manrope-SemiBold',
	medium:    'Manrope-Medium',
	regular:   'Manrope-Regular'
} as const;

const fontWeights = {
	regular: '400',
	medium: '500',
	semibold: '600',
	bold: '700',
	extrabold: '800',
} as const;

const spacing =
{
	xxs:  4,
	xs:   6,
	sm:   8,
	md:   12,
	lg:   16,
	xl:   20,
	xxl:  24,
	xxxl: 32,
	huge: 48
} as const;

const radii =
{
	sm:   8,
	md:   10,
	lg:   12,
	xl:   16,
	full: 999
} as const;

const opacity = {
	disabled: 0.45,
	pressed: 0.82,
	muted: 0.65,
} as const;

const zIndex = {
	base: 0,
	dropdown: 100,
	modal: 200,
	toast: 300,
} as const;

const iconSizes = {
	xs: 14,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
} as const;



export type Palette = typeof palette;
export type Fonts = typeof fonts;
export type FontWeights = typeof fontWeights;
export type Spacing = typeof spacing;
export type Radii = typeof radii;
export type Opacity = typeof opacity;
export type ZIndex = typeof zIndex;
export type IconSizes = typeof iconSizes;

export {
	palette,
	fonts,
	fontWeights,
	spacing,
	radii,
	opacity,
	zIndex,
	iconSizes,
};