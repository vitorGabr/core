import type {
	DeepKeyStringUnion,
	ImportedLocales,
	Locale,
	NestedValueByPath,
	StringParameters,
} from "../types";
import {
	retrieveValueAtPath,
} from "../helpers/flatten-object";

export function createT<
	CurrentLocale extends Locale<ImportedLocales[keyof ImportedLocales]>,
>(contentLocale: Record<string, unknown>) {

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
		return retrieveValueAtPath({
			obj: contentLocale,
			path: key,
			params,
		});
	};
}