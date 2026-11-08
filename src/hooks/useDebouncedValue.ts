import { useEffect, useState } from 'react';



function useDebouncedValue<Type>(value: Type, delayInMs: number): Type
{
	const [debouncedValue, setDebouncedValue] = useState<Type>(value);

	useEffect
	(
		() =>
		{
			const timeoutId = setTimeout(() => setDebouncedValue(value), delayInMs);
			return () => clearTimeout(timeoutId);
		},
		[value, delayInMs]
	);

	return debouncedValue;
}



export { useDebouncedValue };