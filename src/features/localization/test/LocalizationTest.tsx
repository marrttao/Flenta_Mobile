import { Text } from 'react-native';

import { DEFAULT_LANGUAGE } from '../utils/languages';

import { useFormatters } from '../hooks/useFormatters';
import { useTranslation } from '../hooks/useTranslation';

import { Button, Page, Panel } from '../../../components/ui';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

import { styles } from '../../../components/ui'



function LocalizationTest()
{
	const { language, setLanguage, translate } = useTranslation();
	const { formatAmount, formatDate, locale } = useFormatters();

	const sampleDate = new Date(1999, 10, 15);

	return (
		<Page title="Localization Test">
			<Panel>
				<Text style={styles.heading}>Language</Text>
				<Text style={styles.text}>Current: {language} (locale: {locale})</Text>

				<LanguageSwitcher/>
				<Button title="Reset to default" secondary onPress={() => setLanguage(DEFAULT_LANGUAGE)}/>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Translation</Text>
				<Text style={styles.text}>testMessage: {translate('testMessage')}</Text>
				<Text style={styles.text}>common.close: {translate('common.close')}</Text>
				<Text style={styles.text}>non-existent key: {translate('non-existent.key')}</Text>
			</Panel>

			<Panel>
				<Text style={styles.heading}>Formatters</Text>
				<Text style={styles.text}>formatAmount(1234.56): {formatAmount(1234.56)}</Text>
				<Text style={styles.text}>formatDate(15.10.1999): {formatDate(sampleDate)}</Text>
			</Panel>
		</Page>
	);
}



export { LocalizationTest };