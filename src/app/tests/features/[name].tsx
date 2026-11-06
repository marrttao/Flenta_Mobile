import { useLocalSearchParams } from 'expo-router';

import { TestRouterScreen } from '../../../features/testing/components/test-router-screen';



function FeatureTestRoute()
{
	const { name } = useLocalSearchParams<{ name: string }>();

	return <TestRouterScreen type="features" name={String(name ?? 'Unknown')}/>;
}



export default FeatureTestRoute;