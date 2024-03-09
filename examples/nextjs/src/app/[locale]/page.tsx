import { getI18n } from "@/locale/server";
import { ChangeLocaleButton } from "./client-locale";

export default async function Home() {
	const t = await getI18n();
	return (
		<main
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				flexDirection: "column",
			}}
		>
			{t("hello")}
			<ChangeLocaleButton />
		</main>
	);
}
