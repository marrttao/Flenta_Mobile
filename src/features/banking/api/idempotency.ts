import type { AuthRequest } from '../../auth/types.ts';

// Same payload and endpoint retain their key until a definitive response arrives.
export function createIdempotentRequest(request: AuthRequest, newKey: () => string) {
  const pending = new Map<string, { key: string; promise?: Promise<unknown> }>();
  return async <T>(path: string, body: unknown): Promise<T> => {
    const fingerprint = JSON.stringify([path, body]);
    let operation = pending.get(fingerprint);
    if (!operation) { operation = { key: newKey() }; pending.set(fingerprint, operation); }
    if (operation.promise) return operation.promise as Promise<T>;
    const current = operation;
    const promise = request<T>(path, { method: 'POST', body, idempotencyKey: current.key })
      .then((result) => { pending.delete(fingerprint); return result; })
      .finally(() => { current.promise = undefined; });
    current.promise = promise;
    return promise;
  };
}
