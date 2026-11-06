import { router } from 'expo-router';

import type { TypeOfTest } from '../registry';

import { getRegistry } from '../registry';

import { Text, View } from 'react-native';
import { Button, Page } from '../../../components/ui';

import { styles } from '../../../components/ui';



interface TestRouterScreenProps
{
	type: TypeOfTest;
	name: string;
}



function TestRouterScreen({ type, name }: TestRouterScreenProps)
{
	const registry = getRegistry(type);
	const Component = registry[name];

	if (!Component)
	{
		return (
			<Page title="Test Not Found">
				<Text style={styles.muted}>Test not found: {name}</Text>

				<Button title="Home" secondary onPress={() => router.push('/')}/>
				<Button title="Back" secondary onPress={() => router.back()}/>
			</Page>
		)
	}

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
			<Page title={name}>
				<Button title="Home" secondary onPress={() => router.push('/')}/>
				<Button title="Back" secondary onPress={() => router.back()}/>

				<Component/>
			</Page>
		</View>
	);
}



export { TestRouterScreen };