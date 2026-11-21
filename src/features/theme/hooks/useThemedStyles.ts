import { useMemo } from 'react';
import { StyleSheet, type ImageStyle, type TextStyle, type ViewStyle, } from 'react-native';

import type { AppTheme } from '../types';
import { useTheme } from './useTheme';



type NamedStyles<Type> = {[Plain in keyof Type]: ViewStyle | TextStyle | ImageStyle;};



function useThemedStyles<Type extends NamedStyles<Type>>(factory: (theme: AppTheme) => Type): Type {
	const { theme } = useTheme();

	return useMemo(() => StyleSheet.create(factory(theme)), [theme, factory]);
}



export { useThemedStyles };