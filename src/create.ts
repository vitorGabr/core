import { useEffect, useState } from "react";
import { retrieveValueAtPath, retrieveScopeValueAtPath } from "./functions";
import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
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
				const [l, setL] = useState<Awaited<T> | null>(null);

				// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
				useEffect(() => {
					locales[locale ?? options?.defaultLocale ?? 'pt-BR']().then((value) => {
						setL(value as Awaited<T>);
					});
				}, [locale]);

				return (key: DeepKeyStringUnion<Awaited<T>>) => {
					if (!l) return "";
					return retrieveValueAtPath({
						obj: l as Awaited<T>,
						path: key,
					});
				};
			},
			useScopedI18n: <DP extends DeepKeyUnion<Awaited<T>>>(scope: DP) => {
				const [locale] = useAtom(localeAtom);
				const [l, setL] = useState<Awaited<T> | null>(null);

				// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
				useEffect(() => {
					locales[locale ?? options?.defaultLocale ?? 'pt-BR']().then((value) => {
						setL(value as Awaited<T>);
					});
				}, [locale]);

				return (key: FlattenedValueByPath<Awaited<T>, DP>) => {
					return retrieveScopeValueAtPath({
						obj: l as Awaited<T>,
						scope,
						path: key,
					});
				};
			},
			setLocale: (newLocale: keyof typeof locales) => {
				const [l, setL] = useAtom(localeAtom);
				setL(newLocale);
			}
		},
		server: {
			getI18n: async () => {
				const value = await locale();
				return (key: DeepKeyStringUnion<typeof value>) => {
					return retrieveValueAtPath({
						obj: value,
						path: key,
					});
				};
			},
			getScopedI18n: async <DP extends DeepKeyUnion<Awaited<T>>>(scope: DP) => {
				const value = (await locale()) as Awaited<T>;
				return (key: FlattenedValueByPath<Awaited<T>, DP>) => {
					return retrieveScopeValueAtPath({
						obj: value,
						scope,
						path: key,
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
		}
	};
};
