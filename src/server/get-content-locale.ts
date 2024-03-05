import type { ImportedLocales, LocaleOptions } from "../types/i18n";

export const getContentLocale = async <Locales extends ImportedLocales>(
	locales: Locales,
	contentLocale: LocaleOptions<Locales>,
) => {
	let locale = "";

	const storedLocale = contentLocale.storedLocale?.get?.();
	if (typeof storedLocale === "string") {
		locale = storedLocale;
	} else if (storedLocale instanceof Promise) {
		try {
			locale = (await storedLocale) ?? "";
		} catch (error) {
			console.error("Erro ao obter locale da promessa:", error);
		}
	}

	if (!(locale in locales)) {
		console.warn(
			`O locale '${locale}' não está disponível. Usando o locale padrão.`,
		);
		locale = contentLocale.defaultLocale;
	}

	return (await locales[locale]).default;
};
