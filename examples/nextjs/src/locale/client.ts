import { createClientI18n } from "lingo-ts";
import { useParams } from "next/navigation";

export const { useI18n, I18nProvider} = createClientI18n(
	{
		"pt-br": () => import("./pt-br"),
		en: () => import("./en"),
	},
	{
		defaultLocale: "pt-br",
		persistentLocale: {
			useLocale: () => {
				const params = useParams()
				if (params.locale) {
					return params.locale as string;
				}

				return null
			},
		},
	},
);
