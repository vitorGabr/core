import { Suspense, useState } from "react";
import type { ImportedLocales, LocaleOptions } from "../../types/i18n";
import {
	QueryClient,
	QueryClientProvider,
	useSuspenseQuery,
} from "@tanstack/react-query";

export type LocaleContextType<T extends Record<string, unknown>> = {
	dictionary: Record<string, unknown>;
	locale: keyof T;
	updateLocale: (locale: keyof T) => void;
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
		locale?: keyof Locales;
		children: React.ReactNode;
	}) {
		const [currentLocale, setCurrentLocale] = useState<
			keyof Locales | undefined
		>(locale);

		const fetchLocale = async (_locale: keyof Locales | null | undefined) => {
			if (!Object.keys(locales).includes(_locale as string)) {
				return (await locales[options.defaultLocale]).default;
			}
			return (await locales[_locale as string]).default;
		};

		const { data } = useSuspenseQuery({
			queryKey: [QUERY_KEY, { currentLocale }],
			queryFn: async () => {
				const locale = currentLocale || (await options.persistentLocale?.get?.());
				return fetchLocale(locale);
			},
		});

		const updateLocale = async (newLocale: keyof Locales) => {
			options.persistentLocale?.set?.(newLocale as string);
			setCurrentLocale(newLocale);
		};

		return (
			<I18nContext.Provider
				value={{
					dictionary: data || {},
					locale: currentLocale || options.defaultLocale,
					updateLocale: (newLocale: keyof Locales) => updateLocale(newLocale),
				}}
			>
				{children}
			</I18nContext.Provider>
		);
	}

	return function WrappedLocaleProvider(props: {
		locale?: keyof Locales;
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