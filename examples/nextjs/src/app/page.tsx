import { getI18n } from "@/locale/server";

export default async function Home() {
	const t = await getI18n();
	return <main>{t("hello")}</main>;
}
