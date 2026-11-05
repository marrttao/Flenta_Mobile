import { Text, View } from 'react-native';
import { Button, styles } from '../../../components/ui';
import type { Account } from '../types';
import { money } from '../utils/money';

export function AccountPicker({ label, accounts, value, onChange }: { label: string; accounts: Account[]; value: string; onChange: (id: string) => void }) {
  return <View style={{ gap: 8 }}><Text style={styles.muted}>{label}</Text>{accounts.length === 0 && <Text style={styles.muted}>Немає доступних рахунків.</Text>}
    {accounts.map((account) => <Button key={account.id} secondary={value !== account.id}
      title={`${account.currency} • ${account.iban.slice(-8)} • ${money(account.balance, account.currency)}`} onPress={() => onChange(account.id)} />)}</View>;
}
