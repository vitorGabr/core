import { createI18n } from "src";
import { describe, expect, test } from "vitest";

describe("createI18n", () => {
	const { server} = createI18n({
		"pt-BR": () => import("./utils/pt-br").then((module) => module.default),
	});

	describe("server", () => {
		test("it translate function work", async () => {
			const t = await server.getI18n();
	
			expect(t("globals.usert_types.admin")).toBe("Admin");
		});
	
		test("it scoped translate function work", async () => {
			const t = await server.getScopedI18n("globals.usert_types");
			expect(t("admin")).toBe("Admin");
		});
	
		test('it show path when not found', async () => {
			const t = await server.getScopedI18n("globals.usert_types");
	
			// @ts-expect-error - testing purpose
			expect(t("notfound")).toBe("globals.usert_types.notfound");
		});
	});


});
