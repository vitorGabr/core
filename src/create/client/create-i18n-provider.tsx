import { Suspense } from "react";
import type { ImportedLocales, Locale, LocaleOptions } from "../../types";
import {
	QueryClient,
	QueryClientProvider,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { getContentLocale } from "../../helpers";

export type LocaleContextType<Locales extends ImportedLocales> = {
	dictionary: Locale<Locales[keyof Locales]>;
	updateLocale: (locale: Extract<keyof Locales, string>) => void;
};

const QUERY_KEY = "locale";

export function createI18nProvider<Locales extends ImportedLocales>({
	locales,
	options,
	I18nContext,
}: {
	locales: Locales;
	options: LocaleOptions<Locales>;
	I18nContext: React.Context<LocaleContextType<Locales> | null>;
}) {
	function LocaleProvider({
		children,
	}: {
		children: React.ReactNode;
	}) {
		const queryClient = useQueryClient();
		const { data: dictionary } = useSuspenseQuery({
			queryKey: [QUERY_KEY],
			queryFn: () =>
				getContentLocale(locales, {
					...options,
				}),
		});

		const updateLocale = (newLocale: Extract<keyof Locales, string>) => {
			options.persistentLocale?.set?.(newLocale);
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEY],
			});
		};

		return (
			<I18nContext.Provider
				value={{
					dictionary,
					updateLocale,
				}}
			>
				{children}
			</I18nContext.Provider>
		);
	}

	return function WrappedLocaleProvider(props: {
		children: React.ReactNode;
	}) {
		const queryClient = new QueryClient();

		return (
			<QueryClientProvider client={queryClient}>
				<Suspense fallback={null}>
					<LocaleProvider {...props} />
				</Suspense>
			</QueryClientProvider>
		);
	};
}
