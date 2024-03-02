import { createScopedT, createT } from "./create-server-i18n";
import type { ImportedLocales, Locale } from "../../types";
import type { LocaleServerOptions } from "../../types/i18n";

export const createServerI18n = <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleServerOptions<Locales>,
) => {
	const contentLocale = {
		locale: null,
		...options,
	} as LocaleServerOptions<Locales> & { locale: string | null };

	const firstLocale = Object.keys(locales)[0] as keyof Locales;
	type FirstLocale = Locale<Locales[typeof firstLocale]>;

	const getI18n = createT<Locales, FirstLocale>(locales, contentLocale);
	const getScopedI18n = createScopedT<Locales, FirstLocale>(
		locales,
		contentLocale,
	);

	return {
		getI18n,
		getScopedI18n,
		setLocale: (newLocale: string) => {
			contentLocale.locale = newLocale;
		},
	};
};
