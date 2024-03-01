import type { ImportedLocales } from "../types";
import type { LocaleOptions } from "../types/i18n";
import { createClientI18n } from "./client";
import { createServerI18n } from "./server";
import { createDefaultI18n } from "./default";

export function createI18n<Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleOptions<Locales>,
) {
	const server = createServerI18n(locales, options);
	const client = createClientI18n(locales, options);
    const defaultI18n = createDefaultI18n(locales);

    return {
        server,
        client,
        default: defaultI18n
    }
}
