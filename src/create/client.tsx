import { retrieveValueAtPath, retrieveScopeValueAtPath } from "../functions";
import { LocaleProvider, useLocale } from "../providers/locale-provider";
import type {
	CreateI18nOptions,
	CreateI18nProps,
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	NestedValueByPath,
	StringParameters,
} from "../types";

export const createClientI18n = <T,>(
	locales: CreateI18nProps<T>,
	options: CreateI18nOptions<typeof locales>,
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
		Provider: ({ children }: { children: React.ReactNode }) => {
			return (
				<LocaleProvider locales={locales} options={options}>
					{children}
				</LocaleProvider>
			);
		},
		useI18n: () => {
			const { dictionary } = useLocale();
			return <
				T extends DeepKeyStringUnion<FirstLocale>,
				V extends NestedValueByPath<FirstLocale, T>,
				S extends StringParameters<V extends string ? V : "">,
			>(
				key: T,
				params?: S,
			) => {
				if (!dictionary) return "";

				return retrieveValueAtPath({
					obj: dictionary,
					path: key,
					params,
				});
			};
		},
		useScopedI18n: <DP extends DeepKeyUnion<FirstLocale>>(scope: DP) => {
			const { dictionary } = useLocale();
			return <
				T extends FlattenedValueByPath<FirstLocale, DP>,
				V extends NestedValueByPath<FirstLocale, T>,
				S extends StringParameters<V extends string ? V : "">,
			>(
				key: T,
				params?: S,
			) => {
				return retrieveScopeValueAtPath({
					obj: dictionary as FirstLocale,
					scope,
					path: key,
					params,
				});
			};
		},
		setLocale: (newLocale: keyof typeof locales) => {
			const { setLocale } = useLocale();
			if (newLocale in locales && typeof newLocale === "string") {
				setLocale(newLocale);
			}
		},
	};
};
