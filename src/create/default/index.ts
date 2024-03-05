import type { DeepKeyStringUnion, DeepKeyUnion, FlattenedValueByPath } from "../../types";
import type { ImportedLocales, Locale } from "../../types/create";

export const createDefaultI18n = <Locales extends ImportedLocales>(
    locales: Locales,
) => {

    const firstLocaleKey = Object.keys(locales)[0] as keyof Locales;
    type FirstLocaleType = Locale<Locales[typeof firstLocaleKey]>;

    return {
        t: (key: DeepKeyStringUnion<FirstLocaleType>) => {
            return key;
        },
        scopedT: <Scope extends DeepKeyUnion<FirstLocaleType>>(scope: Scope) => {
            return (key: FlattenedValueByPath<FirstLocaleType, Scope>) => {
                return `${scope}.${key}`;
            };
        },
    };
};