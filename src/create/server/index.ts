import type {
	DeepKeyUnion,
	ImportedLocales,
	Locale,
	LocaleOptions,
} from "../../types";
import { createT, createScopedT } from "../../functions/create-i18n";
import { getContentLocale } from "../../functions/get-content-locale";

export function createServerI18n<
	Locales extends ImportedLocales,
	FirstLocale extends Locale<Locales[keyof Locales]>,
>(locales: Locales, options: LocaleOptions<Locales>) {

	let locale = null as string | null;

	type ScopedLocale = DeepKeyUnion<FirstLocale>;

	const getI18n = async () => {
		const contentLocale = await getContentLocale(locales, {
			...options,
			locale,
		});
		return createT<FirstLocale>(contentLocale);
	};
	const getScopedI18n = async <ScopePath extends ScopedLocale>(
		scope: ScopePath,
	) => {
		const contentLocale = await getContentLocale(locales, {
			...options,
			locale,
		});
		return createScopedT<FirstLocale, ScopePath>(contentLocale, scope);
	};

	return {
		getI18n,
		getScopedI18n,
		initLocale: (newLocale: string) => {
			locale = newLocale;
		},
	};
}
