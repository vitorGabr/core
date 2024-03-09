import { useParams } from "@tanstack/react-router";
import { createClientI18n } from "lingo-ts";

export const { useI18n, I18nProvider, useChangeLocale } = createClientI18n(
	{
		"pt-br": () => import("./pt-br"),
		en: () => import("./en"),
	},
	{
		defaultLocale: "pt-br",
		persistentLocale: {
			get: () => {
				const params = useParams({ strict: false })
				//@ts-ignore
				if (params.locale) {
					//@ts-ignore
					return params.locale;
				}

				return null
			},
		},
	},
);
