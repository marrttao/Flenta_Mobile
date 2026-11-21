import { Pressable, ScrollView, Text } from 'react-native';

import type { AppTheme, ThemeMode } from '../types';

import { useTranslation } from '../../localization';
import { useTheme } from '../hooks/useTheme';
import { useThemedStyles } from '../hooks/useThemedStyles';



const OPTIONS: readonly ThemeMode[] = ['light', 'dark', 'system'] as const;



const createStyles = (theme: AppTheme) =>
(
	{
		row:
		{
			paddingVertical: theme.spacing.xs,
			gap: theme.spacing.xs,
		},
		
		chip:
		{
			paddingHorizontal: theme.spacing.md,
			paddingVertical: theme.spacing.xs,
			borderWidth: 1,
			borderRadius: theme.radii.sm,
			borderColor: theme.colors.neutral.divider,
			backgroundColor: theme.colors.neutral.base,
		},

		chipActive:
		{
			borderWidth: 2,
			borderColor: theme.colors.action.primary,
			backgroundColor: theme.colors.action.secondary,
		},
		
		label:
		{
			...theme.typography.smallButtonText,
			color: theme.colors.neutral.secondary,
		},
		
		labelActive:
		{
			...theme.typography.inputLabel,
			color: theme.colors.action.secondaryText,
		},
	}
);

function ThemeSwitcher()
{
	const { translate } = useTranslation();
	const { mode, setMode } = useTheme();

	const styles = useThemedStyles(createStyles);

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
			{
				OPTIONS.map
				(
					(option) =>
					{
						const active = mode === option;

						return (
							<Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => setMode(option)} style={[styles.chip, active && styles.chipActive]} >
								<Text style={[styles.label, active && styles.labelActive]}>
									{translate(`theme.${option}`)}
								</Text>
							</Pressable>
						);
					})}
		</ScrollView>
	);
}

export { ThemeSwitcher };