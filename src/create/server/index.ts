import {
	retrieveValueAtPath,
	retrieveScopeValueAtPath,
} from "../../functions";
import type {
	StringParameters,
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	NestedValueByPath,
	ImportedLocales, Locale, LocaleOptions,
} from "../../types";

import { getServerLocale } from "./get-server-locale";

export const createServerI18n = <
	Locales extends ImportedLocales,
>(
	locales: Locales,
	options: LocaleOptions<typeof locales>,
) => {
	const firstLocale = Object.keys(locales)[0] as keyof Locales;
	type FirstLocale = Locale<Locales[typeof firstLocale]>

	return {
		getI18n: async () => {
			const value = await getServerLocale(locales, options);
			return <
				T extends DeepKeyStringUnion<FirstLocale>,
				V extends NestedValueByPath<FirstLocale, T>,
				S extends StringParameters<V extends string ? V : "">,
			>(
				key: T,
				params?: S,
			) => {
				return retrieveValueAtPath({
					obj: value,
					path: key,
					params,
				});
			};
		},
		getScopedI18n: async <DP extends DeepKeyUnion<FirstLocale>>(scope: DP) => {
			const value = await getServerLocale(locales, options);
			return <
				T extends FlattenedValueByPath<FirstLocale, DP>,
				V extends NestedValueByPath<FirstLocale, T>,
				S extends StringParameters<V extends string ? V : "">,
			>(
				key: T,
				params?: S,
			) => {
				return retrieveScopeValueAtPath({
					obj: value as FirstLocale,
					scope,
					path: key,
					params,
				});
			};
		},
	};
};
