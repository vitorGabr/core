import {
	retrieveValueAtPath,
	retrieveScopeValueAtPath,
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

	const locale = locales[options.defaultLocale as keyof typeof locales] as () => Promise<FirstLocale>;

	return {
		getI18n: async () => {
			const value = await locale();
			return <
				T extends DeepKeyStringUnion<typeof value>,
				V extends NestedValueByPath<typeof value, T>,
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
			const value = (await locale()) as FirstLocale;
			return <
				T extends FlattenedValueByPath<typeof value, DP>,
				V extends NestedValueByPath<typeof value, T>,
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
