import { useLocalSearchParams } from 'expo-router';

import { TestRouterScreen } from '../../../features/testing/components/test-router-screen';



function UiTestRoute()
{
	const { name } = useLocalSearchParams<{ name: string }>();

	return <TestRouterScreen type="ui" name={String(name ?? 'Unknown')}/>;
}



export default UiTestRoute;