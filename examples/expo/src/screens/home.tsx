import { Button, Text, View } from "react-native";
import { useChangeLocale, useI18n } from "../locale/client";

export function Home() {
    const t = useI18n();
    const changeLocale = useChangeLocale();
	return (
		<View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            
            }}
        >
			<Text>{t('hello')}</Text>
            <Button title="Change to English" onPress={() => changeLocale('en')} />
		</View>
	);
}
