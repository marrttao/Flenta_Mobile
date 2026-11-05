import { useRef, useState, type PropsWithChildren } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f7fc' }, page: { padding: 20, gap: 16, paddingBottom: 48, width: '100%', maxWidth: 700, alignSelf: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: '#132744' }, heading: { fontSize: 20, fontWeight: '600', color: '#132744' },
  text: { fontSize: 16, color: '#263a53', lineHeight: 24 }, muted: { color: '#5b6b80', fontSize: 14, lineHeight: 21 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, gap: 12, borderWidth: 1, borderColor: '#dde5f0' },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
  button: { backgroundColor: '#2363d8', paddingHorizontal: 18, paddingVertical: 13, borderRadius: 10, alignItems: 'center' },
  secondary: { backgroundColor: '#e4ecfa' }, buttonText: { color: '#fff', fontSize: 15, fontWeight: '600' }, secondaryText: { color: '#183963' },
  input: { backgroundColor: '#fff', borderColor: '#b7c7dc', borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 16, color: '#132744' },
  error: { color: '#a42535', fontSize: 15, lineHeight: 22 }, success: { color: '#1d6748', fontSize: 15, lineHeight: 22 },
});
export function Page({ title, children, headerShown = false }: PropsWithChildren<{ title: string; headerShown?: boolean }>) {
  return <SafeAreaView style={styles.safe} edges={headerShown ? ['left', 'right', 'bottom'] : ['top', 'left', 'right', 'bottom']}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled"><Text accessibilityRole="header" style={styles.title}>{title}</Text>{children}</ScrollView>
  </KeyboardAvoidingView></SafeAreaView>;
}
export function Panel({ children }: PropsWithChildren) { return <View style={styles.card}>{children}</View>; }
export function Button({ title, onPress, disabled, secondary = false }: { title: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: Boolean(disabled) }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => [styles.button, secondary && styles.secondary, { opacity: disabled ? 0.5 : pressed ? 0.7 : 1 }]}>
    <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text></Pressable>;
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={{ gap: 6 }}><Text style={styles.muted}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor="#78899e" style={styles.input} {...props} /></View>;
}
export function Message({ error, text }: { error?: string; text?: string }) {
  return <>{error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}{text ? <Text style={styles.success}>{text}</Text> : null}</>;
}
export function Loading() { return <ActivityIndicator accessibilityLabel="Завантаження" size="large" color="#2363d8" />; }
export function useAction() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const locked = useRef(false);
  const run = async (action: () => Promise<void>) => {
    if (locked.current) return;
    locked.current = true; setBusy(true); setError(''); setMessage('');
    try { await action(); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Не вдалося виконати дію.'); }
    finally { locked.current = false; setBusy(false); }
  };
  return { busy, error, message, setMessage, run };
}
