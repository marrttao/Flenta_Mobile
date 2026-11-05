import { useCallback, useMemo, useState } from 'react';
import { Text } from 'react-native';
import { Button, Field, Loading, Message, Page, Panel, styles, useAction } from '../../../components/ui';
import { useAuth } from '../../auth/providers/AuthProvider';
import { useResource } from '../../../hooks/useResource';
import { createFinanceApi } from '../api/financeApi';
import type { Account, Card, Transaction } from '../../banking/types';
import { AccountPicker } from '../../banking/components/AccountPicker';
import { money, parseAmount } from '../../banking/utils/money';
import { transactionMessage } from '../../banking/utils/transaction';
import type { ExchangeQuote } from '../types';
import { GoalPanel } from '../components/GoalPanel';
import { localDate, parseDeadline } from '../utils/date';

export function FinancePage() {
  const { request } = useAuth(); const api = useMemo(() => createFinanceApi(request), [request]); const action = useAction();
  const [from, setFrom] = useState(() => localDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const [through, setThrough] = useState(() => localDate());
  const [period, setPeriod] = useState({ from, through });
  const main = useResource(useCallback(async () => {
    const [accounts, cards, goals, cashback] = await Promise.all([request<Account[]>('/api/accounts'), request<Card[]>('/api/cards'), api.goals(), api.cashback()]);
    return { accounts, cards, goals, cashback };
  }, [request, api]));
  // A rate-provider outage must not hide savings or the user's accounts.
  const rates = useResource(useCallback(() => api.rates(), [api]));
  const analytics = useResource(useCallback(() => api.analytics(period.from, period.through), [api, period]));
  const accounts = main.data?.accounts ?? [];
  const [source, setSource] = useState(''); const [destination, setDestination] = useState(''); const [amount, setAmount] = useState('');
  const sourceId = accounts.some((account) => account.id === source) ? source : accounts[0]?.id ?? '';
  const [quote, setQuote] = useState<{ fingerprint: string; value: ExchangeQuote } | null>(null);
  const fingerprint = JSON.stringify([sourceId, destination, amount]); const currentQuote = quote?.fingerprint === fingerprint ? quote.value : null;
  const [goalName, setGoalName] = useState(''); const [target, setTarget] = useState(''); const [deadline, setDeadline] = useState('');
  const [cardId, setCardId] = useState(''); const [purchaseAmount, setPurchaseAmount] = useState('');
  const perform = (work: () => Promise<unknown>) => void action.run(async () => {
    const result = await work();
    action.setMessage(result && typeof result === 'object' && 'kind' in result ? transactionMessage(result as Transaction) : 'Зміни збережено.');
    await Promise.all([main.reload(), analytics.reload()]);
  });
  return <Page title="Фінанси" headerShown><Message error={action.error || main.error} text={action.message} />{main.pending && <Loading />}
    <Button title="Оновити" secondary disabled={action.busy || main.pending} onPress={() => { void main.reload(); void rates.reload(); void analytics.reload(); }} />
    <Panel><Text style={styles.heading}>Курси валют</Text><Message error={rates.error} />{rates.data && <><Text style={styles.muted}>{rates.data.source} · {rates.data.date}</Text>
      {Object.entries(rates.data.uahPerUnit).map(([currency, rate]) => <Text key={currency} style={styles.text}>1 {currency} = {rate} UAH</Text>)}</>}</Panel>
    {accounts.length > 0 && <><Panel><Text style={styles.heading}>Обмін валют</Text><AccountPicker label="З рахунку" accounts={accounts} value={sourceId} onChange={setSource} />
      <AccountPicker label="На рахунок" accounts={accounts.filter((account) => account.currency !== accounts.find((item) => item.id === sourceId)?.currency)} value={destination} onChange={setDestination} />
      <Field label="Сума обміну" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
      <Button title="Отримати пропозицію" secondary disabled={action.busy || !destination} onPress={() => void action.run(async () => { setQuote({ fingerprint, value: await api.quote(sourceId, destination, parseAmount(amount)) }); })} />
      {currentQuote && <><Text style={styles.text}>Отримаєш {money(currentQuote.receivedAmount, currentQuote.destinationCurrency)}. Курс: {currentQuote.rate}. Комісія: {currentQuote.fee}.</Text>
        <Text style={styles.muted}>Пропозиція чинна до {new Date(currentQuote.expiresAt).toLocaleTimeString()}.</Text><Button title="Підтвердити обмін" disabled={action.busy} onPress={() => perform(async () => { const result = await api.exchange(currentQuote.id); setQuote(null); return result; })} /></>}
    </Panel><Panel><Text style={styles.heading}>Нова ціль накопичення</Text><AccountPicker label="Рахунок поповнення цілі" accounts={accounts} value={sourceId} onChange={setSource} />
      <Field label="Назва цілі" value={goalName} onChangeText={setGoalName} maxLength={100} /><Field label="Цільова сума" value={target} onChangeText={setTarget} keyboardType="decimal-pad" />
      <Field label="Дедлайн (YYYY-MM-DD, необов’язково)" value={deadline} onChangeText={setDeadline} />
      <Button title="Створити ціль" disabled={action.busy || !goalName.trim()} onPress={() => perform(async () => { const result = await api.createGoal({ fundingAccountId: sourceId, name: goalName.trim(), target: parseAmount(target), deadline: parseDeadline(deadline) }); setGoalName(''); setTarget(''); return result; })} /></Panel></>}
    {main.data?.goals.map((goal) => <GoalPanel key={`${goal.id}:${goal.name}:${goal.target}:${goal.deadline}:${goal.mode}:${goal.percentage}:${goal.roundUpStep}`} goal={goal} api={api} perform={perform} busy={action.busy} />)}
    <Panel><Text style={styles.heading}>Тестова покупка</Text>{main.data?.cards.filter((card) => card.status === 'Active').map((card) => <Button key={card.id} title={card.maskedNumber} secondary={cardId !== card.id} onPress={() => setCardId(card.id)} />)}
      <Field label="Сума покупки" value={purchaseAmount} onChangeText={setPurchaseAmount} keyboardType="decimal-pad" /><Button title="Оплатити" disabled={action.busy || !cardId} onPress={() => perform(() => api.purchase(cardId, parseAmount(purchaseAmount)))} />
      <Text style={styles.muted}>Кешбек: {main.data?.cashback.percentage ?? 0}%</Text>{main.data?.cashback.transactions.map((item) => <Text key={item.id} style={styles.text}>{item.kind} · {money(item.amount, item.currency)} · {item.status}</Text>)}
    </Panel>
    <Panel><Text style={styles.heading}>Аналітика</Text><Field label="Від (YYYY-MM-DD)" value={from} onChangeText={setFrom} /><Field label="До (YYYY-MM-DD)" value={through} onChangeText={setThrough} />
      <Button title="Показати період" secondary disabled={action.busy} onPress={() => void action.run(async () => { const start = parseDeadline(from); const end = parseDeadline(through); if (!start || !end || start > end) throw new Error('Вкажи правильний період.'); setPeriod({ from: start, through: end }); })} />
      <Message error={analytics.error} />{analytics.pending && <Loading />}{analytics.data?.currencies.map((item) => <Text key={item.currency} style={styles.text}>
        {item.currency}: баланс {item.availableBalance.toFixed(2)} · заощадження {item.savingsBalance.toFixed(2)} · надходження {item.income.toFixed(2)} · витрати {item.expenses.toFixed(2)} · комісії {item.fees.toFixed(2)} · кешбек {item.cashback.toFixed(2)}
      </Text>)}
    </Panel>
  </Page>;
}
