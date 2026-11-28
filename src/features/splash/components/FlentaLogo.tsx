import type { ComponentType } from 'react';
import type { SvgProps } from 'react-native-svg';

import { useTheme } from '../../theme/hooks/useTheme';

import LogoLight from '../../../../assets/images/logo/logo-light.svg';
import LogoDark from '../../../../assets/images/logo/logo-dark.svg';



interface FlentaLogoProps extends Omit<SvgProps, 'width' | 'height'>
{
	width?: number;
	height?: number;
}



function FlentaLogo({ width = 220, height = 64, ...rest }: FlentaLogoProps)
{
	const { scheme } = useTheme();

	const Logo: ComponentType<SvgProps> = scheme === 'dark' ? LogoDark : LogoLight;

	return <Logo width={width} height={height} {...rest} />;
}



export { FlentaLogo };