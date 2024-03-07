import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	ImportedLocales,
	Locale,
} from "../../types";

export const createDefaultI18n = <Locales extends ImportedLocales>(
	_: Locales,
) => {
	type CurrentLocale = Locale<Locales[keyof Locales]>;

	return {
		t: (key: DeepKeyStringUnion<CurrentLocale>) => key,
		scopedT: <Scope extends DeepKeyUnion<CurrentLocale>>(scope: Scope) => {
			return (key: FlattenedValueByPath<CurrentLocale, Scope>) => {
				return `${scope}.${key}`;
			};
		},
	};
};
