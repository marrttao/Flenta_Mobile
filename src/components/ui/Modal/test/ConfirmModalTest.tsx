import { useState } from 'react';
import { Text } from 'react-native';

import { Button, Page, Panel, styles } from '../../index';
import { ConfirmModal } from '../components/ConfirmModal';



function ConfirmModalTest()
{
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [variant, setVariant] = useState<'primary' | 'secondary' | 'danger'>('primary');

	const handleConfirm = () =>
	{
		setLoading(true);
		setTimeout(() => { setLoading(false); setIsOpen(false); }, 2000);
	};

	return (
		<Page title="Confirm Modal Test">
			<Panel>
				<Button title="Open Confirm Modal" onPress={() => setIsOpen(true)}/>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Variant</Text>
				<Button title="Primary" secondary={variant !== 'primary'} onPress={() => setVariant('primary')}/>
				<Button title="Secondary" secondary={variant !== 'secondary'} onPress={() => setVariant('secondary')}/>
				<Button title="Danger" secondary={variant !== 'danger'} onPress={() => setVariant('danger')}/>
			</Panel>

			<ConfirmModal
				isOpen={isOpen}
				
				title="Confirm Action"
				message="Are you sure you want to proceed?"
				
				confirmText="Yes"
				cancelText="No"
				
				variant={variant}
				loading={loading}
				
				onClose={() => setIsOpen(false)}
				onConfirm={handleConfirm}
			/>
		</Page>
	);
}



export { ConfirmModalTest };