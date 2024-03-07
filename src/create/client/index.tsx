import type {
	DeepKeyUnion,
	ImportedLocales,
	Locale,
	LocaleOptions,
} from "../../types";
import { createContext } from "react";
import { createI18nProvider, type LocaleContextType } from "./create-i18n-provider";
import { useLocaleContext } from "./use-locale-contex";
import { getScopedT,getT } from "../../common";

export function createClientI18n<
	Locales extends ImportedLocales,
	FirstLocale extends Locale<Locales[keyof Locales]>,
>(locales: Locales, options: LocaleOptions<Locales>) {
	type ScopedLocale = DeepKeyUnion<FirstLocale>;
	const LocaleContext = createContext<LocaleContextType<Locales> | null>(null);

	const useI18n = () => {
		const { dictionary } = useLocaleContext(LocaleContext);
		return getT<FirstLocale>(dictionary);
	};
	const useScopedI18n = <ScopePath extends ScopedLocale>(scope: ScopePath) => {
		const { dictionary } = useLocaleContext(LocaleContext);
		return getScopedT<FirstLocale, ScopePath>(dictionary, scope);
	};
	const I18nProvider = createI18nProvider({
		locales,
		options,
		I18nContext: LocaleContext,
	});
	const useChangeLocale = () => {
		const { updateLocale } = useLocaleContext(LocaleContext);
		return updateLocale;
	};

	return {
		useI18n,
		useScopedI18n,
		I18nProvider,
		useChangeLocale
	};
}
