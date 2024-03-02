import type { ImportedLocales, LocaleServerOptions } from "../../types/i18n";

export const getServerLocale = async <Locales extends ImportedLocales>(
	locales: Locales,
	contentLocale: LocaleServerOptions<Locales> & { locale: string | null },
) => {
	let locale = contentLocale.locale as any; 
	if (!locale) {
		locale = contentLocale.storedLocale.get();
	}

	if(Object.keys(locales).indexOf(locale) === -1) {
		locale = contentLocale.defaultLocale;
	}

	return (await locales[locale]).default;
};
