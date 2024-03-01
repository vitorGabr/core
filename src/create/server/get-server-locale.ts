import type { ImportedLocales, LocaleServerOptions } from "../../types/i18n";

export const getServerLocale = async <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleServerOptions<typeof locales>,
) => {
	const locale = options.storedLocale.get() ?? options.defaultLocale;
	return (await locales[locale as string]).default;
};
