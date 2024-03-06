import type {
	DeepKeyUnion,
	FlattenedValueByPath,
	ImportedLocales,
	Locale,
	NestedValueByPath,
	StringParameters,
} from "../types";
import { createT } from "../helpers";

export function getScopedT<
	CurrentLocale extends Locale<ImportedLocales[keyof ImportedLocales]>,
	ScopePath extends DeepKeyUnion<CurrentLocale>,
>(contentLocale: CurrentLocale, scope: ScopePath) {
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
		return createT({
			obj: contentLocale,
			scope,
			path: key,
			params,
		});
	};
}
