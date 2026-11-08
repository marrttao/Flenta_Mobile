import { useCallback, useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { StorageKeys } from "../keys";

import { useAction } from "../../components/ui";

import { storageService } from "../services/storage-service";

import { isSensitiveKey } from "../utils/policy";

import { Button, Message, Page, Panel } from '../../components/ui';

import { styles as uiStyles } from '../../components/ui';



const ALL_KEYS = Object.values(StorageKeys) as StorageKeys[];



function StorageTest()
{
	const action = useAction();

	const [key, setKey] = useState<StorageKeys>(ALL_KEYS[0]);
	const [value, setValue] = useState<string>('"dark"');
	const [values, setValues] = useState<Record<string, string>>({});
	const [result, setResult] = useState<string>('');

	const reload = useCallback
	(
		async () =>
		{
			const next: Record<string, string> = {};
			for (const entry of ALL_KEYS)
			{
				const parsed = await storageService.getItem<unknown>(entry);
				next[entry] = parsed === null ? '<null>' : JSON.stringify(parsed);
			}
			setValues(next);
		},
		[]
	);

	useEffect(() => { void reload(); }, [reload]);

	const handleGet = () => void action.run
	(
		async () =>
		{
			const parsed = await storageService.getItem<unknown>(key);
			setResult(`Get: ${key} = ${JSON.stringify(parsed)}`);
		}
	);
	const handleSet = () =>
	{
		let parsed: unknown;
		try { parsed = JSON.parse(value); }
		catch (error)
		{
			setResult(`Invalid JSON: ${value} (${String(error)})`);
			return;
		}

		void action.run
		(
			async () =>
			{
				await storageService.setItem(key, parsed);
				setResult(`Set: ${key} = ${JSON.stringify(parsed)}`);
				await reload();
			}
		);
	};
	const handleRemove = () => void action.run
	(
		async () =>
		{
			await storageService.removeItem(key);
			setResult(`Removed: ${key}`);
			await reload();
		}
	);

	const handleClearSensitive = () => void action.run
	(
		async () =>
		{
			await storageService.clearSensitive();
			setResult('Sensitive keys cleared (SecureStore).');
			await reload();
		}
	);

	const handleClearNonSensitive = () => void action.run
	(
		async () =>
		{
			await storageService.clearNonSensitive();
			setResult('Non-sensitive keys cleared (AsyncStorage).');
			await reload();
		}
	);
	const handleClearAll = () =>
	{
		Alert.alert
		(
			'Clear all storage?',
			'This will delete all keys from SecureStore and AsyncStorage. This action cannot be undone!',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Clear',
					style: 'destructive',
					onPress: () => void action.run
					(
						async () =>
						{
							await storageService.clearAll();
							setResult('All keys cleared.');
							await reload();
						}
					),
				},
			]
		);
	};

	return (
		<Page title="Storage Test">
			<Panel>
				<Text style={uiStyles.heading}>Set / Get / Remove</Text>

				<Text style={uiStyles.muted}>Key</Text>
				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={local.chips}>
					{
						ALL_KEYS.map
						(
							(entry) =>
							{
								const active = entry === key;
								
								return (
									<Pressable key={entry} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => setKey(entry)} style={[local.chip, active && local.chip_active]}>
										<Text style={[local.chip_text, active && local.chip_text_active]}>
											{entry} ({isSensitiveKey(entry) ? 'Secure' : 'Async'})
										</Text>
									</Pressable>
								);
							}
						)
					}
				</ScrollView>

				<Text style={uiStyles.muted}>Value (JSON)</Text>
				<TextInput value={value} onChangeText={setValue} style={uiStyles.input} placeholder='JSON value' autoCapitalize="none" autoCorrect={false}/>

				<View style={uiStyles.row}>
					<Button title="Set" disabled={action.busy} onPress={handleSet}/>
					<Button title="Get" secondary disabled={action.busy} onPress={handleGet}/>
					<Button title="Remove" secondary disabled={action.busy} onPress={handleRemove}/>
				</View>
			</Panel>

			<Panel>
				<Text style={uiStyles.heading}>Clear</Text>
				<Button title="Clear Sensitive (SecureStore)" secondary disabled={action.busy} onPress={handleClearSensitive}/>
				<Button title="Clear Non-Sensitive (AsyncStorage)" secondary disabled={action.busy} onPress={handleClearNonSensitive}/>
				<Button title="Clear All" secondary disabled={action.busy} onPress={handleClearAll}/>
			</Panel>

			<Panel>
				<Text style={uiStyles.heading}>Values</Text>
				{
					ALL_KEYS.map
					(
						(entry) =>
						(
							<View key={entry} style={{ gap: 2 }}>
								<Text style={uiStyles.text}>{entry} · {isSensitiveKey(entry) ? 'SecureStore' : 'AsyncStorage'}</Text>
								<Text selectable style={local.code}>{values[entry] ?? '<null>'}</Text>
							</View>
						)
					)
				}
			</Panel>

			<Panel>
				<Text style={uiStyles.heading}>Result</Text>
				<Message error={action.error} text={action.message}/>
				<Text selectable style={local.code}>{result || '(empty)'}</Text>
			</Panel>
		</Page>
	);
}



const local = StyleSheet.create
(
	{
		chips:
		{
			paddingVertical: 4,
			gap: 8,
		},
		chip:
		{
			paddingHorizontal: 12,
			paddingVertical: 8,

			backgroundColor: '#ffffff',
			
			borderWidth: 1,
			borderRadius: 8,
			borderColor: '#b7c7dc',
		},
		chip_active:
		{
			backgroundColor: '#2363d8',
			borderColor: '#2363d8',
		},
		chip_text:
		{
			color: '#183963',

			fontSize: 12,
			fontWeight: '600',
		},
		chip_text_active:
		{
			color: '#ffffff',
		},
		
		code:
		{
			color: '#263a53',

			fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
			fontSize: 12,
			lineHeight: 18,
		},
	}
);



export { StorageTest };