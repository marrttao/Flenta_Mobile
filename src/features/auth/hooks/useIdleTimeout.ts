import { useCallback, useEffect, useState, useRef } from 'react';



interface UseIdleTimeoutOptions
{
	expiresAt: number | null;
	msBeforeExpiry?: number;

	onRefresh: () => Promise<void> | void;
	onLogout: () => Promise<void> | void;
}

interface UseIdleTimeoutResult
{
	isModalOpen: boolean;
	secondsLeft: number;

	stayHere: () => Promise<void>;
	logoutNow: () => Promise<void>;
}



const DEFAULT_MS_BEFORE_EXPIRY = 30_000;



function useIdleTimeout({ expiresAt, msBeforeExpiry = DEFAULT_MS_BEFORE_EXPIRY, onRefresh, onLogout }: UseIdleTimeoutOptions): UseIdleTimeoutResult
{
	const [openedFor, setOpenedFor] = useState<number | null>(null);
	const [secondsLeft, setSecondsLeft] = useState(0);
	const isModalOpen = expiresAt !== null && openedFor === expiresAt;

	const onRefreshRef = useRef(onRefresh);
	const onLogoutRef = useRef(onLogout);

	const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => { onRefreshRef.current = onRefresh; }, [onRefresh]);
	useEffect(() => { onLogoutRef.current = onLogout; }, [onLogout]);

	const clearOpenTimer = useCallback(() => {if (openTimerRef.current != null) { clearTimeout(openTimerRef.current); openTimerRef.current = null; } }, []);
	const clearCountdown = useCallback(() => { if (countdownRef.current != null) { clearInterval(countdownRef.current); countdownRef.current = null; } }, []);

	useEffect
	(
		() =>
		{
			clearOpenTimer();
			clearCountdown();

			if (expiresAt === null || !Number.isFinite(expiresAt)) { return; }

			const showAt = expiresAt - msBeforeExpiry;
			const delayToShow = Math.max(0, showAt - Date.now());

			const startCountdown = () =>
			{
				setOpenedFor(expiresAt);

				const update = () =>
				{
					const remaining = expiresAt - Date.now();
					const next = Math.max(0, Math.ceil(remaining / 1_000));

					setSecondsLeft(next);

					if (next <= 0)
					{
						clearCountdown();
						setOpenedFor(null);

						void Promise.resolve().then(() => onLogoutRef.current()).catch(() => {});
						return false;
					}
					return true;
				};

				if (update()) { countdownRef.current = setInterval(update, 1_000); }
			};

			openTimerRef.current = setTimeout(startCountdown, delayToShow);

			return () =>
			{
				clearOpenTimer();
				clearCountdown();
			};
		},
		[expiresAt, msBeforeExpiry, clearOpenTimer, clearCountdown]
	);

	const stayHere = useCallback
	(
		async () =>
		{
			setOpenedFor(null);
			clearOpenTimer();
			clearCountdown();

			try { await onRefreshRef.current(); }
			catch { await onLogoutRef.current(); }
		},
		[clearOpenTimer, clearCountdown]
	);

	const logoutNow = useCallback
	(
		async () =>
		{
			setOpenedFor(null);
			clearOpenTimer();
			clearCountdown();

			try { await onLogoutRef.current(); }
			catch {}
		},
		[clearOpenTimer, clearCountdown]
	);

	return { isModalOpen, secondsLeft: isModalOpen ? secondsLeft : 0, stayHere, logoutNow };
}



export type { UseIdleTimeoutOptions, UseIdleTimeoutResult };

export { useIdleTimeout };