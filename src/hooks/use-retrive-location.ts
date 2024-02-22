import { useAtom } from "jotai";
import { useState, useEffect } from "react";
import { localeAtom } from "../atoms/locale-atom";
import type { CreateI18nProps, CreateI18nOptions } from "../types/create-i18n";

export function useRetrieveLocation<T extends Record<string, unknown>>(
	locales: CreateI18nProps<T>,
	options?: CreateI18nOptions<typeof locales>,
) {
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

    return l;
}