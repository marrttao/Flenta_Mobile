import { Text, View } from 'react-native';

import { Button, Page, Panel, styles } from '../../index';
import { useToast } from '../hooks/useToast';



function ToastTest()
{
	const toast = useToast();

	return (
		<Page title="Toast Test">
			<Panel>
				<Text style={styles.heading}>Without messages</Text>
				<View style={styles.row}>
					<Button title="Success" onPress={() => toast.showToast({ type: 'success', title: 'Success' })}/>
					<Button title="Error" onPress={() => toast.showToast({ type: 'error', title: 'Error' })}/>
					<Button title="Info" onPress={() => toast.showToast({ type: 'info', title: 'Info' })}/>
					<Button title="Warning" onPress={() => toast.showToast({ type: 'warning', title: 'Warning' })}/>
				</View>
			</Panel>

			<Panel>
				<Text style={styles.heading}>With messages</Text>
				<View style={styles.row}>
					<Button title="Success" onPress={() => toast.showToast({ type: 'success', title: 'Success', message: 'This is a success toast' })}/>
					<Button title="Error" onPress={() => toast.showToast({ type: 'error', title: 'Error', message: 'This is an error toast' })}/>
					<Button title="Info" onPress={() => toast.showToast({ type: 'info', title: 'Info', message: 'This is an info toast' })}/>
					<Button title="Warning" onPress={() => toast.showToast({ type: 'warning', title: 'Warning', message: 'This is a warning toast' })}/>
				</View>
			</Panel>
		</Page>
	);
}



export { ToastTest };