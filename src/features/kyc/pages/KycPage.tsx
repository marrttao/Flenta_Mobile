import { router } from 'expo-router';
import { Redirect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Text } from 'react-native';
import { Button, Loading, Message, Page, Panel, styles, useAction } from '../../../components/ui';
import { useAuth } from '../../auth/providers/AuthProvider';
import { useKyc } from '../providers/KycProvider';
import { kycApi } from '../api/kycApi';

const labels: Record<string, string> = { NotStarted: 'Перевірку ще не розпочато', InProgress: 'Перевірка триває', PendingReview: 'Документи на розгляді',
  Verified: 'Особу підтверджено', Rejected: 'Перевірку відхилено', NeedsResubmission: 'Потрібно повторити перевірку', Expired: 'Перевірка прострочена' };
export function KycPage() {
  const auth = useAuth(); const kyc = useKyc(); const action = useAction();
  if (auth.isRestoringSession) return <Page title="Підтвердження особи"><Loading /></Page>;
  if (!auth.user) return <Redirect href="/auth/sign-in" />;
  if (kyc.status?.canAccess) return <Redirect href="/banking" />;
  return <Page title="Підтвердження особи"><Panel><Text style={styles.text}>Перед банківськими операціями підтвердь особу через Didit.</Text>
    {kyc.pending ? <Loading /> : <Text style={styles.heading}>{labels[kyc.status?.status ?? ''] ?? kyc.status?.status ?? 'Статус недоступний'}</Text>}
    {kyc.status?.sandbox && <Text style={styles.muted}>Тестова перевірка</Text>}
    <Message error={action.error || kyc.error} text={action.message} />
    <Button title="Розпочати / продовжити перевірку" disabled={action.busy || kyc.pending} onPress={() => void action.run(async () => {
      const session = await kycApi.session(auth.request); const url = new URL(session.url);
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Отримано некоректне посилання перевірки.');
      await WebBrowser.openBrowserAsync(session.url);
      await kyc.load(true);
      action.setMessage('Статус оновлено. Якщо перевірка ще триває, повернися сюди після завершення.');
    })} /><Button title="Оновити статус" secondary disabled={action.busy} onPress={() => void action.run(async () => { await kyc.load(true); })} />
    <Button title="Вийти" secondary onPress={() => void action.run(auth.logout)} /></Panel></Page>;
}
