import { type Context, Suspense, useContext } from "react";
import type { ImportedLocales, Locale, LocaleOptions } from "../../types";
import { getContentLocale } from "../../helpers";
import {
	QueryClient,
	QueryClientProvider,
	useSuspenseQuery,
} from "@tanstack/react-query";

type LocaleContextType<Locales extends ImportedLocales> = {
	dictionary: Locale<Locales[keyof Locales]>;
	updateLocale: (locale: Extract<keyof Locales, string>) => void;
};

function createI18nProvider<Locales extends ImportedLocales>({
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
		const { data: dictionary, refetch } = useSuspenseQuery({
			queryKey: ["locale"],
			queryFn: () => getContentLocale(locales, options),
		});

		const updateLocale = (newLocale: Extract<keyof Locales, string>) => {
			options.persistentLocale?.set?.(newLocale);
			refetch();
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

function useLocaleContext<Locales extends ImportedLocales>(
	Context: Context<LocaleContextType<Locales> | null>,
) {
	const context = useContext(Context);
	if (!context) throw new Error("Error");

	return context;
}

export { createI18nProvider, useLocaleContext, type LocaleContextType };
