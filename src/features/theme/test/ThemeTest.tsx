import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { router } from 'expo-router';

import { Button, Page, Panel } from '../../../components/ui';
import { styles } from '../../../components/ui';

import { useTheme } from '../hooks/useTheme';
import { ThemeSwitcher } from '../components/ThemeSwitcher';



const testPalette =
{
	light:
	{
		background: '#f4f7fc',
		surface: '#ffffff',
		border: '#b7c7dc',
		heading: '#132744',
		text: '#263a53',
		muted: '#5b6b80',
		accent: '#2363d8',
		accentText: '#ffffff',
		success: '#1d6748',
		danger: '#a42535'
	},
	dark:
	{
		background: '#0f172a',
		surface: '#1e293b',
		border: '#334155',
		heading: '#f1f5f9',
		text: '#cbd5e1',
		muted: '#94a3b8',
		accent: '#60a5fa',
		accentText: '#0f172a',
		success: '#4ade80',
		danger: '#f87171'
	}
} as const;

type Palette = typeof testPalette.light;



const local = StyleSheet.create
(
	{
		code:
		{
			fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
			fontSize: 12,
			lineHeight: 18
		},

		preview:
		{
			padding: 16,
			gap: 12,

			borderWidth: 1,
			borderRadius: 12
		},

		swatchRow:
		{
			flexDirection: 'row',
			flexWrap: 'wrap',
			gap: 8
		},
		swatch:
		{
			width: 72,
			height: 56,

			alignItems: 'center',
			justifyContent: 'center',

			borderWidth: 1,
			borderRadius: 8
		},
		swatchLabel:
		{
			fontSize: 10,
			fontWeight: '600'
		},

		chip:
		{
			paddingHorizontal: 14,
			paddingVertical: 10,

			borderWidth: 1,
			borderRadius: 8
		},
		chipText:
		{
			fontSize: 14,
			fontWeight: '600'
		}
	}
);



function previewStyles(palette: Palette)
{
	return {
		preview:
		{
			backgroundColor: palette.background,
			borderColor: palette.border
		},
		card:
		{
			padding: 14,
			gap: 6,

			backgroundColor: palette.surface,

			borderWidth: 1,
			borderColor: palette.border,
			borderRadius: 8
		},
		heading:
		{
			color: palette.heading,

			fontSize: 18,
			fontWeight: '700' as const
		},
		text:
		{
			color: palette.text,

			fontSize: 15,
			lineHeight: 22
		},
		muted:
		{
			color: palette.muted,

			fontSize: 13
		},
		primary:
		{
			paddingHorizontal: 14,
			paddingVertical: 10,

			alignSelf: 'flex-start' as const,

			backgroundColor: palette.accent,

			borderRadius: 8
		},
		primaryText:
		{
			color: palette.accentText,

			fontSize: 14,
			fontWeight: '600' as const
		},
		success:
		{
			color: palette.success,

			fontSize: 13,
			fontWeight: '600' as const
		},
		danger:
		{
			color: palette.danger,

			fontSize: 13,
			fontWeight: '600' as const
		}
	};
}



function ThemeTest()
{
	const { theme, resolvedTheme, setTheme } = useTheme();
	const system = useColorScheme() ?? 'light';

	const [result, setResult] = useState('');

	const prevTheme = useRef(theme);
	const prevSystem = useRef(system);

	useEffect
	(
		() =>
		{
			if (prevTheme.current !== theme)
			{
				setResult(`theme: ${prevTheme.current} => ${theme}`);
				prevTheme.current = theme;
			}
		},
		[theme]
	);

	useEffect
	(
		() =>
		{
			if (prevSystem.current !== system)
			{
				setResult(`system: ${prevSystem.current} => ${system} (resolvedTheme=${resolvedTheme})`);
				prevSystem.current = system;
			}
		},
		[system, resolvedTheme]
	);

	const palette = testPalette[resolvedTheme];
	const preview = previewStyles(palette);

	return (
		<Page title="Theme Test">
			<Panel>
				<Text style={styles.heading}>Preview</Text>

				<View style={[local.preview, preview.preview]}>
					<View style={preview.card}>
						<Text style={preview.heading}>Card surface</Text>
						<Text style={preview.text}>This text changes color when the theme is switched.</Text>
						<Text style={preview.muted}>Secondary text also changes.</Text>
						<View style={preview.primary}>
							<Text style={preview.primaryText}>Primary action</Text>
						</View>
						<Text style={preview.success}>✓ success state</Text>
						<Text style={preview.danger}>✕ danger state</Text>
					</View>

					<View style={local.swatchRow}>
						<View style={[local.swatch, { backgroundColor: palette.background, borderColor: palette.border }]}>
							<Text style={[local.swatchLabel, { color: palette.text }]}>bg</Text>
						</View>
						<View style={[local.swatch, { backgroundColor: palette.surface, borderColor: palette.border }]}>
							<Text style={[local.swatchLabel, { color: palette.heading }]}>surface</Text>
						</View>
						<View style={[local.swatch, { backgroundColor: palette.accent, borderColor: palette.border }]}>
							<Text style={[local.swatchLabel, { color: palette.accentText }]}>accent</Text>
						</View>
						<View style={[local.swatch, { backgroundColor: palette.success, borderColor: palette.border }]}>
							<Text style={[local.swatchLabel, { color: palette.accentText }]}>success</Text>
						</View>
						<View style={[local.swatch, { backgroundColor: palette.danger, borderColor: palette.border }]}>
							<Text style={[local.swatchLabel, { color: palette.accentText }]}>danger</Text>
						</View>
					</View>

					<View style={[local.chip, { backgroundColor: palette.surface, borderColor: palette.accent }]}>
						<Text style={[local.chipText, { color: palette.accent }]}>chip · accent border</Text>
					</View>
				</View>
			</Panel>

			<Panel>
				<Text style={styles.heading}>State</Text>
				<Text selectable style={local.code}>{JSON.stringify({ theme, resolvedTheme, system }, null, 2)}</Text>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Switcher</Text>
				<ThemeSwitcher/>
				<Button title="Set light" secondary={theme !== 'light'} onPress={() => setTheme('light')}/>
				<Button title="Set dark" secondary={theme !== 'dark'} onPress={() => setTheme('dark')}/>
				<Button title="Set system" secondary={theme !== 'system'} onPress={() => setTheme('system')}/>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Persistence</Text>
				<Text style={styles.muted}>Current theme: {theme}</Text>
				<Button title="Back to home" secondary onPress={() => router.replace('/')}/>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Result</Text>
				<Text selectable style={local.code}>{result || '(empty)'}</Text>
			</Panel>
		</Page>
	);
}



export { ThemeTest };