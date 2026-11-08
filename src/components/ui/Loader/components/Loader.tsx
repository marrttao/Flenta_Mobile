import { useEffect, useRef } from 'react';

import { Animated, Easing, StyleSheet, Text, View } from 'react-native';



interface LoaderProps
{
	size?: 'small' | 'medium' | 'large';
	label?: string;
}



const RING_SIZE = { small: 14, medium: 20, large: 32 } as const;

const CORNER_RANGE  = [0,   0.25, 0.5,  0.75, 1] as const;

const styles = StyleSheet.create
(
	{
		container:
		{
			alignItems: 'center',
			justifyContent: 'center',
			gap: 12
		},
		ring:
		{
			borderWidth: 4,
			borderColor: '#c6c6c6'
		},
		label:
		{
			fontSize: 14,
			color: '#c6c6c6'
		}
	}
);



function Loader({ size = 'medium', label }: LoaderProps)
{
	const progress = useRef(new Animated.Value(0)).current;

	useEffect
	(
		() =>
		{
			const animation = Animated.loop
			(
				Animated.timing
				(
					progress,
					{
						toValue: 1,
						duration: 2000,
						easing: Easing.linear,
						useNativeDriver: false
					}
				)
			);

			animation.start();
			return () => { animation.stop(); };
		},
		[progress]
	);

	const ringSize = RING_SIZE[size];
	const half = ringSize / 2;

	const round  = [2, half, half, half, 2];
	const sharp  = [2, half, 2,    half, 2];

	const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

	const tl = progress.interpolate({ inputRange: CORNER_RANGE as unknown as number[], outputRange: round });
	const tr = progress.interpolate({ inputRange: CORNER_RANGE as unknown as number[], outputRange: sharp });
	const br = progress.interpolate({ inputRange: CORNER_RANGE as unknown as number[], outputRange: round });
	const bl = progress.interpolate({ inputRange: CORNER_RANGE as unknown as number[], outputRange: sharp });

	return (
		<View style={styles.container}>
			<Animated.View
				style=
				{
					[
						styles.ring,
						{
							width: ringSize,
							height: ringSize,
							borderTopLeftRadius: tl,
							borderTopRightRadius: tr,
							borderBottomRightRadius: br,
							borderBottomLeftRadius: bl,
							transform: [{ rotate }]
						}
					]}
			/>
			{label ? <Text style={styles.label}>{label}</Text> : null}
		</View>
	);
}

export type { LoaderProps };
export { Loader };