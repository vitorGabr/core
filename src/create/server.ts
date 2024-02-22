import {
	retrieveValueAtPath,
	retrieveScopeValueAtPath,
} from "../functions/flatten-object";
import type { CreateI18nProps, CreateI18nOptions } from "../types/create-i18n";
import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	NestedValueByPath,
} from "../types/flatten-types";
import type { StringParameters } from "../types/string-parameters";

export const createServerI18n = <T extends Record<string, unknown>>(
	locales: CreateI18nProps<T>,
	options?: CreateI18nOptions<typeof locales>,
) => {
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
