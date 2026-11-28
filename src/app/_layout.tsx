import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../features/theme/index';
import { LocalizationProvider } from '../features/localization/index';
import { ToastProvider } from '../components/ui/index';
import { AuthProvider } from '../features/auth/providers/AuthProvider';
import { KycProvider } from '../features/kyc/providers/KycProvider';
if (__DEV__) require('../features/testing/registrations');

import { useTheme } from '../features/theme';

import { IdleTimeoutHost } from '../features/auth/components/IdleTimeoutHost';
import { StatusBar } from 'expo-status-bar';

import * as SplashScreen from 'expo-splash-screen';
import { SplashOverlay } from '../features/splash';

import { useFonts, Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';



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
	const [loaded, error] = useFonts
	(
		{
			'Manrope-Regular':   Manrope_400Regular,
			'Manrope-Medium':    Manrope_500Medium,
			'Manrope-SemiBold':  Manrope_600SemiBold,
			'Manrope-Bold':      Manrope_700Bold,
			'Manrope-ExtraBold': Manrope_800ExtraBold,
		}
	);
	const [splashDone, setSplashDone] = useState(false);

	useEffect(() => { if (loaded || error) { SplashScreen.hideAsync(); } }, [loaded, error]);

	if (!loaded && !error) { return null; }

	return (
		<SafeAreaProvider>
			<ThemeProvider>
				<ThemedApp/>
				
				{ !splashDone && (<SplashOverlay logo={require('../../assets/images/logo/logo-light.png')} onFinish={() => setSplashDone(true)}/>) }
			</ThemeProvider>
		</SafeAreaProvider>
	);
}

function ThemedApp()
{
	const { scheme } = useTheme();

	return (
		<>
			<StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
			<LocalizationProvider>
				<ToastProvider>
					<QueryClientProvider client={queryClient}>
						<AuthProvider>
							<KycProvider>
								<Stack screenOptions={{ headerShown: false }}/>
								<IdleTimeoutHost/>
							</KycProvider>
						</AuthProvider>
					</QueryClientProvider>
				</ToastProvider>
			</LocalizationProvider>
		</>
	);
}



export default RootLayout;