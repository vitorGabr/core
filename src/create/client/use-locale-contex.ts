import { useContext, type Context } from "react";
import type { ImportedLocales } from "../../types/i18n";
import type { LocaleContextType } from "./create-i18n-provider";

export function useLocaleContext<Locales extends ImportedLocales>(
	Context: Context<LocaleContextType<Locales> | null>,
) {
    const context = useContext(Context);

    if (!context) {
      throw new Error('Error');
    }

    return context;
}
