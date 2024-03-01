import type { ImportedLocales, LocaleOptions } from "../../types/i18n";

export const getServerLocale = async <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleOptions<typeof locales>,
) => {
	try {
		const locale = (await options.storedLocale.get()) as keyof Locales;
		return (await locales[locale]).default;
	} catch (error) {
		return (await locales[options.defaultLocale]).default;
	}
};
