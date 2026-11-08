import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useFormatters, useTranslation } from '../../localization/index';

import { applyBuySpread, applySellSpread } from '../utils/crossRate';



interface CurrencyRateRowProps
{
	code: string;
	rate: number;
	
	onBuyClick: (code: string) => void;
}



const styles = StyleSheet.create
(
	{
		row:
		{
			paddingVertical: 8,

			flexDirection: 'row',
			alignItems: 'center',
			
			borderBottomWidth: 1,
			borderBottomColor: '#e5e7eb'
		},

		code:
		{
			flex: 1,

			color: '#132744',
			
			fontSize: 14,
			fontWeight: '600'
		},
		rate:
		{
			flex: 1,
			textAlign: 'right',

			color: '#263a53',
			
			fontSize: 14
		},

		button:
		{
			width: 88,
			
			marginLeft: 12,
			paddingVertical: 6,
			paddingHorizontal: 10,
			
			alignItems: 'center',

			backgroundColor: '#2363d8',
			
			borderRadius: 6
		},
		button_text:
		{
			color: '#ffffff',

			fontSize: 12,
			fontWeight: '600',
		}
	}
);



function CurrencyRateRow({ code, rate, onBuyClick }: CurrencyRateRowProps)
{
	const { formatRate } = useFormatters();
	const { translate } = useTranslation();

	const buyRate = applyBuySpread(rate);
	const sellRate = applySellSpread(rate);

	return (
		<View style={styles.row}>
			<Text style={styles.code}>{code}</Text>
			<Text style={styles.rate}>{formatRate(buyRate)}</Text>
			<Text style={styles.rate}>{formatRate(sellRate)}</Text>
			<Pressable accessibilityRole="button" onPress={() => onBuyClick(code)} style={styles.button}>
				<Text style={styles.button_text}>{translate('currency.buy')}</Text>
			</Pressable>
		</View>
	);
}



export type { CurrencyRateRowProps };

export { CurrencyRateRow };