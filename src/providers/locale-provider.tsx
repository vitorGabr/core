import {
	createContext,
	useState,
	type ReactNode,
	useContext,
	useEffect,
} from "react";
import type { CreateI18nOptions } from "../types";

type LocaleContextType<T extends Record<string, unknown>> = {
	dictionary: Record<string, unknown>;
	locale: keyof T;
	setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType<any>>(
	{} as LocaleContextType<any>,
);

const LocaleProvider = <
	T extends Record<string, () => Promise<Record<string, unknown>>>,
>({
	children,
	locales,
	options,
}: {
	children: ReactNode;
	locales: T;
	options: CreateI18nOptions<T>;
}) => {
	const [locale, setLocale] = useState(options.defaultLocale);
	const [dictionary, setDictionary] = useState<Record<string, unknown>>(
		{} as Record<string, unknown>,
	);

	async function getLocale() {
		let _locale = options.defaultLocale;
		if (options.storedLocale) {
			_locale = await options.storedLocale.get();
		}
		return _locale as string;
	}

	useEffect(() => {
		getLocale().then((value) => {
			if (value) {
				setLocale(value);
			}
		});
	}, []);

	useEffect(() => {
		if (locale) {
			options?.storedLocale?.set(locale);
			if (locales[locale]) {
				locales[locale]().then((value) => {
					setDictionary(value);
				});
			}
		}
	}, [locale]);

	return (
		<LocaleContext.Provider
			value={{
				dictionary,
				locale,
				setLocale
			}}
		>
			{children}
		</LocaleContext.Provider>
	);
};

const useLocale = () => {
	const locale = useContext(LocaleContext);
	return locale;
};

export { LocaleProvider, LocaleContext, useLocale };
