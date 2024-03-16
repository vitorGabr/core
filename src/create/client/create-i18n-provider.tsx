import {
	type Context,
	Suspense,
	useContext,
	//@ts-ignore
	use,
	useState
} from "react";
import type { ImportedLocales, Locale, LocaleOptions } from "../../types";
import { getContentLocale } from "../../helpers";

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
		locale,
	}: {
		children: React.ReactNode;
		locale?: string;
	}) {
		const [currentLocale, setCurrentLocale] = useState<string | null>(null);
		const useLocale =
			options.persistentLocale && "useLocale" in options.persistentLocale
				? options.persistentLocale.useLocale?.()
				: locale;

		const dictionary = use(getContentLocale(locales, {
			...options,
			locale: currentLocale ?? useLocale,
		}))


		const updateLocale = (newLocale: Extract<keyof Locales, string>) => {
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
		children: React.ReactNode;
		locale?: string;
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
