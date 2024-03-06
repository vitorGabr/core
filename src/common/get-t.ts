import type {
	DeepKeyStringUnion,
	ImportedLocales,
	Locale,
	NestedValueByPath,
	StringParameters,
} from "../types";
import { createT } from "../helpers";

export function getT<
	CurrentLocale extends Locale<ImportedLocales[keyof ImportedLocales]>,
>(contentLocale: CurrentLocale) {
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
		return createT({
			obj: contentLocale,
			path: key,
			params,
		});
	};
}
