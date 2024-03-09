import { createServerI18n } from "lingo-ts";
import { headers } from "next/headers";

export const { getI18n} = createServerI18n(
	{
		"pt-br": () => import("./pt-br"),
		en: () => import("./en"),
	},
	{
		defaultLocale: "pt-br",
		persistentLocale: {
			get: () => headers().get("x-locale")
		},
	},
);
