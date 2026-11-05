import { normalizeIncomingPath } from '../features/auth/utils/callback';
export function redirectSystemPath({ path }: { path: string; initial: boolean }) { return normalizeIncomingPath(path); }
