import { describe, expect, test } from "vitest";
import { createServerI18n } from "../src/create/server";

describe("create-i18n-server", () => {
	const { getI18n, getScopedI18n } = createServerI18n(
		{
			"pt-BR": () => import("./utils/pt-br").then((module) => module.default),
		},
		{
			storedLocale: {
				get: async () => "pt-BR",
				set: async () => {},
			}
		},
	);

	test("it translate function work", async () => {
		const t = await getI18n();
		const a = t("globals.usert_types.test", {
			name: "Teste",
			a: "Teste",
		});
		expect(a).toBe("Teste Teste Teste");
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
