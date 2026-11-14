import { useAuth } from '../providers/AuthProvider';
import { useIdleTimeout } from '../hooks/useIdleTimeout';
import { IdleTimeoutModal } from './IdleTimeoutModal';



function IdleTimeoutHost()
{
	const auth = useAuth();

	const idle = useIdleTimeout
	(
		{
			expiresAt: auth.expiresAt,
			msBeforeExpiry: 30_000,
			onRefresh: auth.refreshSession,
	
			onLogout: auth.logout,
		}
	);

	return (
		<IdleTimeoutModal isOpen={idle.isModalOpen} secondsLeft={idle.secondsLeft} onStay={idle.stayHere} onLogout={idle.logoutNow}/>
	);
}

export { IdleTimeoutHost };