import { useEffect, useState } from "react";
import { retrieveValueAtPath, retrieveScopeValueAtPath } from "./functions";
import {
	type DeepKeyStringUnion,
	type DeepKeyUnion,
	type FlattenedValueByPath,
	type NestedValueByPath,
	type SpliParameters,
} from "./types";
import { useAtom } from "jotai";
import { localeAtom } from "./atom";

type CreateI18Props<T extends Record<string, unknown>> = Record<
	string,
	() => Promise<T>
>;

type Options<T extends Record<string, unknown>> = {
	defaultLocale?: keyof T;
};

export const createI18n = <T extends Record<string, unknown>>(
	locales: CreateI18Props<T>,
	options?: Options<typeof locales>,
) => {
	const locale = locales[options?.defaultLocale ?? "pt-BR"];

	return {
		client: {
			useI18n: () => {
				const [locale] = useAtom(localeAtom);
				const [l, setL] = useState<Awaited<T>>({} as Awaited<T>);

				// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
				useEffect(() => {
					locales[locale ?? options?.defaultLocale ?? "pt-BR"]().then(
						(value) => {
							setL(value as Awaited<T>);
						},
					);
				}, [locale]);

				return <
					T extends DeepKeyStringUnion<typeof l>,
					V extends NestedValueByPath<typeof l, T>,
					S extends SpliParameters<V extends string ? V : "">,
				>(
					key: T,
					params?: S,
				) => {
					if (!l) return "";
					return retrieveValueAtPath({
						obj: l,
						path: key,
						params,
					});
				};
			},
			useScopedI18n: <DP extends DeepKeyUnion<Awaited<T>>>(scope: DP) => {
				const [locale] = useAtom(localeAtom);
				const [l, setL] = useState<Awaited<T>>({} as Awaited<T>);

				// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
				useEffect(() => {
					locales[locale ?? options?.defaultLocale ?? "pt-BR"]().then(
						(value) => {
							setL(value as Awaited<T>);
						},
					);
				}, [locale]);

				return <
					T extends FlattenedValueByPath<typeof l, DP>,
					V extends NestedValueByPath<typeof l, T>,
					S extends SpliParameters<V extends string ? V : "">,
				>(
					key: T,
					params?: S,
				) => {
					return retrieveScopeValueAtPath({
						obj: l,
						scope,
						path: key,
						params,
					});
				};
			},
			setLocale: (newLocale: keyof typeof locales) => {
				const [l, setL] = useAtom(localeAtom);
				setL(newLocale);
			},
		},
		server: {
			getI18n: async () => {
				const value = await locale();
				return <
					T extends DeepKeyStringUnion<typeof value>,
					V extends NestedValueByPath<typeof value, T>,
					S extends SpliParameters<V extends string ? V : "">,
				>(
					key: T,
					params?: S,
				) => {
					return retrieveValueAtPath({
						obj: value,
						path: key,
						params,
					});
				};
			},
			getScopedI18n: async <DP extends DeepKeyUnion<Awaited<T>>>(scope: DP) => {
				const value = (await locale()) as Awaited<T>;
				return <
					T extends FlattenedValueByPath<typeof value, DP>,
					V extends NestedValueByPath<typeof value, T>,
					S extends SpliParameters<V extends string ? V : "">,
				>(
					key: T,
					params?: S,
				) => {
					return retrieveScopeValueAtPath({
						obj: value,
						scope,
						path: key,
						params,
					});
				};
			},
		},
		t: (key: DeepKeyStringUnion<Awaited<T>>) => {
			return key;
		},
		scopedT: <DP extends DeepKeyUnion<Awaited<T>>>(scope: DP) => {
			return (key: FlattenedValueByPath<Awaited<T>, DP>) => {
				return `${scope}.${key}`;
			};
		},
	};
};
