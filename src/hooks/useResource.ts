import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';

export function useResource<T>(loader: () => Promise<T>) {
  const generation = useRef(0);
  const [data, setData] = useState<T | null>(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    const current = ++generation.current; setPending(true); setError('');
    try { const result = await loader(); if (current === generation.current) setData(result); }
    catch (failure) { if (current === generation.current) setError(failure instanceof Error ? failure.message : 'Не вдалося завантажити дані.'); }
    finally { if (current === generation.current) setPending(false); }
  }, [loader]);
  useFocusEffect(useCallback(() => { void reload(); return () => { generation.current += 1; }; }, [reload]));
  return { data, pending, error, reload };
}
