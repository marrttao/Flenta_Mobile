import { Text, View } from 'react-native';

import { styles } from '../../../components/ui';



function ExampleFeatureTest()
{
	return (
		<View style={{ gap: 10, padding: 20 }}>
			<Text style={styles.title}>Example Test Screen</Text>
			<Text style={styles.text}>Lore ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
			<Text style={styles.muted}>Route: /tests/features/example-test</Text>
		</View>
	);
}



export { ExampleFeatureTest };