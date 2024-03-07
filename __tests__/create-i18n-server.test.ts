import { describe, expect, test } from "vitest";
import { createServerI18n } from "../src/create/server";

describe("create-i18n-server", () => {
	const {
		getI18n,getScopedI18n,
	} = createServerI18n(
		{
			"pt-BR": ()=> import("./utils/pt-br"),
			"en-US": ()=>import("./utils/en"),
		},
		{
			defaultLocale: "pt-BR",
		},
	);
	test("it translate function work", async () => {
		const t = await getI18n();
		const a = t("globals.usert_types.admin");
		expect(a).toBe("Admin");
	});

	test("it scoped translate function work", async () => {
		const t = await getScopedI18n("globals.usert_types");
		expect(t("admin")).toBe("Admin");
	});

	test("it show path when not found", async () => {
		const t = await getScopedI18n("globals.usert_types");
		// @ts-expect-error - testing purpose
		expect(t("notfound")).toBe("globals.usert_types.notfound");
	});
});
