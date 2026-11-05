import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../features/auth/providers/AuthProvider';
import { KycProvider } from '../features/kyc/providers/KycProvider';

export default function RootLayout() {
  return <SafeAreaProvider><AuthProvider><KycProvider><Stack screenOptions={{ headerShown: false }} /></KycProvider></AuthProvider></SafeAreaProvider>;
}
