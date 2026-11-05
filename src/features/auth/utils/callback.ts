export function normalizeIncomingPath(path: string): string {
  try {
    if (path.startsWith('/')) return path;
    const url = new URL(path);
    if (url.protocol !== 'flenta-mobile:' || url.hostname !== 'app' || url.username || url.password || url.port) return '/';
    if (!['/auth/confirm-email', '/auth/reset-password'].includes(url.pathname)) return '/';
    return `${url.pathname}${url.search}`;
  } catch { return '/'; }
}

export function readCallbackCode(params: { code?: string | string[]; error?: string | string[]; error_description?: string | string[] }) {
  if (params.error || params.error_description) throw new Error('Посилання недійсне або прострочене. Запроси новий лист.');
  if (typeof params.code !== 'string' || !params.code.trim() || params.code.length > 4096) throw new Error('У посиланні немає коду підтвердження.');
  return params.code;
}
