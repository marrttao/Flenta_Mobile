import { useCallback, useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { Text } from 'react-native';
import { Button, Field, Loading, Message, Page, Panel, styles, useAction } from '../../../components/ui';
import { useAuth } from '../../auth/providers/AuthProvider';
import { profileApi } from '../api/profileApi';
import { useResource } from '../../../hooks/useResource';

export function ProfilePage() {
  const auth = useAuth(); const { request, updateUser } = auth; const action = useAction();
  const [name, setName] = useState<string | null>(null);
  const profile = useResource(useCallback(() => profileApi.get(request), [request]));
  useEffect(() => { if (profile.data) updateUser(profile.data); }, [profile.data, updateUser]);
  const displayName = name ?? auth.user?.displayName ?? '';
  return <Page title="Профіль" headerShown><Panel>{profile.pending && <Loading />}<Message error={profile.error || action.error} text={action.message} />
    <Text selectable style={styles.text}>{auth.user?.email}</Text><Field label="Ім’я" value={displayName} onChangeText={setName} maxLength={100} />
    <Button title="Зберегти" disabled={action.busy || !displayName.trim()} onPress={() => void action.run(async () => { updateUser(await profileApi.update(request, displayName.trim())); setName((current) => current === displayName ? null : current); action.setMessage('Профіль збережено.'); })} />
    <Link href="/auth/change-password" style={styles.text}>Змінити пароль</Link><Button title="Вийти" secondary disabled={action.busy} onPress={() => void action.run(auth.logout)} />
  </Panel></Page>;
}
