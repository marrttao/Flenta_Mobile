import { useState } from 'react';
import { Text } from 'react-native';

import { Button, Page, Panel, styles } from '../../index';
import { BasicModal, type ModalSize } from '../components/BasicModal';



function BasicModalTest()
{
	const [isOpen, setIsOpen] = useState(false);
	const [size, setSize] = useState<ModalSize>('medium');
	const [closeOnBackdropClick, setCloseOnBackdropClick] = useState(true);

	return (
		<Page title="Basic Modal Test">
			<Panel>
				<Text style={styles.heading}>Open</Text>
				<Button title="Open Modal" onPress={() => setIsOpen(true)}/>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Size</Text>
				<Button title="Small" secondary={size !== 'small'} onPress={() => setSize('small')}/>
				<Button title="Medium" secondary={size !== 'medium'} onPress={() => setSize('medium')}/>
				<Button title="Large" secondary={size !== 'large'} onPress={() => setSize('large')}/>
			</Panel>

			<Panel>
				<Text style={styles.heading}>closeOnBackdropClick</Text>
				<Button title={closeOnBackdropClick ? 'Enabled (tap to disable)' : 'Disabled (tap to enable)'} secondary onPress={() => setCloseOnBackdropClick((v) => !v)}/>
			</Panel>

			<BasicModal isOpen={isOpen} size={size} title="Basic Modal Test" closeOnBackdropClick={closeOnBackdropClick} onClose={() => setIsOpen(false)}>
				<Text style={styles.text}>Current size: {size}</Text>
				<Text style={styles.muted}>closeOnBackdropClick: {closeOnBackdropClick ? 'on' : 'off'}</Text>
			</BasicModal>
		</Page>
	);
}



export { BasicModalTest };