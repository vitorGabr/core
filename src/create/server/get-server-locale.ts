import type { ImportedLocales, LocaleServerOptions } from "../../types/i18n";

export const getServerLocale = async <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleServerOptions<typeof locales>,
) => {
	try {
		const locale = await options.storedLocale.get();

		return (await locales[locale as string]).default;
	} catch (error) {
		return (await locales[options.defaultLocale]).default;
	}
};
