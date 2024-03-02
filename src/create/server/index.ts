import { createLocalizedContentRetriever, createScopedLocalizedContentRetriever } from "./create-server-i18n";
import type { ImportedLocales, Locale } from "../../types";
import type { LocaleOptions } from "../../types/i18n";

/**
 * Creates an internationalization (i18n) server instance.
 * @param {ImportedLocales} locales - An object containing promises of imported locales.
 * @param {LocaleServerOptions<Locales>} options - Options for the i18n server, including locale and other configurations.
 * @returns {Object} An object containing functions to retrieve localized content and set the current locale.
 */
export const createServerI18n = <Locales extends ImportedLocales>(
    locales: Locales,
    options: LocaleOptions<Locales>,
) => {
    // Merge options with default locale configuration
    const contentLocale = {
        locale: null,
        ...options,
    } as LocaleOptions<Locales> & { locale: string | null };

    // Retrieve the first locale and its type
    const firstLocale = Object.keys(locales)[0] as keyof Locales;
    type FirstLocale = Locale<Locales[typeof firstLocale]>;

    // Create functions to retrieve localized content
    const getI18n = createLocalizedContentRetriever<Locales, FirstLocale>(locales, contentLocale);
    const getScopedI18n = createScopedLocalizedContentRetriever<Locales, FirstLocale>(
        locales,
        contentLocale,
    );

    return {
        // Return the functions and an initialization function to set the locale
        getI18n,
        getScopedI18n,
        initLocale: (locale: string) => {
            contentLocale.locale = locale;
        },
    };
};
