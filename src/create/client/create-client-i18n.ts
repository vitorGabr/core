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
import type { Context } from "react";
import type { LocaleContextType } from "./create-i18n-provider";
import { useLocaleContext } from "./use-locale-contex";

export function createT<
	Locales extends ImportedLocales,
	CurrentLocale extends Locale<Locales[keyof Locales]>,
>(I18nContext: Context<LocaleContextType<Locales> | null>) {
	return () => {
		const { dictionary } = useLocaleContext(I18nContext);
		return <
			T extends DeepKeyStringUnion<CurrentLocale>,
			V extends NestedValueByPath<CurrentLocale, T>,
			S extends StringParameters<V extends string ? V : "">,
		>(
			key: T,
			params?: S,
		) => {
			return retrieveValueAtPath({
				obj: dictionary,
				path: key,
				params,
			});
		};
	};
}

export function createScopedT<
	Locales extends ImportedLocales,
	CurrentLocale extends Locale<Locales[keyof Locales]>,
>(I18nContext: Context<LocaleContextType<Locales> | null>) {
	return <DP extends DeepKeyUnion<CurrentLocale>>(scope: DP) => {
		const { dictionary } = useLocaleContext(I18nContext);
		return <
			T extends FlattenedValueByPath<CurrentLocale, DP>,
			V extends NestedValueByPath<CurrentLocale, T>,
			S extends StringParameters<V extends string ? V : "">,
		>(
			key: T,
			params?: S,
		) => {
			return retrieveScopeValueAtPath({
				obj: dictionary as CurrentLocale,
				scope,
				path: key,
				params,
			});
		};
	};
}
