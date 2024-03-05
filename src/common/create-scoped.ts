import type {
	DeepKeyUnion,
	FlattenedValueByPath,
	ImportedLocales,
	Locale,
	NestedValueByPath,
	StringParameters,
} from "../types";
import { retrieveScopeValueAtPath } from "../helpers/flatten-object";

export function createScopedT<
	CurrentLocale extends Locale<ImportedLocales[keyof ImportedLocales]>,
	ScopePath extends DeepKeyUnion<CurrentLocale>,
>(contentLocale: Record<string, unknown>, scope: ScopePath) {
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
			obj: contentLocale as CurrentLocale,
			scope,
			path: key,
			params,
		});
	};
}
