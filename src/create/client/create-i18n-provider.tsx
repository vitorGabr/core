import { Suspense, useState } from "react";
import type {
	ImportedLocales,
	Locale,
	LocaleOptions,
} from "../../types/create";
import {
	QueryClient,
	QueryClientProvider,
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
		locale,
	}: {
		locale?: string;
		children: React.ReactNode;
	}) {
		const [currentLocale, setCurrentLocale] = useState(locale);

		const { data: dictionary } = useSuspenseQuery({
			queryKey: [QUERY_KEY, { currentLocale }],
			queryFn: () => {
				return getContentLocale(locales, {
					...options,
					locale: currentLocale,
				});
			},
		});

		const updateLocale = async (newLocale: Extract<keyof Locales, string>) => {
			options.persistentLocale?.set?.(newLocale);
			setCurrentLocale(newLocale);
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
		locale?: string;
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
