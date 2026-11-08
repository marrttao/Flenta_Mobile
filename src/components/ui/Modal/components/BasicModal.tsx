import type { ReactNode } from 'react';

import { useTranslation } from '../../../../features/localization';

import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';



type ModalSize = 'small' | 'medium' | 'large';

interface BasicModalProps
{
	isOpen: boolean;

	closeOnBackdropClick?: boolean;
	closeOnEscapeClick?: boolean;
	showCloseButton?: boolean;
	
	size?: ModalSize;
	title?: string;
	children?: ReactNode;
	footer?: ReactNode;
	
	onClose?: () => void;
}



const sizeStyles = StyleSheet.create
(
	{
		small: { maxWidth: 360 },
		medium: { maxWidth: 520 },
		large: { maxWidth: 760 },
	}
);

const styles = StyleSheet.create
(
	{
		backdrop:
		{
			padding: 16,

			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',

			backgroundColor: 'rgba(0,0,0,0.7)'
		},

		dialog:
		{
			width: '100%',
			maxHeight: '85%',

			backgroundColor: '#ffffff',
			
			borderRadius: 16,
			
			overflow: 'hidden'
		},

		header:
		{
			paddingHorizontal: 20,
			paddingVertical: 16,

			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 12,
			
			borderBottomWidth: 1,
			borderBottomColor: '#e5e7eb'
		},

		title:
		{
			flex: 1,
		
			fontSize: 18,
			fontWeight: '600',
			color: '#132744'
		},
		
		close_button:
		{
			width: 32,
			height: 32,
		
			alignItems: 'center',
			justifyContent: 'center',
		
			borderRadius: 8,
		
			backgroundColor: '#f3f4f6'
		},

		close_x:
		{
			color: '#6b7280',

			fontSize: 20,
			lineHeight: 20
		},

		body:
		{
			padding: 20,
			gap: 12
		},
		
		footer:
		{
			paddingHorizontal: 20,
			paddingVertical: 16,
			
			flexDirection: 'row',
			justifyContent: 'flex-end',
			gap: 8,
			
			borderTopWidth: 1,
			borderTopColor: '#e5e7eb'
		}
	}
);



function BasicModal({ isOpen, closeOnBackdropClick = true, closeOnEscapeClick = true, showCloseButton = true, size = 'medium', title, children, footer, onClose }: BasicModalProps)
{
	const { translate } = useTranslation();
	const requestClose = closeOnEscapeClick ? onClose : undefined;

	return (
		<Modal visible={isOpen} transparent animationType="fade" onRequestClose={requestClose}>
			<Pressable style={styles.backdrop} onPress={closeOnBackdropClick ? onClose : undefined}>
				<Pressable style={[styles.dialog, sizeStyles[size]]} onPress={() => {}}>
					{
						(title || showCloseButton) &&
						(
							<View style={styles.header}>
								{title ? <Text style={styles.title}>{title}</Text> : <View style={{ flex: 1 }}/>}
								{
									showCloseButton &&
									(
										<Pressable accessibilityRole="button" accessibilityLabel={translate('common.close')} onPress={onClose} style={styles.close_button} hitSlop={8}>
											<Text style={styles.close_x}>×</Text>
										</Pressable>
									)
								}
							</View>
						)
					}

					<View style={styles.body}>{children}</View>
					{footer ? <View style={styles.footer}>{footer}</View> : null}
				</Pressable>
			</Pressable>
		</Modal>
	);
}



export type { ModalSize, BasicModalProps };

export { BasicModal };