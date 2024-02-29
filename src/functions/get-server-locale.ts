import type { CreateI18nOptions, CreateI18nProps } from "../types";

export const getServerLocale = async <T>(
	locales: CreateI18nProps<T>,
	options: CreateI18nOptions<typeof locales>,
) => {
	let locale = options.defaultLocale;
	if (options.storedLocale) {
		locale = (await options.storedLocale.get()) as keyof T;
	}

	// @ts-expect-error - testing purpose
	return locales[locale]();
};
