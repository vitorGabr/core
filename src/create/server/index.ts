import { createScopedT, createT } from "./create-server-i18n";
import type {
	ImportedLocales, Locale, LocaleOptions,
} from "../../types";


export const createServerI18n = <
	Locales extends ImportedLocales,
>(
	locales: Locales,
	options: LocaleOptions<typeof locales>,
) => {
	const firstLocale = Object.keys(locales)[0] as keyof Locales;
	type FirstLocale = Locale<Locales[typeof firstLocale]>

	const getI18n = createT<Locales,FirstLocale>(locales, options);
	const getScopedI18n = createScopedT<Locales,FirstLocale>(locales, options);

	return {
		getI18n,
		getScopedI18n,
	};
};
