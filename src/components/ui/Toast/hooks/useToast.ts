import { useContext } from 'react';

import type { ToastContextValue } from '../providers/ToastProvider';

import { ToastContext } from '../providers/ToastProvider';



function useToast(): ToastContextValue
{
	const context = useContext(ToastContext);

	if (!context) { throw new Error('useToast must be used within a ToastProvider'); }
	
	return context;
}



export { useToast };