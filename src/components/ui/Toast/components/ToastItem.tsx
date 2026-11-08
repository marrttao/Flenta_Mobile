import { useEffect, useState } from 'react';

import { useTranslation } from '../../../../features/localization/index';

import type { ToastItemData } from '../providers/ToastProvider';

import { Animated, Easing, Pressable, StyleSheet, Text, View, useAnimatedValue } from 'react-native';



interface ToastItemProps
{
	toast: ToastItemData;
	removeToast: (id: string) => void;
}



const typeColors: Record<ToastItemData['type'], string> =
{
	success: '#16a34a',
	error: '#dc2626',
	info: '#2563eb',
	warning: '#d97706',
};

const styles = StyleSheet.create
(
	{
		container:
		{
			paddingVertical: 12,
			paddingHorizontal: 14,

			flexDirection: 'row',
			alignItems: 'center',
			gap: 12,
			
			backgroundColor: '#ffffff',
			
			borderRadius: 12,
			borderLeftWidth: 4,
			
			shadowColor: '#000',
			shadowOpacity: 0.1,
			shadowRadius: 8,
			shadowOffset: { width: 0, height: 2 },

			elevation: 3
		},

		content:
		{
			minWidth: 0,
		
			flex: 1
		},
		
		title:
		{
			color: '#132744',

			fontSize: 14,
			fontWeight: '600'
		},
		message:
		{
			color: '#5b6b80',

			marginTop: 2,
			fontSize: 13
		},

		close_button:
		{
			width: 24,
			height: 24,
			
			alignItems: 'center',
			justifyContent: 'center'
		},
		close_x:
		{
			color: '#9ca3af',

			fontSize: 18,
			lineHeight: 18
		}
	}
);



function ToastItem({ toast, removeToast }: ToastItemProps)
{
	const { translate } = useTranslation();

	const [exiting, setExiting] = useState(false);
	const opacity = useAnimatedValue(0);
	const translateX = useAnimatedValue(20);

	useEffect
	(
		() =>
		{
			Animated.parallel
			(
				[
					Animated.timing(opacity, { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
					Animated.timing(translateX, { toValue: 0, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
				]
			).start();
		},
		[opacity, translateX]
	);

	useEffect
	(
		() =>
		{
			if (toast.duration <= 0) { return; }

			const timer = setTimeout(() => setExiting(true), toast.duration);
			return () => clearTimeout(timer);
		},
		[toast.duration]
	);

	useEffect
	(
		() =>
		{
			if (!exiting) { return; }

			Animated.parallel
			(
				[
					Animated.timing(opacity, { toValue: 0, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: true }),
					Animated.timing(translateX, { toValue: 20, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: true }),
				]
			).start(() => removeToast(toast.id));
		},
		[exiting, opacity, translateX, removeToast, toast.id]
	);

	return (
		<Animated.View style={[styles.container, { borderLeftColor: typeColors[toast.type], opacity, transform: [{ translateX }] }]}>
			<View style={styles.content}>
				<Text style={styles.title}>{toast.title}</Text>
				{toast.message ? <Text style={styles.message}>{toast.message}</Text> : null}
			</View>
			<Pressable accessibilityRole="button" accessibilityLabel={translate('common.close')} onPress={() => removeToast(toast.id)} style={styles.close_button} hitSlop={8}>
				<Text style={styles.close_x}>×</Text>
			</Pressable>
		</Animated.View>
	);
}



export { ToastItem };
