// import { Redirect } from 'expo-router';
// import { Loading, Page } from '../components/ui';
// import { useAuth } from '../features/auth/providers/AuthProvider';

// export default function Index() {
//   const { user, isRestoringSession } = useAuth();
//   if (isRestoringSession) return <Page title="Flenta"><Loading /></Page>;
//   return <Redirect href={user ? '/banking' : '/auth/sign-in'} />;
// }


import { Text } from 'react-native';
import { Link, Redirect, router } from 'expo-router';

import { useAuth } from '../features/auth/providers/AuthProvider';

import { Button, Loading, Page } from '../components/ui';

import { styles } from '../components/ui';



function Index()
{
	const { user, isRestoringSession } = useAuth();

	if (isRestoringSession) { return <Page title="Flenta"><Loading/></Page>; }
	if (user) { return <Redirect href="/banking"/>; }
	if (!__DEV__) { return <Redirect href="/auth/sign-in"/>; }

	return (
		<Page title="Flenta">
			<Text style={styles.text}>HELLO WORLD!</Text>

			<Button title="Sign In" onPress={() => router.push('/auth/sign-in')}/>
			<Button title="Sign Up" secondary onPress={() => router.push('/auth/sign-up')}/>

			<Text style={styles.heading}>Developer</Text>
			<Button title="Tests" secondary onPress={() => router.push('/tests')}/>
		</Page>
	);
}



export default Index;