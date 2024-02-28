import { Provider as JOTAIPROVIDER, useAtom } from "jotai";
import { retrieveValueAtPath, retrieveScopeValueAtPath, getServerLocale } from "../functions";
import type {
	CreateI18nOptions,
	CreateI18nProps,
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	NestedValueByPath,
	StringParameters,
} from "../types";
import { dictionaryAtom, dictionaryStore } from "../atoms/locale-atom";

export const createClientI18n = <T,>(
	locales: CreateI18nProps<T>,
	options: CreateI18nOptions<typeof locales>,
) => {
	const firstLocale = Object.keys(locales)[0] as keyof T;
	type FirstLocale = (typeof locales)[typeof firstLocale] extends () => Promise<
		infer R
	>
		? R extends Record<string, unknown>
		? R
		: never
		: never;

	return {
		Provider: ({
			children,
		}: {
			children: React.ReactNode;
		}) => {

			const fetcha = async () => {
				const _d = await getServerLocale(locales, options);
				dictionaryStore.set(dictionaryAtom, _d);
			}

			fetcha();

			return <JOTAIPROVIDER store={dictionaryStore}>{children}</JOTAIPROVIDER>;
		},
		useI18n: () => {
			const [dictionary] = useAtom(dictionaryAtom);
			return <
				T extends DeepKeyStringUnion<FirstLocale>,
				V extends NestedValueByPath<FirstLocale, T>,
				S extends StringParameters<V extends string ? V : "">,
			>(
				key: T,
				params?: S,
			) => {
				if (!Object.keys(dictionary).length) return "";

				return retrieveValueAtPath({
					obj: dictionary,
					path: key,
					params,
				});
			};
		},
		useScopedI18n: <DP extends DeepKeyUnion<FirstLocale>>(scope: DP) => {
			const [dictionary] = useAtom(dictionaryAtom);
			return <
				T extends FlattenedValueByPath<FirstLocale, DP>,
				V extends NestedValueByPath<FirstLocale, T>,
				S extends StringParameters<V extends string ? V : "">,
			>(
				key: T,
				params?: S,
			) => {
				if (!Object.keys(dictionary).length) return "";
				return retrieveScopeValueAtPath({
					obj: dictionary as FirstLocale,
					scope,
					path: key,
					params,
				});
			};
		},
		useChangeLocale: () => {
			const [_, setDictionary] = useAtom(dictionaryAtom);
			return setDictionary;
		},
		useGetLocale: () => {
			return 'locale';
		},
	};
};
