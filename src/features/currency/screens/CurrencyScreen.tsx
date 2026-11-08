import { useMemo, useState } from 'react';

import { useToast } from '../../../components/ui/index';

import { useFormatters, useTranslation } from '../../localization/index';

import { currencyRepository } from '../api/currencyRepository';

import { useCurrencyRates } from '../hooks/useCurrencyRates';
import { useUserCurrencies } from '../hooks/useUserCurrencies';

import { applyBuySpread, applySellSpread } from '../utils/crossRate';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Message } from '../../../components/ui';
import { Loader, ConfirmModal } from '../../../components/ui/index';
import { Tabs } from '../components/Tabs';
import { CurrencyRateRow } from '../components/CurrencyRateLow';
import { CrossRateCalculator } from '../components/CrossRateCalculator';

import { styles as uiStyles } from '../../../components/ui/index'



interface TradeRequest
{
	action: 'buy' | 'sell';
	code: string;
	amount: number;
}



const screenStyles = StyleSheet.create
(
	{
		center:
		{
			padding: 40,

			alignItems: 'center',
			justifyContent: 'center'
		},

		error_box:
		{
			padding: 24,

			alignItems: 'center',
			gap: 12
		},
		
		table_header:
		{
			paddingVertical: 8,
			
			flexDirection: 'row',
			alignItems: 'center',
			
			borderBottomWidth: 1,
			borderBottomColor: '#b7c7dc'
		},
		header_cell:
		{
			color: '#5b6b80',

			fontSize: 13,
			fontWeight: '600'
		},

		code:
		{
			flex: 1,
			
			color: '#132744',
			
			fontSize: 14,
			fontWeight: '600',
		},
		rate:
		{
			textAlign: 'right',
			flex: 1,

			color: '#263a53',
			
			fontSize: 14
		},
		action:
		{
			width: 160,

			alignItems: 'flex-end'
		},

		user_row:
		{
			paddingVertical: 8,

			flexDirection: 'row',
			alignItems: 'center',
			
			borderBottomWidth: 1,
			borderBottomColor: '#e5e7eb'
		},
		user_actions:
		{
			flexDirection: 'row',
			justifyContent: 'flex-end',
			gap: 6
		},

		small_button:
		{
			paddingHorizontal: 10,
			paddingVertical: 6,

			borderRadius: 6,
			
			backgroundColor: '#2363d8'
		},

		small_button_text:
		{
			color: '#ffffff',

			fontSize: 12,
			fontWeight: '600'
		},
		add_box:
		{
			marginTop: 16,
			gap: 6
		},
		add_row:
		{
			gap: 8
		},
		add_chip:
		{
			paddingHorizontal: 12,
			paddingVertical: 8,

			borderRadius: 8,
			
			backgroundColor: '#e4ecfa'
		},
		add_chip_text:
		{
			color: '#183963',

			fontSize: 13,
			fontWeight: '600'
		}
	}
);



