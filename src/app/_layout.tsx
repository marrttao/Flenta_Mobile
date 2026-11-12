import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../features/theme/index';
import { LocalizationProvider } from '../features/localization/index';
import { ToastProvider } from '../components/ui/index';
import { AuthProvider } from '../features/auth/providers/AuthProvider';
import { KycProvider } from '../features/kyc/providers/KycProvider';
if (__DEV__) require('../features/testing/registrations');



const queryClient = new QueryClient
(
	{
		defaultOptions:
		{
			queries:
			{
				retry: 1,
				staleTime: 60_000,
			},
		},
	}
);



function RootLayout()
{
	return (
		<SafeAreaProvider>
			<ThemeProvider>
				<LocalizationProvider>
					<ToastProvider>
						<QueryClientProvider client={queryClient}>
							<AuthProvider>
								<KycProvider>
									<Stack screenOptions={{ headerShown: false }}/>
								</KycProvider>
							</AuthProvider>
						</QueryClientProvider>
					</ToastProvider>
				</LocalizationProvider>
			</ThemeProvider>
		</SafeAreaProvider>
	);
}



export default RootLayout;