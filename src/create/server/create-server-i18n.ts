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
import type { LocaleServerOptions } from "../../types/i18n";


export function createT<
	Locales extends ImportedLocales,
	CurrentLocale extends Locale<Locales[keyof Locales]>,
>(
	locales: Locales,
	contentLocale: LocaleServerOptions<Locales> & { locale: string | null },
) {
	return async () => {
		const content = await getServerLocale(locales, contentLocale);
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
>(locales: Locales, contentLocale: LocaleServerOptions<Locales> & { locale: string | null }) {
	return async <DP extends DeepKeyUnion<CurrentLocale>>(scope: DP) => {
		const value = (await getServerLocale(locales, contentLocale)) as Locale<
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
