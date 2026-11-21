import { useMemo } from 'react';

import type { AppTheme, ThemeMode } from '../types';
import { palette } from '../tokens';

import { useTheme } from '../hooks/useTheme';
import { useThemedStyles } from '../hooks/useThemedStyles';

import { Pressable, Text, View } from 'react-native';
import { Page } from '../../../components/ui';



const MODES: readonly ThemeMode[] = ['system', 'light', 'dark'] as const;



type ColorGroupKey = 'brand' | 'feedback' | 'neutral' | 'action';



const COLOR_GROUPS: readonly ColorGroupKey[] =
[
	'brand',
	'feedback',
	'neutral',
	'action',
] as const;

type TypographyRoleKey =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'bodyLarge'
	| 'bodyText'
	| 'buttonText'
	| 'smallButtonText'
	| 'inputLabel'
	| 'secondaryLabel';

const TYPOGRAPHY_ROLES: readonly TypographyRoleKey[] =
[
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'bodyLarge',
	'bodyText',
	'buttonText',
	'smallButtonText',
	'inputLabel',
	'secondaryLabel',
] as const;

const createStyles = (theme: AppTheme) =>
(
	{
		container: {
			backgroundColor: theme.colors.neutral.bg,
			gap: theme.spacing.lg,
			paddingBottom: theme.spacing.huge,
		},
		section: {
			backgroundColor: theme.colors.neutral.base,
			borderColor: theme.colors.neutral.divider,
			borderWidth: 1,
			borderRadius: theme.radii.xl,
			padding: theme.spacing.lg,
			gap: theme.spacing.md,
		},
		sectionTitle: {
			...theme.typography.h5,
			color: theme.colors.neutral.primary,
		},
		groupTitle: {
			...theme.typography.inputLabel,
			color: theme.colors.neutral.secondary,
		},
		metaText: {
			...theme.typography.bodyText,
			color: theme.colors.neutral.secondary,
		},
		captionText: {
			...theme.typography.secondaryLabel,
			color: theme.colors.neutral.tertiary,
		},
		rowWrap: {
			flexDirection: 'row' as const,
			flexWrap: 'wrap' as const,
			gap: theme.spacing.sm,
		},
		modeChip: {
			paddingHorizontal: theme.spacing.lg,
			paddingVertical: theme.spacing.xs,
			borderRadius: theme.radii.full,
			borderWidth: 1,
			borderColor: theme.colors.neutral.divider,
			backgroundColor: theme.colors.neutral.bg,
		},
		modeChipActive: {
			borderColor: theme.colors.action.primary,
			backgroundColor: theme.colors.action.secondary,
		},
		modeChipLabel: {
			...theme.typography.smallButtonText,
			color: theme.colors.neutral.primary,
		},
		modeChipLabelActive: {
			...theme.typography.smallButtonText,
			color: theme.colors.action.secondaryText,
		},
		groupBlock: {
			gap: theme.spacing.xs,
		},
		swatchCard: {
			width: theme.spacing.huge * 2,
			backgroundColor: theme.colors.neutral.bg,
			borderColor: theme.colors.neutral.divider,
			borderWidth: 1,
			borderRadius: theme.radii.md,
			padding: theme.spacing.xxs,
			gap: theme.spacing.xxs,
		},
		swatchFill: {
			height: theme.spacing.xxl,
			borderRadius: theme.radii.sm,
			borderWidth: 1,
			borderColor: theme.colors.neutral.divider,
		},
		gradientBlock: {
			gap: theme.spacing.xxs,
		},
		gradientStrip: {
			flexDirection: 'row' as const,
			height: theme.spacing.xl,
			borderRadius: theme.radii.md,
			overflow: 'hidden' as const,
			borderWidth: 1,
			borderColor: theme.colors.neutral.divider,
		},
		gradientStop: {
			flex: 1,
		},
		typographyRow: {
			gap: theme.spacing.xxs,
			paddingBottom: theme.spacing.xs,
			borderBottomWidth: 1,
			borderBottomColor: theme.colors.neutral.divider,
		},
		typographySample: {
			color: theme.colors.neutral.primary,
		},
		spacingRow: {
			gap: theme.spacing.xxs,
		},
		spacingBar: {
			height: theme.spacing.sm,
			backgroundColor: theme.colors.action.primary,
			borderRadius: theme.radii.sm,
		},
		radiusBox: {
			width: theme.spacing.huge + theme.spacing.lg,
			height: theme.spacing.huge + theme.spacing.lg,
			backgroundColor: theme.colors.action.secondary,
			borderColor: theme.colors.action.primary,
			borderWidth: 1,
			alignItems: 'center' as const,
			justifyContent: 'center' as const,
		},
		scalePill: {
			paddingHorizontal: theme.spacing.md,
			paddingVertical: theme.spacing.xs,
			backgroundColor: theme.colors.neutral.bg,
			borderColor: theme.colors.neutral.divider,
			borderWidth: 1,
			borderRadius: theme.radii.md,
		},
	}
);

