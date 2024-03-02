import type { ImportedLocales} from "../../types/i18n";

export const getServerLocale = async <Locales extends ImportedLocales>(
	locales: Locales,
	locale: string,
) => {
	return (await locales[locale as string]).default;
};
