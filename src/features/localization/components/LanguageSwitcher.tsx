import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { useTranslation } from '../hooks/useTranslation';

import { LANGUAGES } from '../utils/languages';



const styles = StyleSheet.create
(
	{
		row:
		{
			gap: 8,
			paddingVertical: 8
		},
		chip:
		{
			paddingHorizontal: 14,
			paddingVertical: 8,
			borderRadius: 999,
			borderWidth: 1,
			borderColor: '#b7c7dc',
			backgroundColor: '#ffffff',
		},
		chip_active:
		{
			backgroundColor: '#2363d8',
			borderColor: '#2363d8',
		},
		label:
		{
			fontSize: 14,
			fontWeight: '600',
			color: '#183963',
		},
		label_active:
		{
			color: '#ffffff',
		}
	}
);



function LanguageSwitcher()
{
	const { language, setLanguage } = useTranslation();

	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
			{
				LANGUAGES.map
				(
					(_language) =>
					{
						const active = _language.reduction === language;

						return (
							<Pressable key={_language.reduction} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => setLanguage(_language.reduction)} style={[styles.chip, active && styles.chip_active]}>
								<Text style={[styles.label, active && styles.label_active]}>{_language.nativeName}</Text>
							</Pressable>
						);
					}
				)
			}
		</ScrollView>
	);
}



export { LanguageSwitcher };