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

export const createServerI18n = <T extends Record<string, unknown>>(
	locales: CreateI18nProps<T>,
	options?: CreateI18nOptions<typeof locales>,
) => {

	const firtLocale = locales[Object.keys(locales)[0]] as Awaited<T>;
	type FirstLocale = Awaited<typeof firtLocale>;

	const locale = locales[options?.defaultLocale ?? "pt-BR"];

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
		getScopedI18n: async <DP extends DeepKeyUnion<Awaited<T>>>(scope: DP) => {
			const value = (await locale()) as Awaited<T>;
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
