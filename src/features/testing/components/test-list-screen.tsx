import { router } from 'expo-router';

import type { TypeOfTest } from '../registry';

import { getRegistry } from '../registry';

import { Text, View } from 'react-native';
import { Button, Page } from '../../../components/ui';

import { styles } from '../../../components/ui';



interface TestListScreenProps
{
	type: TypeOfTest;
}



function capitalize(value: TypeOfTest): string { return value.charAt(0).toUpperCase() + value.slice(1);}


function TestListScreen({ type }: TestListScreenProps)
{
	const names = Object.keys(getRegistry(type));

	return (
		<Page title={`${capitalize(type)} Tests`}>
			<Button title="Home" secondary onPress={() => router.push('/')}/>
			<Button title="Back" secondary onPress={() => router.back()}/>

			{
				names.length === 0
				?
					<Text style={styles.muted}>No tests registered for this type</Text>
				:
					names.map
					(
						(name) =>
						(
							<View key={name} style={{ gap: 10 }}>
								<Button title={name} onPress={() => router.push(`/tests/${type}/${encodeURIComponent(name) as never}`)}/>
							</View>
						)
					)
			}
		</Page>
	);
}



export { TestListScreen };