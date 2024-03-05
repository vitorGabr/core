import { describe, expect, test } from "vitest";
import { createDefaultI18n } from "../src/create/default";

describe("flatten objects", () => {
	const { t,scopedT } = createDefaultI18n({
		"pt-BR": () => import("./utils/pt-br"),
	});

	test("it show same path key", async () => {
        expect(t("globals.usert_types.admin")).toBe("globals.usert_types.admin");
    })

    test("it show same scoped path key", async () => {
        expect(scopedT("globals.usert_types")("admin")).toBe("globals.usert_types.admin");
    })
});