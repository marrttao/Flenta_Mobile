import { Page } from '../components/ui/index';

import { useTranslation } from '../features/localization';

import { CurrencyScreen } from '../features/currency/index';



export default function CurrencyRoute()
{
	const { translate } = useTranslation();

	return (
		<Page title={translate('currency.title')}>
			<CurrencyScreen/>
		</Page>
	);
}