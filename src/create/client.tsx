import { QueryClient, QueryClientProvider, useSuspenseQuery } from "@tanstack/react-query";
import type {
	DeepKeyUnion,
	ImportedLocales,
	Locale,
	LocaleOptions,
} from "../types";
import { createT, createScopedT } from "./create-i18n";
import { getContentLocale } from "./get-content-locale";

export function client<
	Locales extends ImportedLocales,
	FirstLocale extends Locale<Locales[keyof Locales]>,
>(locales: Locales, options: LocaleOptions<Locales>) {

	type ScopedLocale = DeepKeyUnion<FirstLocale>;

	const useDictionary = <Locales extends ImportedLocales>(
		locales: Locales,
		options: LocaleOptions<Locales>,
	) => {

		const _options = {
			...options,
		}

		if(_options.persistentLocale && 'client' in _options.persistentLocale){
			_options.persistentLocale = _options.persistentLocale.client;
		}

		const { data } = useSuspenseQuery({
			queryKey: ["dictionary"],
			queryFn: () => getContentLocale(locales, _options),
		});
		return data;
	};

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

		return (
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		);
	};

	return {
		useI18n,
		useScopedI18n,
		Provider,
	};
}

