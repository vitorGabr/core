import { describe, expect, test } from "vitest";
import { createI18n } from "../src";

describe("flatten objects", () => {
	const { t,scopedT } = createI18n({
		"pt-BR": () => import("./utils/pt-br").then((module) => module.default),
	});

	test("it show same path key", async () => {
        expect(t("globals.usert_types.admin")).toBe("globals.usert_types.admin");
    })

    test("it show same scoped path key", async () => {
        expect(scopedT("globals.usert_types")("admin")).toBe("globals.usert_types.admin");
    })
});