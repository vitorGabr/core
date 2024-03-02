import { getContentLocale } from "./get-content-locale";
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

/**
 * Creates a function to retrieve localized content based on the provided locales and server locale options.
 * @param {ImportedLocales} locales - An object containing promises of imported locales.
 * @param {LocaleServerOptions<Locales> & { locale: string | null }} contentLocale - Server locale options, including the current locale and locale options.
 * @returns {Promise<Function>} An asynchronous function to retrieve localized content.
 */
export function createLocalizedContentRetriever<
	Locales extends ImportedLocales,
	CurrentLocale extends Locale<Locales[keyof Locales]>,
>(
	locales: Locales,
	contentLocale: LocaleServerOptions<Locales> & { locale: string | null },
) {
	return async () => {
		// Retrieve content locale asynchronously
		const content = await getContentLocale(locales, contentLocale);

		return <
			LocaleKey extends DeepKeyStringUnion<CurrentLocale>,
			LocaleValue extends NestedValueByPath<CurrentLocale, LocaleKey>,
			Parameters extends StringParameters<
				LocaleValue extends string ? LocaleValue : ""
			>,
		>(
			key: LocaleKey,
			params?: Parameters,
		) => {
			// Retrieve value at the specified path in the content
			return retrieveValueAtPath({
				obj: content,
				path: key,
				params,
			});
		};
	};
}

/**
 * Creates a scoped function to retrieve localized content based on the provided locales, server locale options, and scope.
 * @param {ImportedLocales} locales - An object containing promises of imported locales.
 * @param {LocaleServerOptions<Locales> & { locale: string | null }} contentLocale - Server locale options, including the current locale and locale options.
 * @returns {Promise<Function>} An asynchronous function to retrieve scoped localized content.
 */
export function createScopedLocalizedContentRetriever<
	Locales extends ImportedLocales,
	CurrentLocale extends Locale<Locales[keyof Locales]>,
>(
	locales: Locales,
	contentLocale: LocaleServerOptions<Locales> & { locale: string | null },
) {
	return async <ScopePath extends DeepKeyUnion<CurrentLocale>>(
		scope: ScopePath,
	) => {
		// Retrieve content locale asynchronously and cast it to the appropriate type
		const value = (await getContentLocale(locales, contentLocale)) as Locale<
			Locales[keyof Locales]
		>;

		return <
			ScopedKey extends FlattenedValueByPath<CurrentLocale, ScopePath>,
			ScopedValue extends NestedValueByPath<CurrentLocale, ScopedKey>,
			Parameters extends StringParameters<
				ScopedValue extends string ? ScopedValue : ""
			>,
		>(
			key: ScopedKey,
			params?: Parameters,
		) => {
			// Retrieve scoped value at the specified path in the content
			return retrieveScopeValueAtPath({
				obj: value,
				scope,
				path: key,
				params,
			});
		};
	};
}
