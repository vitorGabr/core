import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	ImportedLocales,
	Locale,
	NestedValueByPath,
	StringParameters,
} from "../types";
import {
	retrieveScopeValueAtPath,
	retrieveValueAtPath,
} from "./flatten-object";


export function createT<
	CurrentLocale extends Locale<ImportedLocales[keyof ImportedLocales]>,
>(contentLocale: Record<string, unknown>) {
	// Retrieve content locale asynchronously
	const content = contentLocale;

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
}


export function createScopedT<
	CurrentLocale extends Locale<ImportedLocales[keyof ImportedLocales]>,
	ScopePath extends DeepKeyUnion<CurrentLocale>
>(contentLocale: Record<string, unknown>,scope: ScopePath) {
	// Retrieve content locale asynchronously and cast it to the appropriate type
	const content = contentLocale;
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
			obj: content as CurrentLocale,
			scope,
			path: key,
			params,
		});
	};
}
