import type {
	CreateI18nProps,
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
} from "../types";

export const createDefaultI18n = <T,>(
	locales: CreateI18nProps<T>,
) => {
	const firstLocale = Object.keys(locales)[0] as keyof T;
	type FirstLocale = (typeof locales)[typeof firstLocale] extends () => Promise<
		infer R
	>
		? R extends Record<string, unknown>
			? R
			: never
		: never;


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
