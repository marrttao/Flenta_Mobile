import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useFormatters, useTranslation } from '../../localization/index';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { BasicModal } from '../../../components/ui/index';

import { useCrossRate } from '../hooks/useCrossRate';

import type { UserCurrency } from '../../../typification';



interface CrossRateCalculatorProps
{
	rates: Record<string, number> | null;
	currencies: UserCurrency[];
	
	onBuyClick: (from: string, to: string, amount: number) => void;
}



const styles = StyleSheet.create
(
	{
		container:
		{
			marginTop: 12,
			padding: 16,
			gap: 12,

			backgroundColor: '#ffffff',

			borderRadius: 12,
			borderWidth: 1,
			borderColor: '#dde5f0'
		},

		title:
		{
			color: '#132744',

			fontSize: 16,
			fontWeight: '600'
		},

		row:
		{
			flexDirection: 'row',
			flexWrap: 'wrap',
			alignItems: 'center',
			gap: 8
		},

		amount_input:
		{
			width: 120,
			
			paddingHorizontal: 12,
			paddingVertical: 10,
			
			color: '#132744',
			backgroundColor: '#f4f7fc',
			
			fontSize: 15,
			
			borderWidth: 1,
			borderColor: '#b7c7dc',
			borderRadius: 8
		},

		chip:
		{
			paddingHorizontal: 12,
			paddingVertical: 8,

			backgroundColor: '#ffffff',

			borderRadius: 8,
			borderWidth: 1,
			borderColor: '#b7c7dc'
		},
		chip_text:
		{
			color: '#183963',

			fontSize: 14,
			fontWeight: '600'
		},

		swap_button:
		{
			width: 36,
			height: 36,

			alignItems: 'center',
			justifyContent: 'center',

			backgroundColor: '#ffffff',
			
			borderRadius: 8,
			borderWidth: 1,
			borderColor: '#b7c7dc'
		},
		swap_text:
		{
			color: '#183963',
			fontSize: 16
		},

		result:
		{
			marginLeft: 'auto',

			color: '#132744',
			
			fontSize: 18,
			fontWeight: '700'
		},
		hint:
		{
			color: '#5b6b80',
			fontSize: 13
		},

		buy_button:
		{
			marginTop: 4,
			paddingHorizontal: 16,
			paddingVertical: 10,
			
			alignSelf: 'flex-start',

			backgroundColor: '#2363d8',
			
			borderRadius: 8,
		},
		buy_button_disabled:
		{
			opacity: 0.5
		},
		buy_button_text:
		{
			color: '#ffffff',

			fontSize: 14,
			fontWeight: '600'
		},

		picker_list:
		{
			maxHeight: 360
		},
		picker_row:
		{
			paddingVertical: 12,

			borderBottomWidth: 1,
			borderBottomColor: '#e5e7eb'
		},
		picker_text:
		{
			color: '#132744',
			fontSize: 15
		}
	}
);



function CrossRateCalculator({ rates, currencies, onBuyClick }: CrossRateCalculatorProps)
{
	const [amountText, setAmountText] = useState('100');
	const [from, setFrom] = useState('USD');
	const [to, setTo] = useState('EUR');
	const [picker, setPicker] = useState<'from' | 'to' | null>(null);

	const amount = useMemo
	(
		() =>
		{
			const parsed = parseFloat(amountText.replace(',', '.'));
			return Number.isFinite(parsed) ? parsed : 0;
		},
		[amountText]
	);

	const debouncedAmount = useDebouncedValue(amount, 250);

	const { formatAmount } = useFormatters();
	const { translate } = useTranslation();

	const result = useCrossRate(debouncedAmount, from, to, rates);
	const currencyOptions = currencies.length > 0 ? currencies.map((currency) => currency.code) : (rates ? Object.keys(rates) : []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{translate('currency.calculator')}</Text>

			<View style={styles.row}>
				<TextInput style={styles.amount_input} value={amountText} onChangeText={setAmountText} keyboardType="decimal-pad" accessibilityLabel={translate('currency.amount')}/>
				<Pressable accessibilityRole="button" onPress={() => setPicker('from')} style={styles.chip}>
					<Text style={styles.chip_text}>{from}</Text>
				</Pressable>
				<Pressable accessibilityRole="button" accessibilityLabel="Swap currencies" onPress={() => { setFrom(to); setTo(from); }} style={styles.swap_button}>
					<Text style={styles.swap_text}>&#x21C4;</Text>
				</Pressable>
				<Pressable accessibilityRole="button" onPress={() => setPicker('to')} style={styles.chip}>
					<Text style={styles.chip_text}>{to}</Text>
				</Pressable>

				<Text style={styles.result}>{result !== null ? formatAmount(result) : '-'}</Text>
			</View>

			<Text style={styles.hint}>{translate('currency.amount')}: {formatAmount(amount)} {from} → {result !== null ? formatAmount(result) : '-'} {to}</Text>

			<Pressable
				accessibilityRole="button"
				accessibilityState={{ disabled: result === null || !Number.isFinite(amount) || amount <= 0 || amount !== debouncedAmount }}
				disabled={result === null || !Number.isFinite(amount) || amount <= 0 || amount !== debouncedAmount}
				onPress={() => onBuyClick(from, to, amount)}
				style={[styles.buy_button, (result === null || amount <= 0) && styles.buy_button_disabled]}
			>
				<Text style={styles.buy_button_text}>{translate('currency.buy')}</Text>
			</Pressable>

			<BasicModal isOpen={picker !== null} title={translate('currency.currency')} onClose={() => setPicker(null)} size="small">
				<ScrollView style={styles.picker_list} keyboardShouldPersistTaps="handled">
					{
						currencyOptions.map
						(
							(code) =>
							(
								<Pressable key={code} accessibilityRole="button" onPress={() => { if (picker === 'from') { setFrom(code); } else if (picker === 'to') { setTo(code); } setPicker(null); }} style={styles.picker_row}>
									<Text style={styles.picker_text}>{code}</Text>
								</Pressable>
							)
						)
					}
				</ScrollView>
			</BasicModal>
		</View>
	);
}



export type { CrossRateCalculatorProps };

export { CrossRateCalculator };