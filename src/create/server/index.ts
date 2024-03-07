import type {
	DeepKeyUnion,
	ImportedLocales,
	Locale,
	LocaleOptions,
} from "../../types";
import { getContentLocale } from "../../helpers";
import { getScopedT, getT } from "../../common";

export function createServerI18n<
	Locales extends ImportedLocales,
	FirstLocale extends Locale<Locales[keyof Locales]>,
>(locales: Locales, options: LocaleOptions<Locales>) {
	
	type ScopedLocale = DeepKeyUnion<FirstLocale>;
	const contentLocale = () => getContentLocale(locales, options);

	const getI18n = async () => getT<FirstLocale>(await contentLocale());
	const getScopedI18n = async <ScopePath extends ScopedLocale>(
		scope: ScopePath,
	) => getScopedT<FirstLocale, ScopePath>(await contentLocale(), scope);

	return {
		getI18n,
		getScopedI18n,
	};
}