function ThemeTest()
{
	const { theme, scheme, mode, setMode } = useTheme();

	const styles = useThemedStyles(createStyles);

	const primitiveEntries = useMemo(() => {
		const entries: Array<{ name: string; color: string }> = [];

		(Object.keys(palette.brand) as Array<keyof typeof palette.brand>).forEach((key) => {
			entries.push({ name: `brand.${key}`, color: palette.brand[key] });
		});

		(Object.keys(palette) as Array<keyof typeof palette>).forEach((key) => {
			const value = palette[key];
			if (typeof value === 'string' && value !== palette.transparent) {
				entries.push({ name: key, color: value });
			}
		});

		return entries;
	}, []);

	const gradientEntries = useMemo(
		() =>
			(Object.keys(theme.colors.gradients) as Array<keyof typeof theme.colors.gradients>).map(
				(key) => ({
					name: key,
					stops: theme.colors.gradients[key],
				})
			),
		[theme.colors.gradients]
	);

	const spacingKeys = Object.keys(theme.spacing) as Array<keyof typeof theme.spacing>;
	const radiiKeys = Object.keys(theme.radii) as Array<keyof typeof theme.radii>;
	const opacityKeys = Object.keys(theme.opacity) as Array<keyof typeof theme.opacity>;
	const iconSizeKeys = Object.keys(theme.iconSizes) as Array<keyof typeof theme.iconSizes>;

	return (
		<Page title="Theme Test">
			<View style={styles.container}>
				{/* 1. Theme Mode Switcher */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Theme Mode</Text>
					<Text style={styles.metaText}>
						scheme: {scheme} · mode: {mode}
					</Text>
					<View style={styles.rowWrap}>
						{MODES.map((item) => {
							const active = mode === item;
							return (
								<Pressable
									key={item}
									accessibilityRole="button"
									accessibilityState={{ selected: active }}
									onPress={() => setMode(item)}
									style={[styles.modeChip, active && styles.modeChipActive]}
								>
									<Text
										style={[
											styles.modeChipLabel,
											active && styles.modeChipLabelActive,
										]}
									>
										{item}
									</Text>
								</Pressable>
							);
						})}
					</View>
				</View>

				{/* 2. Semantic Colors */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Semantic colors</Text>
					{COLOR_GROUPS.map((group) => {
						const groupTokens = theme.colors[group];
						const roles = Object.keys(groupTokens) as Array<keyof typeof groupTokens>;

						return (
							<View key={group} style={styles.groupBlock}>
								<Text style={styles.groupTitle}>{group}</Text>
								<View style={styles.rowWrap}>
									{roles.map((role) => (
										<View key={String(role)} style={styles.swatchCard}>
											<View
												style={[
													styles.swatchFill,
													{ backgroundColor: groupTokens[role] },
												]}
											/>
											<Text style={styles.captionText}>{String(role)}</Text>
										</View>
									))}
								</View>
							</View>
						);
					})}

					<View style={styles.groupBlock}>
						<Text style={styles.groupTitle}>gradients</Text>
						{gradientEntries.map((grad) => (
							<View key={grad.name} style={styles.gradientBlock}>
								<Text style={styles.captionText}>{grad.name}</Text>
								<View style={styles.gradientStrip}>
									{grad.stops.map((stopColor) => (
										<View
											key={`${grad.name}-${stopColor}`}
											style={[
												styles.gradientStop,
												{ backgroundColor: stopColor },
											]}
										/>
									))}
								</View>
							</View>
						))}
					</View>
				</View>

				{/* 3. Typography */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Typography</Text>
					{TYPOGRAPHY_ROLES.map((role) => (
						<View key={role} style={styles.typographyRow}>
							<Text style={styles.captionText}>{role}</Text>
							<Text style={[theme.typography[role], styles.typographySample]}>
								Flenta 1 234,56 ₴
							</Text>
						</View>
					))}
				</View>

				{/* 4. Spacing */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Spacing</Text>
					{spacingKeys.map((key) => {
						const value = theme.spacing[key];
						return (
							<View key={key} style={styles.spacingRow}>
								<Text style={styles.captionText}>
									{key} ({value}px)
								</Text>
								<View style={[styles.spacingBar, { width: value }]} />
							</View>
						);
					})}
				</View>

				{/* 5. Radii */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Radii</Text>
					<View style={styles.rowWrap}>
						{radiiKeys.map((key) => {
							const value = theme.radii[key];
							return (
								<View
									key={key}
									style={[styles.radiusBox, { borderRadius: value }]}
								>
									<Text style={styles.captionText}>
										{key} ({value})
									</Text>
								</View>
							);
						})}
					</View>
				</View>

				{/* 6. Opacity & Icon Sizes */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Opacity & Icon Sizes</Text>
					<View style={styles.rowWrap}>
						{opacityKeys.map((key) => (
							<View key={key} style={styles.scalePill}>
								<Text style={styles.captionText}>
									opacity.{key}: {theme.opacity[key]}
								</Text>
							</View>
						))}
						{iconSizeKeys.map((key) => (
							<View key={key} style={styles.scalePill}>
								<Text style={styles.captionText}>
									icon.{key}: {theme.iconSizes[key]}px
								</Text>
							</View>
						))}
					</View>
				</View>

				{/* 7. Primitives */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Primitives</Text>
					<View style={styles.rowWrap}>
						{primitiveEntries.map((item) => (
							<View key={item.name} style={styles.swatchCard}>
								<View
									style={[
										styles.swatchFill,
										{ backgroundColor: item.color },
									]}
								/>
								<Text style={styles.captionText}>{item.name}</Text>
							</View>
						))}
					</View>
				</View>
			</View>
		</Page>
	);
}



export { ThemeTest };