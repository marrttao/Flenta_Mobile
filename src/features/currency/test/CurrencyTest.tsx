import { useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';


import { currencyRepository } from '../api/currencyRepository';
import { useCurrencyRates } from '../hooks/useCurrencyRates';

import { Button, Message, Page, Panel } from '../../../components/ui/index';
import { CurrencyScreen } from '../screens/CurrencyScreen';

import { styles } from '../../../components/ui/index';



interface RepositoryResult
{
	success: boolean;
	message?: string;
}



const local = StyleSheet.create
(
	{
		code:
		{
			color: '#263a53',

			fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
			fontSize: 12,
			lineHeight: 18
		},
	}
);



function CurrencyTest()
{
	const [result, setResult] = useState<RepositoryResult | null>(null);
	const [busy, setBusy] = useState(false);

	const rates = useCurrencyRates('USD');

	const handleBuy = async () =>
	{
		setBusy(true);

		try { setResult(await currencyRepository.buyCurrency('EUR', 100)); }
		catch (failure: unknown) { setResult({ success: false, message: failure instanceof Error ? failure.message : 'Unknown error' }); }
		finally { setBusy(false); }
	};

	return (
		<Page title="Currency Test">
			<Panel>
				<Text style={styles.heading}>Repository</Text>
				<Button title="Buy 100 EUR" disabled={busy} onPress={handleBuy}/>
				<Text selectable style={local.code}>{result ? JSON.stringify(result, null, 2) : '(empty)'}</Text>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Hook</Text>
				<Text style={styles.text}>isLoading: {String(rates.isLoading)}</Text>
				<Text style={styles.text}>error: {rates.error ?? '-'}</Text>
				<Button title="Refetch" secondary onPress={rates.refetchRates}/>
				<Text selectable style={local.code}>{JSON.stringify(rates.data, null, 2)}</Text>
				{rates.error ? <Message error={rates.error}/> : null}
			</Panel>

			<Panel>
				<Text style={styles.heading}>UI</Text>
				<CurrencyScreen/>
			</Panel>
		</Page>
	);
}



export { CurrencyTest };