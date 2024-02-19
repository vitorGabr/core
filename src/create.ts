import { useEffect, useState } from "react";
import {
	retrieveValueAtPath,
	retrieveScopeValueAtPath,
} from "./functions";
import type { DeepKeyStringUnion, DeepKeyUnion, FlattenedValueByPath } from "./types";

export const createI18n = <T extends Record<string, unknown>>(locales: {
	[key: string]: () => Promise<T>;
}) => {
	const locale = locales["pt-BR"]();

	return {
		client: {
			useI18n: () => {
				const [l, setL] = useState<Awaited<T> | null>(null);
				useEffect(() => {
					locale.then((value) => {
						setL(value as Awaited<T>);
					});
				}, []);

				return (key: DeepKeyStringUnion<Awaited<T>>) => {
					return retrieveValueAtPath({
						obj: l as Awaited<T>,
						path: key,
					});
				};
			},
			useScopedI18n: <DP extends DeepKeyUnion<Awaited<T>>>(scope: DP) => {
				const [l, setL] = useState<Awaited<T> | null>(null);
				useEffect(() => {
					locale.then((value) => {
						setL(value as Awaited<T>);
					});
				}, []);

				return (key: FlattenedValueByPath<Awaited<T>, DP>) => {
					return retrieveScopeValueAtPath({
						obj: l as Awaited<T>,
						scope,
						path: key,
					});
				};
			},
		},
		server: {
			getI18n: async () => {
				const value = await locale;
				return (key: DeepKeyStringUnion<typeof value>) => {
					return retrieveValueAtPath({
						obj: value,
						path: key,
					});
				};
			},
			getScopedI18n: async <DP extends DeepKeyUnion<Awaited<T>>>(scope: DP) => {
				const value = (await locale) as Awaited<T>;
				return (key: FlattenedValueByPath<Awaited<T>, DP>) => {
					return retrieveScopeValueAtPath({
						obj: value,
						scope,
						path: key,
					});
				};
			},
		},
	};
};
