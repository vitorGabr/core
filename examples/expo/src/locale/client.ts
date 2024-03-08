import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClientI18n } from 'lingo-ts';

export const { useI18n, I18nProvider,useChangeLocale } = createClientI18n({
    'pt-br': () => import('./pt-br'),
    en: () => import('./en'),
}, { defaultLocale: 'pt-br',
    persistentLocale:{
        get: () => AsyncStorage.getItem('locale'),
        set: (locale) => AsyncStorage.setItem('locale', locale),
    }
})