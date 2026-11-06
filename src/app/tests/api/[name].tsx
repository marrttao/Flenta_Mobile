import { useLocalSearchParams } from 'expo-router';

import { TestRouterScreen } from '../../../features/testing/components/test-router-screen';



function ApiTestRoute()
{
	const { name } = useLocalSearchParams<{ name: string }>();

	return <TestRouterScreen type="api" name={String(name ?? 'Unknown')}/>;
}



export default ApiTestRoute;