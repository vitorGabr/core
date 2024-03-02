import type { ImportedLocales } from "../../types/i18n";

export const getServerLocale = async <Locales extends ImportedLocales>(
	locales: Locales,
	locale: string | Promise<string | null | undefined>
) => {
	const content = typeof locale === "string" ? locale : await locale;
	return (await locales[content as string]).default;
};
