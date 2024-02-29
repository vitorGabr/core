import {
	retrieveValueAtPath,
	retrieveScopeValueAtPath,
} from "../functions";
import type {
	CreateI18nOptions,
	CreateI18nProps,
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	NestedValueByPath,
	StringParameters,
} from "../types";

import { useLocale, WrappedLocaleProvider } from "../providers/locale-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

	const queryClient = new QueryClient()

	return {
		Provider: ({
			children,
			locale,
		}: {
			children: React.ReactNode;
			locale?: keyof T;
		}) => {
			const _locale = locale || options.storedLocale.get();
			return (
				<QueryClientProvider client={queryClient}>
					<WrappedLocaleProvider
						locales={locales}
						locale={_locale as any}
						onUpadteLocale={options.storedLocale.set}
					>
						{children}
					</WrappedLocaleProvider>
				</QueryClientProvider>
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
				if (Object.keys(dictionary).length === 0) {
					return ""
				}
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
				if (Object.keys(dictionary).length === 0) {
					return ""
				}
				return retrieveScopeValueAtPath({
					obj: dictionary as FirstLocale,
					scope,
					path: key,
					params,
				});
			};
		},
		useChangeLocale: () => {
			const { updateLocale } = useLocale();
			return updateLocale;
		},
		useGetLocale: () => {
			const { locale } = useLocale();
			return locale;
		},
	};
};
