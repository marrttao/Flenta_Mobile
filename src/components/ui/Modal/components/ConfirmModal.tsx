import { Pressable, StyleSheet, Text } from 'react-native';

import { useTranslation } from '../../../../features/localization';

import { BasicModal } from './BasicModal';



interface ConfirmModalProps
{
	isOpen: boolean;

	title?: string;
	message?: string;

	confirmText?: string;
	cancelText?: string;
	
	variant?: 'primary' | 'secondary' | 'danger';
	loading?: boolean;

	onClose?: () => void;
	onConfirm?: () => void;
}



const btnStyles = StyleSheet.create
(
	{
		base:
		{
			minWidth: 96,
		
			paddingHorizontal: 16,
			paddingVertical: 10,
		
			alignItems: 'center',
		
			borderRadius: 8
		},
		
		primary: { backgroundColor: '#2563eb' },
		secondary: { backgroundColor: '#333333' },
		danger: { backgroundColor: '#dc2626' },

		disabled:
		{
			opacity: 0.5
		},
		
		label:
		{
			color: '#ffffff',

			fontSize: 14,
			fontWeight: '600'
		}
	}
);



function ConfirmModal({ isOpen, title, message, confirmText, cancelText, variant = 'primary', loading = false, onClose, onConfirm }: ConfirmModalProps)
{
	const { translate } = useTranslation();

	return (
		<BasicModal
			isOpen={isOpen}
			onClose={onClose}
			
			title={title}
			
			size="small"
			
			showCloseButton={!loading}
			closeOnEscapeClick={!loading}
			closeOnBackdropClick={!loading}
			
			footer=
			{
				<>
					<Pressable accessibilityRole="button" accessibilityState={{ disabled: loading }} disabled={loading} onPress={onClose} style={[btnStyles.base, btnStyles.secondary, loading && btnStyles.disabled]}>
						<Text style={btnStyles.label}>{cancelText ?? translate('common.cancel')}</Text>
					</Pressable>

					<Pressable accessibilityRole="button" accessibilityState={{ disabled: loading }} disabled={loading} onPress={onConfirm} style={[btnStyles.base, btnStyles[variant], loading && btnStyles.disabled]}>
						<Text style={btnStyles.label}>{confirmText ?? translate('common.confirm')}</Text>
					</Pressable>
				</>
			}
		>
			{message ? <Text style={{ fontSize: 15, color: '#263a53', lineHeight: 22 }}>{message}</Text> : null}
		</BasicModal>
	);
}



export type { ConfirmModalProps };

export { ConfirmModal };