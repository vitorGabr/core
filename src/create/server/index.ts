import { createScopedT, createT } from "./create-server-i18n";
import type { ImportedLocales, Locale } from "../../types";
import type { LocaleServerOptions } from "../../types/i18n";

export const createServerI18n = <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleServerOptions<Locales>,
) => {
	const state = {
		locale: (options.storedLocale.get() || options.defaultLocale) as
			| string
			| Promise<string | null | undefined>,
	};

	const firstLocale = Object.keys(locales)[0] as keyof Locales;
	type FirstLocale = Locale<Locales[typeof firstLocale]>;

	const getI18n = createT<Locales, FirstLocale>(locales, state);
	const getScopedI18n = createScopedT<Locales, FirstLocale>(
		locales,
		state,
	);

	return {
		getI18n,
		getScopedI18n,
		setLocale: (newLocale: string) => {
			state.locale = newLocale;
		},
	};
};
