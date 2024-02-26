import type { CreateI18nOptions, CreateI18nProps } from "../types";

export async function getServerLocale<T extends Record<string, unknown>>(
    locales: CreateI18nProps<T>,
	options: CreateI18nOptions<T>,
) {
    let locale = options.defaultLocale || '';
    if(options.storedLocale){
        locale = await options.storedLocale.get();
    }

    // @ts-ignore
	return locales[locale]();
}
