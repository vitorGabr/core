import { getServerLocale } from "./get-server-locale";
import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	ImportedLocales,
	Locale,
	LocaleOptions,
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
>(locales: Locales, options: LocaleOptions<Locales>) {
	return async () => {
		const locale = await getServerLocale(locales, options);
		return <
			T extends DeepKeyStringUnion<CurrentLocale>,
			V extends NestedValueByPath<CurrentLocale, T>,
			S extends StringParameters<V extends string ? V : "">,
		>(
			key: T,
			params?: S,
		) => {
			return retrieveValueAtPath({
				obj: locale,
				path: key,
				params,
			});
		};
	};
}

export function createScopedT<
	Locales extends ImportedLocales,
	CurrentLocale extends Locale<Locales[keyof Locales]>,
>(locales: Locales, options: LocaleOptions<Locales>) {
	return async <DP extends DeepKeyUnion<CurrentLocale>>(scope: DP) => {
		const value = (await getServerLocale(locales, options)) as Locale<
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
