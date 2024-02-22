import { retrieveValueAtPath, retrieveScopeValueAtPath } from "../functions/flatten-object";
import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	NestedValueByPath,
} from "../types/flatten-types";
import { useAtom } from "jotai";
import { localeAtom } from "../atoms/locale-atom";
import type { CreateI18nOptions, CreateI18nProps } from "../types/create-i18n";
import type { StringParameters } from "../types/string-parameters";
import { useRetrieveLocation } from "../hooks/use-retrive-location";

export const createClientI18n = <T extends Record<string, unknown>>(
	locales: CreateI18nProps<T>,
	options?: CreateI18nOptions<typeof locales>,
) => {
	return {
		useI18n: () => {
            const locale = useRetrieveLocation(locales, options);

            return <
                T extends DeepKeyStringUnion<typeof locale>,
                V extends NestedValueByPath<typeof locale, T>,
                S extends StringParameters<V extends string ? V : "">,
            >(
                key: T,
                params?: S,
            ) => {

                if (!locale) return "";

                return retrieveValueAtPath({
                    obj: locale,
                    path: key,
                    params,
                });
            };
        },
        useScopedI18n: <DP extends DeepKeyUnion<Awaited<T>>>(scope: DP) => {
            const locale = useRetrieveLocation(locales, options);

            return <
                T extends FlattenedValueByPath<typeof locale, DP>,
                V extends NestedValueByPath<typeof locale, T>,
                S extends StringParameters<V extends string ? V : "">,
            >(
                key: T,
                params?: S,
            ) => {
                return retrieveScopeValueAtPath({
                    obj: locale,
                    scope,
                    path: key,
                    params,
                });
            };
        },
        setLocale: (newLocale: keyof typeof locales) => {
            const [_, setLocale] = useAtom(localeAtom);
            setLocale(newLocale);
        },
	};
};
