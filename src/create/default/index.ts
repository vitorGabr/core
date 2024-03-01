import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
} from "../../types";
import type { ImportedLocales, Locale } from "../../types/create-i18n";

export const createDefaultI18n = <Locales extends ImportedLocales>(
	locales: Locales,
) => {
	const firstLocale = Object.keys(locales)[0] as keyof Locales;
	type FirstLocale = Locale<Locales[typeof firstLocale]>;

	return {
		t: (key: DeepKeyStringUnion<FirstLocale>) => {
			return key;
		},
		scopedT: <DP extends DeepKeyUnion<FirstLocale>>(scope: DP) => {
			return (key: FlattenedValueByPath<FirstLocale, DP>) => {
				return `${scope}.${key}`;
			};
		},
	};
};
