import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Button, Field, Message, Page, Panel } from '../../../components/ui';

import { useAuth } from '../providers/AuthProvider';
import { IdleTimeoutModal } from '../components/IdleTimeoutModal';

import { decodeJwtPayload, getTokenExpiryMs, isTokenExpired } from '../utils/jwtUtils';

import { storageService, StorageKeys } from '../../../storage';

import { styles } from '../../../components/ui';



interface StorageFlags
{
	access: boolean;
	refresh: boolean;
	userId: boolean;
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
		}
	}
);



function AuthIdleTest()
{
	const auth = useAuth();

	const [storageFlags, setStorageFlags] = useState<StorageFlags>({ access: false, refresh: false, userId: false });
	const [simulated, setSimulated] = useState<number | null>(null);
	const [result, setResult] = useState('');
	const [snapshotJson, setSnapshotJson] = useState<string | null>(null);

	const refreshStorageFlags = useCallback
	(
		async () =>
		{
			const [access, refresh, userId] = await Promise.all
			(
				[
					storageService.getItem<string>(StorageKeys.ACCESS_TOKEN),
					storageService.getItem<string>(StorageKeys.REFRESH_TOKEN),
					storageService.getItem<string>(StorageKeys.SESSION_USER_ID),
				]
			);

			setStorageFlags({ access: Boolean(access), refresh: Boolean(refresh), userId: Boolean(userId) });
		},
		[]
	);

	useEffect(() => { void refreshStorageFlags(); }, [auth.user, refreshStorageFlags]);

	const sessionJson = auth.user ? { user: auth.user, sessionInfo: auth.sessionInfo } : null;

	const handleRefresh = () =>
	{
		if (!auth.user)
		{
			setSnapshotJson(null);
			setResult('Not logged in — nothing to snapshot.');
			return;
		}

		const capturedAt = Date.now();
		const snapshot =
		{
			capturedAt: new Date(capturedAt).toISOString(),
			user: auth.user,
			sessionInfo: auth.sessionInfo,
			expiresAt: auth.expiresAt,
			msUntilExpiry: auth.expiresAt ? auth.expiresAt - capturedAt : null,
		};

		setSnapshotJson(JSON.stringify(snapshot, null, 4));
		setResult('Snapshot captured (session NOT refreshed).');
		void refreshStorageFlags();
	};

	const handleClearTokens = async () =>
	{
		await storageService.clearSensitive();
		await refreshStorageFlags();

		setResult('Sensitive storage cleared.');
	};

	return (
		<Page title="Auth Test">
			<Panel>
				<Text style={styles.heading}>Session</Text>
				
				{
					snapshotJson
					? <Text selectable style={local.code}>{snapshotJson}</Text>
					: sessionJson
						? <Text selectable style={local.code}>{JSON.stringify(sessionJson, null, 4)}</Text>
						: <Text style={styles.text}>Not logged in</Text>
				}
				{!auth.user && <Button title="Sign In" secondary onPress={() => router.push('/auth/sign-in')}/>}

				<View style={styles.row}>
					<Button title="Refresh" secondary onPress={handleRefresh}/>
					{snapshotJson && <Button title="Clear snapshot" secondary onPress={() => { setSnapshotJson(null); setResult('Snapshot cleared (live view).'); }}/>}
				</View>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Storage flags</Text>
				<Text style={styles.text}>ACCESS_TOKEN: {storageFlags.access ? '[TRUE]' : '[FALSE]'}</Text>
				<Text style={styles.text}>REFRESH_TOKEN: {storageFlags.refresh ? '[TRUE]' : '[FALSE]'}</Text>
				<Text style={styles.text}>SESSION_USER_ID: {storageFlags.userId ? '[TRUE]' : '[FALSE]'}</Text>
				
				<Button title="Clear tokens" secondary onPress={() => void handleClearTokens()}/>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Idle modal</Text>
				<View style={styles.row}>
					<Button title="Show (30s)" secondary onPress={() => setSimulated(30)}/>
					<Button title="Show (3s)" secondary onPress={() => setSimulated(3)}/>
				</View>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Result</Text>
				<Message error="" text=""/>
				
				<Text selectable style={local.code}>{result || '(empty)'}</Text>
			</Panel>

			<IdleTimeoutModal isOpen={simulated !== null} secondsLeft={simulated ?? 0} onStay={async () => { setResult("I'm here"); setSimulated(null); }} onLogout={async () => { setResult('Logout'); setSimulated(null); }}/>
		</Page>
	);
}



export { AuthIdleTest };