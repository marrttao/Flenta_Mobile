import { Text, View } from 'react-native';

import { Page, Panel, styles } from '../../index';
import { Loader } from '../components/Loader';



function LoaderTest()
{
	return (
		<Page title="Loader Test">
			<Panel>
				<Text style={styles.heading}>Without labels</Text>
				<View style={styles.row}>
					<Loader size="small"/>
					<Loader size="medium"/>
					<Loader size="large"/>
				</View>
			</Panel>

			<Panel>
				<Text style={styles.heading}>With labels</Text>
				<View style={styles.row}>
					<Loader size="small" label="Loading small..."/>
					<Loader size="medium" label="Loading medium..."/>
					<Loader size="large" label="Loading large..."/>
				</View>
			</Panel>
		</Page>
	);
}



export { LoaderTest };