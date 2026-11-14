import { Pressable, StyleSheet, Text } from 'react-native';

import { useTranslation } from '../../localization';

import { BasicModal } from '../../../components/ui';



interface IdleTimeoutModalProps
{
	isOpen: boolean;
	secondsLeft: number;

	onStay: () => Promise<void>;
	onLogout: () => Promise<void>;
}



const styles = StyleSheet.create
(
	{
		description:
		{
			color: '#263a53',

			fontSize: 15,
			lineHeight: 22
		},

		button:
		{
			minWidth: 96,

			paddingHorizontal: 16,
			paddingVertical: 10,

			alignItems: 'center',

			borderRadius: 8
		},
		button_primary: { backgroundColor: '#2563eb' },
		button_secondary: { backgroundColor: '#333333' },

		button_label:
		{
			color: '#ffffff',

			fontSize: 14,
			fontWeight: '600'
		}
	}
);



function IdleTimeoutModal({ isOpen, secondsLeft, onStay, onLogout }: IdleTimeoutModalProps)
{
	const { translate } = useTranslation();

	return (
		<BasicModal
			isOpen={isOpen}

			onClose={() => undefined}
			
			size="small"
			title={translate('auth.idle.title')}
			
			showCloseButton={false}
			
			closeOnBackdropClick={false}
			closeOnEscapeClick={false}
			
			footer=
			{
				<>
					<Pressable accessibilityRole="button" onPress={() => void onLogout()} style={[styles.button, styles.button_secondary]}>
						<Text style={styles.button_label}>{translate('auth.idle.logout')}</Text>
					</Pressable>

					<Pressable accessibilityRole="button" onPress={() => void onStay()} style={[styles.button, styles.button_primary]}>
						<Text style={styles.button_label}>{translate('auth.idle.stay')}</Text>
					</Pressable>
				</>
			}
		>
			<Text style={styles.description}>{translate('auth.idle.description').replace('{seconds}', String(secondsLeft))}</Text>
		</BasicModal>
	);
}



export type { IdleTimeoutModalProps };

export { IdleTimeoutModal };