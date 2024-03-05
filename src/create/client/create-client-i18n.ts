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
import type { Context } from "react";
import type { LocaleContextType } from "./create-i18n-provider";
import { useLocaleContext } from "./use-locale-contex";

/**
 * Creates a function to retrieve localized content based on the provided context.
 * @param {Context<LocaleContextType<Locales> | null>} I18nContext - React context for the locale.
 * @returns {Function} A function to retrieve localized content.
 */
export function createT<
	Locales extends ImportedLocales,
	CurrentLocale extends Locale<Locales[keyof Locales]>,
>(I18nContext: Context<LocaleContextType<Locales> | null>) {
	return () => {
		const { dictionary } = useLocaleContext(I18nContext);

		return <
			Key extends DeepKeyStringUnion<CurrentLocale>,
			Value extends NestedValueByPath<CurrentLocale, Key>,
			Params extends StringParameters<Value extends string ? Value : "">,
		>(
			key: Key,
			params?: Params,
		) => {
			return retrieveValueAtPath({
				obj: dictionary,
				path: key,
				params,
			});
		};
	};
}

/**
 * Creates a scoped function to retrieve localized content based on the provided context and scope.
 * @param {Context<LocaleContextType<Locales> | null>} I18nContext - React context for the locale.
 * @returns {Function} A scoped function to retrieve localized content.
 */
export function createScopedT<
	Locales extends ImportedLocales,
	CurrentLocale extends Locale<Locales[keyof Locales]>,
>(I18nContext: Context<LocaleContextType<Locales> | null>) {
	return <Scope extends DeepKeyUnion<CurrentLocale>>(scope: Scope) => {
		const { dictionary } = useLocaleContext(I18nContext);

		return <
			Key extends FlattenedValueByPath<CurrentLocale, Scope>,
			Value extends NestedValueByPath<CurrentLocale, Key>,
			Params extends StringParameters<Value extends string ? Value : "">,
		>(
			key: Key,
			params?: Params,
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
