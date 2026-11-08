import { Stack } from 'expo-router';



import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LocalizationProvider } from '../features/localization/index';
import { ToastProvider } from '../components/ui/index';
import { AuthProvider } from '../features/auth/providers/AuthProvider';
import { KycProvider } from '../features/kyc/providers/KycProvider';
if (__DEV__) require('../features/testing/registrations');



function RootLayout()
{
	return (
		<SafeAreaProvider>
			<LocalizationProvider>
				<ToastProvider>
					<AuthProvider>
						<KycProvider>
							<Stack screenOptions={{ headerShown: false }}/>
						</KycProvider>
					</AuthProvider>
				</ToastProvider>
			</LocalizationProvider>
		</SafeAreaProvider>
	);
}



export default RootLayout;