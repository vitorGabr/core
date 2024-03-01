import 'client-only';

import type {
	ImportedLocales,
	Locale,
	LocaleOptions,
} from "../../types";

import { createI18nProvider } from "./create-i18n-provider";
import { createContext } from "react";
import type { LocaleContextType } from "./create-i18n-provider";
import { useLocaleContext } from "./use-locale-contex";
import { createScopedT, createT } from "./create-client-i18n";

export const createClientI18n = <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleOptions<Locales>,
) => {
	const firstLocale = Object.keys(locales)[0] as keyof Locales;
	type FirstLocale = Locale<Locales[typeof firstLocale]>;
	const LocaleContext = createContext<LocaleContextType<Locales> | null>(null);

	const useI18n = createT<Locales,FirstLocale>(LocaleContext);
	const useScopedI18n = createScopedT<Locales,FirstLocale>(LocaleContext);
	const createProvider = createI18nProvider({
		locales,
		options,
		I18nContext: LocaleContext,
	});

	return {
		Provider: createProvider,
		useI18n,
		useScopedI18n,
		useChangeLocale: () => {
			const { updateLocale } = useLocaleContext(LocaleContext);
			return updateLocale;
		},
		useGetLocale: () => {
			const { locale } = useLocaleContext(LocaleContext);
			return locale;
		},
	};
};
