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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [secondsLeft, setSecondsLeft] = useState(0);

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
			setIsModalOpen(false);
			setSecondsLeft(0);

			clearOpenTimer();
			clearCountdown();

			if (!expiresAt) { return; }

			const showAt = expiresAt - msBeforeExpiry;
			const delayToShow = Math.max(0, showAt - Date.now());

			const startCountdown = () =>
			{
				setIsModalOpen(true);

				const update = () =>
				{
					const remaining = expiresAt - Date.now();
					const next = Math.max(0, Math.ceil(remaining / 1_000));

					setSecondsLeft(next);

					if (next <= 0)
					{
						clearCountdown();
						setIsModalOpen(false);

						void onLogoutRef.current();
					}
				};

				update();
				countdownRef.current = setInterval(update, 1_000);
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
			setIsModalOpen(false);
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
			setIsModalOpen(false);
			clearOpenTimer();
			clearCountdown();

			try { await onLogoutRef.current(); }
			catch {}
		},
		[clearOpenTimer, clearCountdown]
	);

	return { isModalOpen, secondsLeft, stayHere, logoutNow };
}



export type { UseIdleTimeoutOptions, UseIdleTimeoutResult };

export { useIdleTimeout };