import { createT, createScopedT } from "./create-i18n";
import type { DeepKeyUnion, ImportedLocales, Locale } from "../../types";
import type { LocaleOptions } from "../../types/i18n";
import {
	QueryClient,
	QueryClientProvider,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { getContentLocale } from "./get-content-locale";


export const createI18n = <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleOptions<Locales>,
) => {

	const firstLocale = Object.keys(locales)[0] as keyof Locales;
	type FirstLocale = Locale<Locales[typeof firstLocale]>;
	type ScopedLocale = DeepKeyUnion<FirstLocale>;

	// Create server-side i18n functions
	const getI18n = async () => {
		const contentLocale = await getContentLocale(locales, options);
		return createT<FirstLocale>(contentLocale);
	};
	const getScopedI18n = async <ScopePath extends ScopedLocale>(
		scope: ScopePath,
	) => {
		const contentLocale = await getContentLocale(locales, options);
		return createScopedT<FirstLocale, ScopePath>(contentLocale, scope);
	};

	// Create client-side i18n functions
	const useI18n = () => {
		const contentLocale = useDictionary(locales, options);
		return createT<FirstLocale>(contentLocale);
	};
	const useScopedI18n = <ScopePath extends ScopedLocale>(scope: ScopePath) => {
		const contentLocale = useDictionary(locales, options);
		return createScopedT<FirstLocale, ScopePath>(contentLocale, scope);
	};
	const Provider = ({
		children,
	}: {
		children: React.ReactNode;
	}) => {
		const queryClient = new QueryClient();
		queryClient.prefetchQuery({
			queryKey: ["dictionary"],
			queryFn: () => getContentLocale(locales, options),
		});

		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};

	return {
		server: {
			getI18n,
			getScopedI18n,
		},
		Provider,
		useI18n,
		useScopedI18n,
	};
};

const useDictionary = <Locales extends ImportedLocales>(
	locales: Locales,
	contentLocale: LocaleOptions<Locales>,
) => {
	const { data } = useSuspenseQuery({
		queryKey: ["dictionary"],
		queryFn: () => getContentLocale(locales, contentLocale),
	});
	return data;
};
