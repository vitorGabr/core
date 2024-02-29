
import {
	createContext,
	type ReactNode,
	useContext,
	Suspense,
	type ComponentProps,
} from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

type LocaleContextType<T extends Record<string, unknown>> = {
	dictionary: Record<string, unknown>;
	locale: keyof T | Promise<string>;
	updateLocale: (locale: string) => void;
};

const LocaleContext = createContext<LocaleContextType<any>>(
	{} as LocaleContextType<any>,
);

const LocaleProvider = <
	T extends Record<string, () => Promise<Record<string, unknown>>>,
>({
	children,
	locales,
	locale,
	onUpadteLocale,
	defaultLocale,
}: {
	children: ReactNode;
	locales: T;
	defaultLocale: keyof T;
	locale: keyof T | Promise<string>;
	onUpadteLocale: (newLocale: keyof T) => void;
}) => {
	const fetchLocale = async (_locale: keyof T) => {
		if (!locales[_locale]) {
			return locales[defaultLocale]();
		}
		return locales[_locale]();
	};

	const queryClient = useQueryClient();
	const { data } = useSuspenseQuery(
		{
			queryKey: ["locale", locale],
			queryFn: async () => {
				const _locale = await locale;
				return fetchLocale(_locale);
			},
		}
	);

	const updateLocale = async (newLocale: keyof T) => {
		onUpadteLocale(newLocale);
		const newLocaleData = await fetchLocale(newLocale);
		queryClient.setQueryData(["locale", newLocale], newLocaleData);
	}

	return (
		<LocaleContext.Provider
			value={{
				dictionary: data || {},
				locale,
				updateLocale: (newLocale: keyof T) => updateLocale(newLocale),
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

const WrappedLocaleProvider = (props: ComponentProps<typeof LocaleProvider>) => {
	return <Suspense>
		<LocaleProvider
			{...props}
		/>
	</Suspense>
}

export { LocaleProvider, LocaleContext, useLocale, WrappedLocaleProvider };
