import { useEffect, useState } from 'react';



interface TokenExpiryResult
{
	expiresAt: number | null;
	msUntilExpiry: number | null;
}



function useTokenExpiry(expiresAt: number | null): TokenExpiryResult
{
	const [msUntilExpiry, setMsUntilExpiry] = useState<number | null>(null);

	useEffect
	(
		() =>
		{
			if (!expiresAt) { setMsUntilExpiry(null); return; }

			let intervalId: ReturnType<typeof setInterval> | null = null;

			const tick = () =>
			{
				const remaining = expiresAt - Date.now();
				setMsUntilExpiry(remaining);

				if (remaining < -60_000 && intervalId !== null) { clearInterval(intervalId); intervalId = null; }
			};

			tick();
			intervalId = setInterval(tick, 1_000);

			return () => { if (intervalId !== null) { clearInterval(intervalId); } };
		},
		[expiresAt]
	);

	return { expiresAt, msUntilExpiry };
}



export type { TokenExpiryResult };

export { useTokenExpiry };