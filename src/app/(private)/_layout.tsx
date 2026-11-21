import { Redirect, Tabs } from 'expo-router';
import { Loading, Page } from '../../components/ui';
import { useAuth } from '../../features/auth/providers/AuthProvider';
import { useKyc } from '../../features/kyc/providers/KycProvider';
import { useTheme } from '../../features/theme';

export default function PrivateLayout()
{
	const auth = useAuth();
	const kyc = useKyc();
	const { theme } = useTheme();

	if (auth.isRestoringSession) return <Page title="Flenta"><Loading /></Page>;
	if (!auth.user) return <Redirect href="/auth/sign-in" />;
	if (kyc.pending) return <Page title="Перевірка доступу"><Loading /></Page>;
	if (!kyc.status?.canAccess) return <Redirect href="/kyc" />;

	return (
		<Tabs
			key={auth.user.id}
			screenOptions={{
				tabBarActiveTintColor: theme.colors.action.primary,
				tabBarInactiveTintColor: theme.colors.neutral.tertiary,
				headerTitle: 'Flenta',
				tabBarStyle: { backgroundColor: theme.colors.neutral.base, borderTopColor: theme.colors.neutral.divider }
			}}
		>
			<Tabs.Screen name="banking" options={{ title: 'Мій банк' }} />
			<Tabs.Screen name="finance" options={{ title: 'Фінанси' }} />
			<Tabs.Screen name="profile" options={{ title: 'Профіль' }} />
			<Tabs.Screen name="tests" options={{ title: 'Tests' }} />
		</Tabs>
	);
}