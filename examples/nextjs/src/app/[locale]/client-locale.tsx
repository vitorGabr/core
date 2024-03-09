"use client";

import { useI18n } from "@/locale/client";

export function ChangeLocaleButton() {
	const t = useI18n();
	return (
		<mark >
			{t("clientLocale")}
		</mark>
	);
}
