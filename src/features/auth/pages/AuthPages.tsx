import { useEffect, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { Button, Field, Loading, Message, Page, styles, useAction } from '../../../components/ui';
import { useAuth } from '../providers/AuthProvider';
import type { PkcePurpose } from '../api/pkce';
import { readCallbackCode } from '../utils/callback';

export function SignInPage() {
  const auth = useAuth(); const action = useAction();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  return <Page title="Вхід у Flenta"><Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
    <Field label="Пароль" value={password} onChangeText={setPassword} secureTextEntry autoComplete="current-password" />
    <Message error={action.error || auth.error} />
    <Button title="Увійти" disabled={action.busy || !email.trim() || !password} onPress={() => void action.run(async () => { await auth.login(email, password); setPassword(''); router.replace('/'); })} />
    {auth.error && <Button title="Повторити відновлення сесії" secondary onPress={() => void auth.retryRestore()} />}
    <Link href="/auth/sign-up" style={styles.text}>Створити обліковий запис</Link><Link href="/auth/forgot-password" style={styles.text}>Забув пароль</Link>
  </Page>;
}
export function SignUpPage() {
  const auth = useAuth(); const action = useAction();
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  return <Page title="Реєстрація"><Field label="Ім’я" value={name} onChangeText={setName} maxLength={100} />
    <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" autoComplete="email" />
    <Field label="Пароль (12–128 символів)" value={password} onChangeText={setPassword} secureTextEntry autoComplete="new-password" maxLength={128} />
    <Message error={action.error} text={action.message} />
    <Button title="Зареєструватися" disabled={action.busy || !name.trim() || !email.trim() || password.length < 12} onPress={() => void action.run(async () => {
      const result = await auth.register(email, password, name); setPassword('');
      if (result.session) router.replace('/'); else action.setMessage('Перевір пошту та відкрий посилання на цьому телефоні.');
    })} /><Link href="/auth/sign-in" style={styles.text}>Уже є обліковий запис</Link>
  </Page>;
}
export function ForgotPasswordPage() {
  const { recover } = useAuth(); const action = useAction(); const [email, setEmail] = useState('');
  return <Page title="Відновлення пароля"><Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
    <Message error={action.error} text={action.message} /><Button title="Надіслати лист" disabled={action.busy || !email.trim()} onPress={() => void action.run(async () => {
      await recover(email); action.setMessage('Якщо адресу зареєстровано, на неї надійде лист. Відкрий його на цьому телефоні.');
    })} /><Link href="/auth/sign-in" style={styles.text}>До входу</Link></Page>;
}
export function EmailCallbackPage({ purpose }: { purpose: PkcePurpose }) {
  const params = useLocalSearchParams<{ code?: string | string[]; error?: string | string[]; error_description?: string | string[] }>();
  const { exchangeCode, isRestoringSession } = useAuth();
  const [result, setResult] = useState<{ key: string; error: string } | null>(null);
  const key = JSON.stringify([purpose, params.code, params.error, params.error_description]);
  useEffect(() => {
    if (isRestoringSession) return;
    let active = true;
    (async () => { await exchangeCode(readCallbackCode(params), purpose); })()
      .then(() => { if (active) setResult({ key, error: '' }); })
      .catch((failure: unknown) => { if (active) setResult({ key, error: failure instanceof Error ? failure.message : 'Не вдалося підтвердити код.' }); });
    return () => { active = false; };
  }, [key, purpose, exchangeCode, isRestoringSession]);
  if (result?.key !== key) return <Page title="Перевірка посилання"><Loading /></Page>;
  if (result.error) return <Page title="Посилання недійсне"><Message error={result.error} /><Link href="/auth/forgot-password" style={styles.text}>Запросити відновлення пароля</Link><Link href="/auth/sign-in" style={styles.text}>До входу</Link></Page>;
  if (purpose === 'reset-password') return <ChangePasswordPage recovery />;
  return <Page title="Пошту підтверджено"><Text style={styles.text}>Обліковий запис активовано.</Text><Button title="Продовжити" onPress={() => router.replace('/')} /></Page>;
}
export function ChangePasswordPage({ recovery = false }: { recovery?: boolean }) {
  const { request, user } = useAuth(); const action = useAction();
  const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState('');
  if (!user) return <Page title="Зміна пароля"><Link href="/auth/sign-in" style={styles.text}>Увійти знову</Link></Page>;
  return <Page title={recovery ? 'Новий пароль' : 'Зміна пароля'}><Field label="Новий пароль (12–128 символів)" value={password} onChangeText={setPassword} secureTextEntry maxLength={128} autoComplete="new-password" />
    <Field label="Повтори пароль" value={confirm} onChangeText={setConfirm} secureTextEntry maxLength={128} />
    <Message error={action.error} text={action.message} /><Button title="Зберегти пароль" disabled={action.busy || password.length < 12 || password !== confirm} onPress={() => void action.run(async () => {
      await request('/api/auth/password', { method: 'PUT', body: { newPassword: password } }); setPassword(''); setConfirm(''); action.setMessage('Пароль змінено.');
    })} /><Button title="До застосунку" secondary onPress={() => router.replace('/')} /></Page>;
}
