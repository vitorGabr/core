import type {
	DeepKeyUnion,
	ImportedLocales,
	Locale,
	LocaleOptions,
} from "../types";
import { createT, createScopedT } from "./create-i18n";
import { getContentLocale } from "./get-content-locale";

export function server<
	Locales extends ImportedLocales,
	FirstLocale extends Locale<Locales[keyof Locales]>,
>(locales: Locales, options: LocaleOptions<Locales>) {

	const localeOptions = {
		...options,
		locale: null,
	} as LocaleOptions<Locales> & { locale: keyof Locales | null };

	type ScopedLocale = DeepKeyUnion<FirstLocale>;

	// Create server-side i18n functions
	const getI18n = async () => {
		const _options = {
			...options,
		}
		if(_options.persistentLocale && 'server' in _options.persistentLocale){
			_options.persistentLocale = _options.persistentLocale.server;
		}
		const contentLocale = await getContentLocale(locales, _options);
		return createT<FirstLocale>(contentLocale);
	};
	const getScopedI18n = async <ScopePath extends ScopedLocale>(
		scope: ScopePath,
	) => {
		const _options = {
			...options,
		}
		if(_options.persistentLocale && 'server' in _options.persistentLocale){
			_options.persistentLocale = _options.persistentLocale.server;
		}
		const contentLocale = await getContentLocale(locales, _options);
		return createScopedT<FirstLocale, ScopePath>(contentLocale, scope);
	};

	return {
		getI18n,
		getScopedI18n,
		initLocale: (locale: keyof Locales) => {
			localeOptions.locale = locale;
		},
	};
}
