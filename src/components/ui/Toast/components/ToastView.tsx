import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ToastItem } from './ToastItem';
import type { ToastItemData } from '../providers/ToastProvider';



interface ToastViewProps
{
	toasts: ToastItemData[];
	removeToast: (id: string) => void;
}



const styles = StyleSheet.create
(
	{
		container:
		{
			maxWidth: 360,

			alignSelf: 'flex-end',

			position: 'absolute',
			right: 16,
			left: 16,
			gap: 8,
		}
	}
);



function ToastView({ toasts, removeToast }: ToastViewProps)
{
	const insets = useSafeAreaInsets();

	return (
		<View pointerEvents="box-none" style={[styles.container, { top: insets.top + 16 }]}>
			{toasts.map((toast) => <ToastItem key={toast.id} toast={toast} removeToast={removeToast}/>)}
		</View>
	);
}



export type { ToastViewProps };
export { ToastView };