function CurrencyScreen()
{
	const { data, isLoading, error, refetchRates } = useCurrencyRates('USD');
	const { currencies, addCurrency, removeCurrency } = useUserCurrencies();

	const [tradeRequest, setTradeRequest] = useState<TradeRequest | null>(null);
	const [isTrading, setIsTrading] = useState(false);
	const [activeTab, setActiveTab] = useState<string>('rates');

	const toast = useToast();
	const { translate } = useTranslation();
	const { formatDate, formatAmount } = useFormatters();

	const rates = useMemo<Record<string, number> | null>(() => (data ? { ...data.rates, [data.base]: 1 } : null), [data]);
	const allCurrencies = rates ? Object.keys(rates).sort() : [];

	const handleRowBuyClick = (code: string) => { setTradeRequest({ action: 'buy', code, amount: 1 }); };
	const handleCalculatorBuyClick = (from: string, to: string, amount: number) => { setTradeRequest({ action: 'buy', code: to, amount }); };

	const handleConfirmTrade = async () =>
	{
		if (!tradeRequest) { return; }

		setIsTrading(true);
		try
		{
			const response = tradeRequest.action === 'buy'
				? await currencyRepository.buyCurrency(tradeRequest.code, tradeRequest.amount)
				: await currencyRepository.sellCurrency(tradeRequest.code, tradeRequest.amount);

			if (response.success) { toast.showToast({ type: 'success', title: translate('currency.operationSuccess') }); }
		}
		catch (failure: unknown) { toast.showToast({ type: 'error', title: translate('currency.error'), message: failure instanceof Error ? failure.message : 'Unknown error' }); }
		finally { setIsTrading(false); setTradeRequest(null); }
	};

	if (isLoading)
	{
		return (
			<View style={screenStyles.center}>
				<Loader size="large" label={translate('currency.loading')}/>
			</View>
		);
	}
	if (error)
	{
		return (
			<View style={screenStyles.error_box}>
				<Message error={`${translate('currency.error')}: ${error}`}/>
				<Button title={translate('currency.retry')} onPress={refetchRates}/>
			</View>
		);
	}

	return (
		<>
			{data?.date ? <Text style={uiStyles.muted}>{translate('currency.asOf')}: {formatDate(data.date)}</Text> : null}

			<Tabs
				tabs=
				{
					[
						{ key: 'rates', label: translate('currency.rates') },
						{ key: 'user', label: translate('currency.myList') },
					]
				}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>

			{
				activeTab === 'rates' &&
				<View>
					<View style={screenStyles.table_header}>
						<Text style={[screenStyles.header_cell, screenStyles.code]}>{translate('currency.currency')}</Text>
						<Text style={[screenStyles.header_cell, screenStyles.rate]}>{translate('currency.buy')}</Text>
						<Text style={[screenStyles.header_cell, screenStyles.rate]}>{translate('currency.sell')}</Text>

						<View style={[screenStyles.action]}/>
					</View>
					{ allCurrencies.map((code) => (<CurrencyRateRow key={code} code={code} rate={rates ? rates[code] : 0} onBuyClick={handleRowBuyClick}/>)) }
				</View>
			}

			{
				activeTab === 'user' &&
				<View>
					{
						currencies.length > 0
						?
						<View>
							<View style={screenStyles.table_header}>
								<Text style={[screenStyles.header_cell, screenStyles.code]}>{translate('currency.currency')}</Text>
								<Text style={[screenStyles.header_cell, screenStyles.rate]}>{translate('currency.buy')}</Text>
								<Text style={[screenStyles.header_cell, screenStyles.rate]}>{translate('currency.sell')}</Text>
								
								<View style={[screenStyles.action]}/>
							</View>

							{
								currencies.map
								(
									(currency) =>
									(
										<View key={currency.code} style={screenStyles.user_row}>
											<Text style={screenStyles.code}>{currency.code}</Text>
											<Text style={screenStyles.rate}>{rates && rates[currency.code] ? formatAmount(applyBuySpread(rates[currency.code])) : '-'}</Text>
											<Text style={screenStyles.rate}>{rates && rates[currency.code] ? formatAmount(applySellSpread(rates[currency.code])) : '-'}</Text>
											
											<View style={[screenStyles.action, screenStyles.user_actions]}>
												<Pressable accessibilityRole="button" onPress={() => handleRowBuyClick(currency.code)} style={screenStyles.small_button}>
													<Text style={screenStyles.small_button_text}>{translate('currency.buy')}</Text>
												</Pressable>
												<Pressable accessibilityRole="button" onPress={() => { void removeCurrency(currency.code); }} style={screenStyles.small_button}>
													<Text style={screenStyles.small_button_text}>{translate('currency.remove')}</Text>
												</Pressable>
											</View>
										</View>
									)
								)
							}
						</View>
						:
						<Text style={uiStyles.muted}>Your list is empty. Add a currency below.</Text>
					}

					<View style={screenStyles.add_box}>
						<Text style={uiStyles.muted}>{translate('currency.addCurrency')}</Text>
						<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={screenStyles.add_row}>
							{
								allCurrencies.filter((code) => !currencies.some((currency) => currency.code === code)).map
								(
									(code) =>
									(
										<Pressable key={code} accessibilityRole="button" onPress={() => { void addCurrency(code); }} style={screenStyles.add_chip}>
											<Text style={screenStyles.add_chip_text}>+ {code}</Text>
										</Pressable>
									)
								)
							}
						</ScrollView>
					</View>
				</View>
			}

			<CrossRateCalculator rates={rates} currencies={currencies} onBuyClick={handleCalculatorBuyClick}/>

			<ConfirmModal
				isOpen={tradeRequest !== null}

				onClose={() => { setTradeRequest(null); }}
				onConfirm={handleConfirmTrade}
				
				title={translate('currency.confirmOperation')}
				message={tradeRequest ? `${translate(`currency.${tradeRequest.action}`)} ${formatAmount(tradeRequest.amount)} ${tradeRequest.code}?` : ''}
				
				confirmText={translate('currency.buy')}
				cancelText={translate('currency.cancel')}
				
				variant="primary"
				loading={isTrading}
			/>
		</>
	);
}



export { CurrencyScreen };