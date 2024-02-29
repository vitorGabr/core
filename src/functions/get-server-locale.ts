import type { CreateI18nOptions, CreateI18nProps } from "../types";

export const getServerLocale = async <T>(
	locales: CreateI18nProps<T>,
	options: CreateI18nOptions<typeof locales>,
) => {
	const locale = (await options.storedLocale.get()) as keyof T
	
	if(!locales[locale]) {
		// @ts-expect-error - testing purpose
		return locales[options.defaultLocale]();
	}
	// @ts-expect-error - testing purpose
	return locales[locale]();
};
