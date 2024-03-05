import type {  DeepKeyStringUnion, DeepKeyUnion, FlattenedValueByPath, ImportedLocales } from "./types";
import type { Locale, LocaleOptions } from "./types/i18n";
import { client } from "./create/client";
import { server } from "./create/server";

export const createI18n = <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleOptions<Locales>,
) => {

	const firstLocaleKey = Object.keys(locales)[0] as keyof Locales;
    type FirstLocaleType = Locale<Locales[typeof firstLocaleKey]>;


	const createServer = server(locales, options);
	const createClient = client(locales, options);

	return {
		server: createServer,
		client: createClient,
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

