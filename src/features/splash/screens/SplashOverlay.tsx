import { useEffect, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import type { AppTheme } from '../../theme/types';

import { useThemedStyles } from '../../theme/hooks/useThemedStyles';

import { FlentaLogo } from '../components/FlentaLogo';



interface SplashOverlayProps
{
	onFinish?: () => void;
	minDurationMs?: number;
}



const createStyles = (theme: AppTheme) =>
(
    {
        root:
        {
            ...({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const),
            alignItems: 'center',
            justifyContent: 'center',

            backgroundColor: theme.colors.neutral.bg,
        },
        
        center:
        {
            alignItems: 'center',
            gap: theme.spacing.xl,
        },
        tagline:
        {
            ...theme.typography.bodySmall,
            color: theme.colors.neutral.secondary,
        },
        
        bottom:
        {
            position: 'absolute',
            bottom: theme.spacing.xxxl * 2,

            alignItems: 'center',
            gap: theme.spacing.lg,
        },
        loadingTrack:
        {
            width: 120,
            height: 3,

            borderRadius: theme.radii.sm / 2,
            backgroundColor: theme.colors.action.secondary,
            overflow: 'hidden',
        },
        loadingBar:
        {
            width: 46,
            height: '100%',

            backgroundColor: theme.colors.brand.flentaViolet,
        },
        loadingLabel:
        {
            ...theme.typography.secondaryLabel,
            color: theme.colors.neutral.secondary,
        },
    }
);



function SplashOverlay({ onFinish, minDurationMs = 2000 }: SplashOverlayProps)
{
    // @ts-expect-error
	const styles = useThemedStyles(createStyles);

	const [barTranslate] = useState(() => new Animated.Value(-1));
	const [opacity] = useState(() => new Animated.Value(1));

	useEffect
	(
		() =>
		{
			const loop = Animated.loop
			(
				Animated.timing
                (
                    barTranslate,
                    {
                        toValue: 1,
                        duration: 1200,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }
                )
			);
			loop.start();

			const timer = setTimeout
            (
                () =>
                {
                    loop.stop();
                    Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => { onFinish?.(); });
                },
                minDurationMs
            );

			return () => { clearTimeout(timer); loop.stop(); };
		},
		[barTranslate, opacity, minDurationMs, onFinish]
	);

	const translateX = barTranslate.interpolate({ inputRange: [-1, 1], outputRange: [-54, 120] });

	return (
		<Animated.View style={[styles.root, { opacity }]}>
			<View style={styles.center}>
				<FlentaLogo width={172} height={40} />
				<Text style={styles.tagline}>Your money. Your flow.</Text>
			</View>

			<View style={styles.bottom}>
				<View style={styles.loadingTrack}>
					<Animated.View style={[styles.loadingBar, { transform: [{ translateX }] }]} />
				</View>
				<Text style={styles.loadingLabel}>Loading...</Text>
			</View>
		</Animated.View>
	);
}

export { SplashOverlay };