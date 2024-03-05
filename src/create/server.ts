import type {
	DeepKeyUnion,
	ImportedLocales,
	Locale,
	LocaleOptions,
} from "../types";
import { createT, createScopedT } from "../functions/create-i18n";
import { getContentLocale } from "../functions/get-content-locale";

export function server<
	Locales extends ImportedLocales,
	FirstLocale extends Locale<Locales[keyof Locales]>,
>(locales: Locales, options: LocaleOptions<Locales>) {

	type ScopedLocale = DeepKeyUnion<FirstLocale>;

	const getI18n = async () => {
		return 'as' as any
	};
	const getScopedI18n = async <ScopePath extends ScopedLocale>(
		scope: ScopePath,
	) => {
		return 'as' as any
	};

	return {
		getI18n,
		getScopedI18n,
		initLocale: (_locale: keyof Locales) => {
		},
	};
}
