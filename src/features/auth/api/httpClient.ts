import type { AuthRequestOptions } from '../types.ts';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  constructor(message: string, status: number, code: string | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export type ApiRequestOptions = AuthRequestOptions & { token?: string };
export type ApiRequest = <T>(path: string, options?: ApiRequestOptions) => Promise<T>;

export function createHttpClient(baseUrl: string, fetcher: typeof fetch = fetch): ApiRequest {
  return async <T>(path: string, options: ApiRequestOptions = {}): Promise<T> => {
    // The token must only be sent to this backend, never to an absolute URL.
    if (!path.startsWith('/api/') || path.includes('://') || path.includes('\\')) {
      throw new ApiError('Неправильний шлях API.', 0, 'client.invalid_path');
    }
    const controller = new AbortController();
    const cancel = () => controller.abort();
    if (options.signal?.aborted) cancel();
    options.signal?.addEventListener('abort', cancel, { once: true });
    const timeout = setTimeout(cancel, 25_000);
    try {
      const response = await fetcher(`${baseUrl.replace(/\/$/, '')}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          Accept: 'application/json',
          ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
          ...(options.idempotencyKey ? { 'Idempotency-Key': options.idempotencyKey } : {}),
        },
        ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
        signal: controller.signal,
        cache: 'no-store',
      });
      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const problem = payload !== null && typeof payload === 'object' && !Array.isArray(payload)
          ? payload as Record<string, unknown> : {};
        const validation = problem.errors !== null && typeof problem.errors === 'object' && !Array.isArray(problem.errors)
          ? Object.values(problem.errors).flat().filter((value): value is string => typeof value === 'string' && Boolean(value.trim())).join(' ') : '';
        const detail = typeof problem.detail === 'string' ? problem.detail.trim() : '';
        const title = typeof problem.title === 'string' ? problem.title.trim() : '';
        throw new ApiError(validation || detail || title || 'Запит не виконано.', response.status,
          typeof problem.code === 'string' ? problem.code : null);
      }
      if (response.status === 204) return null as T;
      try { return await response.json() as T; }
      catch { throw new ApiError('API повернув некоректну відповідь.', response.status, 'client.invalid_response'); }
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(controller.signal.aborted ? 'Запит перервано або час очікування вичерпано.' : 'Не вдалося підключитися до API. Перевір з’єднання.', 0);
    } finally {
      clearTimeout(timeout);
      options.signal?.removeEventListener('abort', cancel);
    }
  };
}
