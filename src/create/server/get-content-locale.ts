import type { ImportedLocales, LocaleOptions } from "../../types/i18n";

/**
 * Retrieves the server locale based on the provided options.
 * @param {ImportedLocales} locales - An object containing promises of imported locales.
 * @param {LocaleServerOptions<Locales> & { locale: string | null }} contentLocale - Server locale options, including the current locale and locale options.
 * @returns {Promise<Record<string, unknown>>} The server locale object.
 */
export const getContentLocale = async <Locales extends ImportedLocales>(
	locales: Locales,
	contentLocale: LocaleOptions<Locales> & { locale: string | null },
) => {
	let locale = "";

	if (contentLocale.locale) {
		locale = contentLocale.locale;
	}

	if (!locale) {
		const storedLocale = contentLocale.storedLocale?.get?.();
		if (typeof storedLocale === "string") {
			locale = storedLocale;
		} else if (storedLocale instanceof Promise) {
			try {
				locale = await storedLocale ?? "";
			} catch (error) {
				console.error("Erro ao obter locale da promessa:", error);
			}
		}
	}

	if (!(locale in locales)) {
		console.warn(`O locale '${locale}' não está disponível. Usando o locale padrão.`);
		locale = contentLocale.defaultLocale;
	}

	return (await locales[locale]).default;
};