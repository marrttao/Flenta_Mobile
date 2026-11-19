import { useEffect, useState } from 'react';



interface TokenExpiryResult
{
	expiresAt: number | null;
	msUntilExpiry: number | null;
}



function useTokenExpiry(expiresAt: number | null): TokenExpiryResult
{
	const [sample, setSample] = useState<{ deadline: number | null; remaining: number | null }>({ deadline: null, remaining: null });

	useEffect
	(
		() =>
		{
			if (expiresAt === null || !Number.isFinite(expiresAt)) { return; }

			let intervalId: ReturnType<typeof setInterval> | null = null;

			const tick = () =>
			{
				const remaining = expiresAt - Date.now();
				setSample({ deadline: expiresAt, remaining });

				if (remaining < -60_000 && intervalId !== null) { clearInterval(intervalId); intervalId = null; }
			};

			const initialTick = setTimeout(tick, 0);
			intervalId = setInterval(tick, 1_000);

			return () => { clearTimeout(initialTick); if (intervalId !== null) { clearInterval(intervalId); } };
		},
		[expiresAt]
	);

	return { expiresAt, msUntilExpiry: sample.deadline === expiresAt ? sample.remaining : null };
}



export type { TokenExpiryResult };

export { useTokenExpiry };