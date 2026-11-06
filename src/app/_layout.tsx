import { Stack } from 'expo-router';



import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocalizationProvider } from '../features/localization';
import { AuthProvider } from '../features/auth/providers/AuthProvider';
import { KycProvider } from '../features/kyc/providers/KycProvider';

if (__DEV__) require('../features/testing/registrations');



function RootLayout()
{
	return (
		<SafeAreaProvider>
			<LocalizationProvider>
				<AuthProvider>
					<KycProvider>
						<Stack screenOptions={{ headerShown: false }}/>
					</KycProvider>
				</AuthProvider>
			</LocalizationProvider>
		</SafeAreaProvider>
	);
}



export default RootLayout;