import { router } from 'expo-router';

import { Button, Page } from '../../../components/ui';



function TestHomeScreen()
{
	return (
		<Page title="Tests">
			<Button title="Home" secondary onPress={() => router.push('/')}/>
			<Button title="Back" secondary onPress={() => router.back()}/>
			
			<Button title="Features" onPress={() => router.push('/tests/features')}/>
			<Button title="UI" onPress={() => router.push('/tests/ui')}/>
			<Button title="API" onPress={() => router.push('/tests/api')}/>
		</Page>
	);
}



export default TestHomeScreen;