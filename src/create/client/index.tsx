import { retrieveValueAtPath, retrieveScopeValueAtPath } from "../../functions";
import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	NestedValueByPath,
	StringParameters,
	ImportedLocales,
	Locale,
	LocaleOptions,
} from "../../types";

import { createI18nProvider } from "./create-i18n-provider";
import { createContext } from "react";
import type { LocaleContextType } from "./create-i18n-provider";
import { useLocaleContext } from "./use-locale-contex";

export const createClientI18n = <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleOptions<Locales>,
) => {
	const firstLocale = Object.keys(locales)[0] as keyof Locales;
	type FirstLocale = Locale<Locales[typeof firstLocale]>;
	const LocaleContext = createContext<LocaleContextType<Locales> | null>(null);

	const createProvider = createI18nProvider({
		locales,
		options,
		I18nContext: LocaleContext,
	});

	return {
		Provider: createProvider,
		useI18n: () => {
			const { dictionary } = useLocaleContext(LocaleContext);
			return <
				T extends DeepKeyStringUnion<FirstLocale>,
				V extends NestedValueByPath<FirstLocale, T>,
				S extends StringParameters<V extends string ? V : "">,
			>(
				key: T,
				params?: S,
			) => {
				return retrieveValueAtPath({
					obj: dictionary,
					path: key,
					params,
				});
			};
		},
		useScopedI18n: <DP extends DeepKeyUnion<FirstLocale>>(scope: DP) => {
			const { dictionary } = useLocaleContext(LocaleContext);

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
		useChangeLocale: () => {
			const { updateLocale } = useLocaleContext(LocaleContext);
			return updateLocale;
		},
		useGetLocale: () => {
			const { locale } = useLocaleContext(LocaleContext);
			return locale;
		},
	};
};
