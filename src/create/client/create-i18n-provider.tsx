import { Suspense } from "react";
import type { ImportedLocales, Locale, LocaleOptions } from "../../types";
import { getContentLocale } from "../../helpers";
import useSWR, { SWRConfig } from "swr";

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
		const { data: dictionary,mutate } = useSWR(
			QUERY_KEY,
			() =>
				getContentLocale(locales, {
					...options,
				}),
			{
				suspense: true,
			},
		);

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
			<SWRConfig>
				<Suspense fallback={null}>
					<LocaleProvider {...props} />
				</Suspense>
			</SWRConfig>
		);
	};
}
