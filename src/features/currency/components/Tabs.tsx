import { Pressable, StyleSheet, Text, View } from 'react-native';



interface Tab { key: string; label: string; }

interface TabsProps
{
	tabs: Tab[];
	activeTab: string;
	
	onTabChange: (key: string) => void;
}



const styles = StyleSheet.create
(
	{
		container:
		{
			marginBottom: 12,
			flexDirection: 'row',
			gap: 8,
			
			borderBottomWidth: 1,
			borderBottomColor: '#b7c7dc'
		},

		tab:
		{
			paddingHorizontal: 16,
			paddingVertical: 10,
		
			borderBottomWidth: 2,
			borderBottomColor: 'transparent'
		},
		tab_active:
		{
			borderBottomColor: '#2363d8'
		},
		
		label:
		{
			color: '#5b6b80',

			fontSize: 14,
			fontWeight: '500'
		},
		label_active:
		{
			color: '#132744'
		}
	}
);


function Tabs({ tabs, activeTab, onTabChange }: TabsProps)
{
	return (
		<View style={styles.container}>
			{
				tabs.map
				(
					(tab) =>
					{
						const active = tab.key === activeTab;

						return (
							<Pressable key={tab.key} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => onTabChange(tab.key)} style={[styles.tab, active && styles.tab_active]}>
								<Text style={[styles.label, active && styles.label_active]}>{tab.label}</Text>
							</Pressable>
						);
					}
				)
			}
		</View>
	);
}



export type { Tab, TabsProps };

export { Tabs };