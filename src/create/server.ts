import {
	retrieveValueAtPath,
	retrieveScopeValueAtPath,
	getServerLocale,
} from "../functions";
import type {
	CreateI18nProps,
	CreateI18nOptions,
	StringParameters,
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	NestedValueByPath,
} from "../types";

export const createServerI18n = <T,>(
	locales: CreateI18nProps<T>,
	options: CreateI18nOptions<typeof locales>,
) => {
	const firstLocale = Object.keys(locales)[0] as keyof T;
	type FirstLocale = (typeof locales)[typeof firstLocale] extends () => Promise<
		infer R
	>
		? R extends Record<string, unknown>
			? R
			: never
		: never;

	return {
		getCurrentDictionary: async () => {
			const value = await getServerLocale(locales, options);
			return value;
		},
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
					obj: value,
					scope,
					path: key,
					params,
				});
			};
		},
	};
};
