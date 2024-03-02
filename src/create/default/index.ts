import type { DeepKeyStringUnion, DeepKeyUnion, FlattenedValueByPath } from "../../types";
import type { ImportedLocales, Locale } from "../../types/i18n";

/**
 * Creates a default i18n instance.
 * @param {ImportedLocales} locales - An object containing promises of imported locales.
 * @returns {Object} An object containing functions for simple key-value translations.
 */
export const createDefaultI18n = <Locales extends ImportedLocales>(
    locales: Locales,
) => {
    // Retrieve the first locale and its type
    const firstLocaleKey = Object.keys(locales)[0] as keyof Locales;
    type FirstLocaleType = Locale<Locales[typeof firstLocaleKey]>;

    return {
        // Return a simple translation function
        t: (key: DeepKeyStringUnion<FirstLocaleType>) => {
            return key;
        },
        // Return a scoped translation function
        scopedT: <Scope extends DeepKeyUnion<FirstLocaleType>>(scope: Scope) => {
            return (key: FlattenedValueByPath<FirstLocaleType, Scope>) => {
                return `${scope}.${key}`;
            };
        },
    };
};
