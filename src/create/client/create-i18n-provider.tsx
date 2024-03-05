import type { ImportedLocales, LocaleOptions } from "../../types/i18n";
import {
	QueryClient,
	QueryClientProvider,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";

export type LocaleContextType<T extends Record<string, unknown>> = {
	dictionary: Record<string, unknown>;
	updateLocale: (locale: keyof T) => void;
};

const QUERY_KEY = "locale";

/**
 * Creates an i18n provider.
 * @param {Object} props - Props for creating the i18n provider.
 * @param {Locales} props.locales - An object containing promises of imported locales.
 * @param {LocaleOptions<Locales>} props.options - Options for the i18n provider, including locale and other configurations.
 * @param {Context<LocaleContextType<Locales> | null>} props.I18nContext - React context for the locale.
 * @returns {Function} A wrapped locale provider component.
 */
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

		const queryClient = useQueryClient();

		const { data } = useSuspenseQuery({
			queryKey: [QUERY_KEY],
			queryFn: async () => {
				const _locale = locale || (await options.storedLocale?.get?.());
				if (!Object.keys(locales).includes(_locale as string)) {
					return (await locales[options.defaultLocale]).default;
				}
				return (await locales[_locale as string]).default;
			},
		});

		const updateLocale = async (newLocale: keyof Locales) => {
			options.storedLocale?.set?.(newLocale as string);
			queryClient.invalidateQueries({
				queryKey: [QUERY_KEY],
			})
		};

		return (
			<I18nContext.Provider
				value={{
					dictionary: data || {},
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
		queryClient.prefetchQuery({
			queryKey: [QUERY_KEY],
			queryFn: async () => {
				const _locale = props.locale || (await options.storedLocale?.get?.());
				if (!Object.keys(locales).includes(_locale as string)) {
					return (await locales[options.defaultLocale]).default;
				}
				return (await locales[_locale as string]).default;
			}
		})

		return (
			<QueryClientProvider client={queryClient}>
				{props.children}
			</QueryClientProvider>
		);
	};
}
