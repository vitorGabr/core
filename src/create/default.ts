import type { CreateI18nProps } from "../types/create-i18n";
import type {
   DeepKeyStringUnion,
   DeepKeyUnion,
   FlattenedValueByPath,
} from "../types/flatten-types";


export const createDefaultI18n = <T extends Record<string, unknown>>(
	locales: CreateI18nProps<T>,
) => {
    const locale = Object.values(locales)[0]() as Awaited<T>;

	return {
		t: (key: DeepKeyStringUnion<Awaited<typeof locale>>) => {
			return key;
		},
		scopedT: <DP extends DeepKeyUnion<Awaited<typeof locale>>>(scope: DP) => {
			return (key: FlattenedValueByPath<Awaited<typeof locale>, DP>) => {
				return `${scope}.${key}`;
			};
		},
	};
};
