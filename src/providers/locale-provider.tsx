import {
	createContext,
	useState,
	type ReactNode,
	useContext,
	useEffect,
} from "react";
import type { CreateI18nOptions, CreateI18nProps } from "../types";

type LocaleContextType = {
	dictionary: Record<string, unknown>;
	locale: string;
	setLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType>({
	dictionary: {},
	locale: "",
	setLocale: () => {},
});

const LocaleProvider = <T extends Record<string, unknown>>({
	children,
	locales,
	options,
}: {
	children: ReactNode;
	locales: CreateI18nProps<T>;
	options: CreateI18nOptions<typeof locales>;
}) => {
	const [locale, setLocale] = useState("");
	const [dictionary, setDictionary] = useState<Awaited<T>>({} as Awaited<T>);


    async function getLocale() {
        let _locale = options.defaultLocale;
        if(options.storedLocale){
            _locale = await options.storedLocale.get();
        }
        return _locale;
    }

	useEffect(() => {
        getLocale().then((value) => {
            setLocale(value);
        })
	}, []);

	useEffect(() => {
		if (locale) {
			options?.storedLocale?.set(locale);
			locales[locale]().then((value) => {
				setDictionary(value as Awaited<T>);
			});
		}
	}, [locale]);

	return (
		<LocaleContext.Provider
			value={{
				dictionary,
				locale,
				setLocale,
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
