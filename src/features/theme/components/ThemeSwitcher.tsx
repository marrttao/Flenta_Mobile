import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useTranslation } from '../../localization';
import { useTheme } from '../hooks/useTheme';

import type { Theme } from '../types';



const OPTIONS: readonly Theme[] = ['light', 'dark', 'system'] as const;

const styles = StyleSheet.create
(
	{
		row:
		{
			paddingVertical: 8,
			gap: 8
		},

		chip:
		{
			paddingHorizontal: 14,
			paddingVertical: 8,

			borderWidth: 1,
			borderRadius: 8
		},
		chip_active:
		{
			borderWidth: 2
		},

		label:
		{
			fontSize: 14,
			fontWeight: '400'
		},
		label_active:
		{
			fontWeight: '700'
		}
	}
);



function ThemeSwitcher()
{
	const { translate } = useTranslation();
	const { theme, setTheme } = useTheme();

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
			{
				OPTIONS.map
				(
					(option) =>
					{
						const active = theme === option;

						return (
							<Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => setTheme(option)} style={[styles.chip, active && styles.chip_active]}>
								<Text style={[styles.label, active && styles.label_active]}>{translate(`theme.${option}`)}</Text>
							</Pressable>
						);
					}
				)
			}
		</ScrollView>
	);
}



export { ThemeSwitcher };