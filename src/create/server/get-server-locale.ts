import type { ImportedLocales, LocaleServerOptions } from "../../types/i18n";

export const getServerLocale = async <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleServerOptions<typeof locales>,
) => {
	console.log('aqui')
	try {
		const locale = (await options.storedLocale.get()) as keyof Locales;
		console.log('locale', locale)
		return (await locales[locale]).default;
	} catch (error) {
		console.log('error', error);
		console.log('locale error', options.defaultLocale);
		return (await locales[options.defaultLocale]).default;
	}
};
