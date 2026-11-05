import { Redirect } from 'expo-router';
import { Loading, Page } from '../components/ui';
import { useAuth } from '../features/auth/providers/AuthProvider';

export default function Index() {
  const { user, isRestoringSession } = useAuth();
  if (isRestoringSession) return <Page title="Flenta"><Loading /></Page>;
  return <Redirect href={user ? '/banking' : '/auth/sign-in'} />;
}
