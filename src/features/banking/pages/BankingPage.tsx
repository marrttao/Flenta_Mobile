import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { AppState, Text, View } from 'react-native';
import { Button, Field, Loading, Message, Page, Panel, styles, useAction } from '../../../components/ui';
import { useAuth } from '../../auth/providers/AuthProvider';
import { createBankingApi } from '../api/bankingApi';
import { AccountPicker } from '../components/AccountPicker';
import { useResource } from '../../../hooks/useResource';
import type { CardSecrets, Transaction, TransferQuote } from '../types';
import { money, parseAmount } from '../utils/money';
import { transactionMessage } from '../utils/transaction';

export function BankingPage() {
  const { request } = useAuth();
  const api = useMemo(() => createBankingApi(request), [request]);
  const [offset, setOffset] = useState(0);
  const resource = useResource(useCallback(() => api.snapshot(offset), [api, offset]));
  const action = useAction(); const data = resource.data;
  const [currency, setCurrency] = useState('UAH');
  const [source, setSource] = useState(''); const [amount, setAmount] = useState('');
  const [byIban, setByIban] = useState(true); const [destination, setDestination] = useState('');
  const [quote, setQuote] = useState<{ fingerprint: string; value: TransferQuote } | null>(null);
  const [password, setPassword] = useState(''); const [secrets, setSecrets] = useState<CardSecrets | null>(null);
  const secretsGeneration = useRef(0);
  const accounts = data?.accounts ?? [];
  const sourceId = accounts.some((account) => account.id === source) ? source : accounts[0]?.id ?? '';
  const fingerprint = JSON.stringify([sourceId, amount, byIban, destination]);
  const currentQuote = quote?.fingerprint === fingerprint ? quote.value : null;
  const hideSecrets = useCallback(() => { secretsGeneration.current += 1; setSecrets(null); setPassword(''); }, []);
  useFocusEffect(useCallback(() => {
    const listener = AppState.addEventListener('change', (state) => { if (state !== 'active') hideSecrets(); });
    return () => { listener.remove(); hideSecrets(); };
  }, [hideSecrets]));
  useEffect(() => { if (!secrets) return; const timer = setTimeout(hideSecrets, 30_000); return () => clearTimeout(timer); }, [secrets, hideSecrets]);

  const perform = (work: () => Promise<unknown>) => void action.run(async () => {
    const result = await work();
    action.setMessage(result && typeof result === 'object' && 'kind' in result ? transactionMessage(result as Transaction) : 'Зміни збережено.');
    await resource.reload();
  });
  return <Page title="Мій банк" headerShown><Message error={action.error || resource.error} text={action.message} />
    <Button title="Оновити" secondary disabled={resource.pending || action.busy} onPress={() => void resource.reload()} />{resource.pending && <Loading />}
    <Panel><Text style={styles.heading}>Рахунки</Text>{accounts.map((account) => <View key={account.id} style={{ gap: 6 }}>
      <Text style={styles.heading}>{money(account.balance, account.currency)}</Text><Text selectable style={styles.muted}>{account.iban}</Text>
      <Button title="Випустити тестову картку" secondary disabled={action.busy} onPress={() => perform(() => api.createCard(account.id))} /></View>)}
      <View style={styles.row}>{['UAH', 'USD', 'EUR'].map((code) => <Button key={code} title={code} secondary={currency !== code} onPress={() => setCurrency(code)} />)}</View>
      <Button title="Відкрити рахунок" disabled={action.busy} onPress={() => perform(() => api.openAccount(currency))} /></Panel>
    {accounts.length > 0 && <Panel><Text style={styles.heading}>Поповнення та переказ</Text><AccountPicker label="З рахунку" accounts={accounts} value={sourceId} onChange={setSource} />
      <Field label="Сума" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
      <Button title="Тестове поповнення" secondary disabled={action.busy} onPress={() => perform(() => api.topUp(sourceId, parseAmount(amount)))} />
      <View style={styles.row}><Button title="За IBAN" secondary={!byIban} onPress={() => { setByIban(true); setDestination(''); }} /><Button title="Між рахунками" secondary={byIban} onPress={() => { setByIban(false); setDestination(''); }} /></View>
      {byIban ? <Field label="IBAN одержувача" value={destination} onChangeText={setDestination} autoCapitalize="characters" />
        : <AccountPicker label="На рахунок" accounts={accounts.filter((account) => account.id !== sourceId)} value={destination} onChange={setDestination} />}
      <Button title="Розрахувати комісію" secondary disabled={action.busy || !destination.trim()} onPress={() => void action.run(async () => {
        const value = await api.quote({ sourceAccountId: sourceId, amount: parseAmount(amount), byIban }); setQuote({ fingerprint, value });
      })} />
      {currentQuote && <><Text style={styles.text}>Комісія: {money(currentQuote.fee, currentQuote.currency)}. Разом: {money(currentQuote.total, currentQuote.currency)}.</Text>
        {!currentQuote.sufficientFunds && <Text style={styles.error}>Недостатньо коштів.</Text>}
        <Button title="Підтвердити переказ" disabled={action.busy || !currentQuote.sufficientFunds} onPress={() => perform(async () => {
          const result = await api.transfer(byIban, { sourceAccountId: sourceId, amount: parseAmount(amount), ...(byIban ? { iban: destination.trim() } : { destinationAccountId: destination }) });
          setQuote(null); return result;
        })} /></>}
    </Panel>}
    <Panel><Text style={styles.heading}>Картки</Text><Text style={styles.muted}>Тестові картки Flenta. Реквізити приховаються через 30 секунд або при виході з екрана.</Text>
      {(data?.cards ?? []).map((card) => <View key={card.id} style={{ gap: 8 }}><Text style={styles.text}>{card.maskedNumber} · {card.status}</Text>
        <View style={styles.row}><Button title={card.status === 'Blocked' ? 'Розблокувати' : 'Заблокувати'} secondary disabled={action.busy || card.status === 'Closed'} onPress={() => perform(() => api.changeCard(card.id, card.status === 'Blocked' ? 'unblock' : 'block'))} />
          <Button title="Закрити" secondary disabled={action.busy || card.status === 'Closed'} onPress={() => perform(() => api.changeCard(card.id, 'close'))} /></View>
        <Button title="Показати реквізити" secondary disabled={action.busy || !password || card.status === 'Closed'} onPress={() => void action.run(async () => {
          const generation = secretsGeneration.current;
          const value = await api.requisites(card.id, password); setPassword('');
          if (generation === secretsGeneration.current && AppState.currentState === 'active') setSecrets(value);
        })} /></View>)}
      {(data?.cards.length ?? 0) > 0 && <Field label="Пароль для перегляду реквізитів" value={password} onChangeText={setPassword} secureTextEntry />}
      {secrets && <><Text selectable style={styles.text}>{secrets.number} · CVV {secrets.cvv} · {secrets.expiryMonth}/{secrets.expiryYear}</Text><Button title="Приховати" secondary onPress={hideSecrets} /></>}
    </Panel>
    <Panel><Text style={styles.heading}>Операції</Text>{data?.transactions.length === 0 && <Text style={styles.muted}>Операцій поки немає.</Text>}
      {data?.transactions.map((transaction) => <View key={transaction.id}><Text style={styles.text}>{transaction.kind} · {money(transaction.amount, transaction.currency)}</Text><Text style={styles.muted}>{transaction.status} · {new Date(transaction.createdAt).toLocaleString()}{transaction.failureCode ? ` · ${transaction.failureCode}` : ''}</Text></View>)}
      <View style={styles.row}><Button title="Назад" secondary disabled={offset === 0 || resource.pending} onPress={() => setOffset(Math.max(0, offset - 20))} />
        <Button title="Далі" secondary disabled={resource.pending || (data?.transactions.length ?? 0) < 20} onPress={() => setOffset(offset + 20)} /></View>
    </Panel>
  </Page>;
}
