import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Field, Panel, styles } from '../../../components/ui';
import { money, parseAmount } from '../../banking/utils/money';
import type { Goal, GoalSettings } from '../types';
import type { createFinanceApi } from '../api/financeApi';
import { parseDeadline } from '../utils/date';

export function GoalPanel({ goal, api, perform, busy }: { goal: Goal; api: ReturnType<typeof createFinanceApi>; perform: (work: () => Promise<unknown>) => void; busy: boolean }) {
  const [name, setName] = useState(goal.name); const [target, setTarget] = useState(String(goal.target));
  const [deadline, setDeadline] = useState(goal.deadline ?? ''); const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<GoalSettings['mode']>(goal.mode); const [percentage, setPercentage] = useState(String(goal.percentage));
  const [step, setStep] = useState(String(goal.roundUpStep));
  return <Panel><Text style={styles.heading}>{goal.name}{goal.archived ? ' · Архів' : ''}</Text><Text style={styles.text}>{money(goal.balance, goal.currency)} / {money(goal.target, goal.currency)} · {goal.progressPercent}%</Text>
    {!goal.archived && <><Field label="Сума внеску / зняття" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
      <View style={styles.row}><Button title="Поповнити" disabled={busy} onPress={() => perform(() => api.moveGoal(goal.id, false, parseAmount(amount)))} /><Button title="Зняти" secondary disabled={busy} onPress={() => perform(() => api.moveGoal(goal.id, true, parseAmount(amount)))} /></View>
      <Field label="Назва цілі" value={name} onChangeText={setName} maxLength={100} /><Field label="Цільова сума" value={target} onChangeText={setTarget} keyboardType="decimal-pad" />
      <Field label="Дедлайн (YYYY-MM-DD, необов’язково)" value={deadline} onChangeText={setDeadline} />
      <Text style={styles.muted}>Автоматичне накопичення з покупок</Text><View style={styles.row}>{(['Off', 'Percentage', 'RoundUp'] as const).map((value) => <Button key={value} title={{ Off: 'Вимкнено', Percentage: 'Відсоток', RoundUp: 'Округлення' }[value]} secondary={mode !== value} onPress={() => setMode(value)} />)}</View>
      {mode === 'Percentage' && <Field label="Відсоток" value={percentage} onChangeText={setPercentage} keyboardType="decimal-pad" />}
      {mode === 'RoundUp' && <Field label="Крок округлення" value={step} onChangeText={setStep} keyboardType="number-pad" />}
      <Button title="Зберегти налаштування цілі" secondary disabled={busy || !name.trim()} onPress={() => perform(() => api.updateGoal(goal.id, {
        name: name.trim(), target: parseAmount(target), deadline: parseDeadline(deadline), mode,
        percentage: mode === 'Percentage' ? parseAmount(percentage) : 0, roundUpStep: mode === 'RoundUp' ? parseAmount(step) : goal.roundUpStep,
      }))} />
      <Button title="Архівувати порожню ціль" secondary disabled={busy || goal.balance !== 0} onPress={() => perform(() => api.archiveGoal(goal.id))} /></>}
  </Panel>;
}
