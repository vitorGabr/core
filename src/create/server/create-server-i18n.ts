import { getServerLocale } from "./get-server-locale";
import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	ImportedLocales,
	Locale,
	NestedValueByPath,
	StringParameters,
} from "../../types";
import {
	retrieveScopeValueAtPath,
	retrieveValueAtPath,
} from "../../functions/flatten-object";

export function createT<
	Locales extends ImportedLocales,
	CurrentLocale extends Locale<Locales[keyof Locales]>,
>(
	locales: Locales,
	data: {
		locale: string | Promise<string | null | undefined>;
	},
) {
	return async () => {
		const content = await getServerLocale(locales, data.locale);
		return <
			T extends DeepKeyStringUnion<CurrentLocale>,
			V extends NestedValueByPath<CurrentLocale, T>,
			S extends StringParameters<V extends string ? V : "">,
		>(
			key: T,
			params?: S,
		) => {
			return retrieveValueAtPath({
				obj: content,
				path: key,
				params,
			});
		};
	};
}

export function createScopedT<
	Locales extends ImportedLocales,
	CurrentLocale extends Locale<Locales[keyof Locales]>,
>(locales: Locales, data: {
	locale: string | Promise<string | null | undefined>;
},) {
	return async <DP extends DeepKeyUnion<CurrentLocale>>(scope: DP) => {
		const value = (await getServerLocale(locales, data.locale)) as Locale<
			Locales[keyof Locales]
		>;
		return <
			T extends FlattenedValueByPath<CurrentLocale, DP>,
			V extends NestedValueByPath<CurrentLocale, T>,
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
	};
}
