import { useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';

import type { FrankfurterLatestResponse } from '../types';

import { fetchLatestRates } from '../api/frankfurterApi';

import { Button, Message, Page, Panel } from '../../../components/ui/index';

import { styles } from '../../../components/ui/index';



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



function CurrencyApiTest()
{
	const [data, setData] = useState<FrankfurterLatestResponse | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const handleLoad = async () =>
	{
		setIsLoading(true);
		setError(null);

		try { setData(await fetchLatestRates('USD')); }
		catch (failure: unknown) { setError(failure instanceof Error ? failure : new Error('Unknown error')); }
		finally { setIsLoading(false); }
	};

	return (
		<Page title="Frankfurter API Test">
			<Panel>
				<Button title={isLoading ? 'Loading...' : 'Load Latest Rates'} disabled={isLoading} onPress={handleLoad}/>
				{error ? <Message error={error.message}/> : null}
				{data ? <Text selectable style={local.code}>{JSON.stringify(data, null, 2)}</Text> : <Text style={styles.muted}>(no data)</Text>}
			</Panel>
		</Page>
	);
}



export { CurrencyApiTest };