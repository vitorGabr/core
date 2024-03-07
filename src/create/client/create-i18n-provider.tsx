import { type Context, Suspense, useContext } from "react";
import type { ImportedLocales, Locale, LocaleOptions } from "../../types";
import { getContentLocale } from "../../helpers";
import useSWR from "swr";

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
	const fetcher = () => getContentLocale(locales, options);
	function LocaleProvider({
		children,
	}: {
		children: React.ReactNode;
	}) {
		const { data: dictionary, mutate } = useSWR("locale", fetcher, {
			suspense: true,
		});

		const updateLocale = (newLocale: Extract<keyof Locales, string>) => {
			options.persistentLocale?.set?.(newLocale);
			mutate();
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
		return (
			<Suspense fallback={null}>
				<LocaleProvider {...props} />
			</Suspense>
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
