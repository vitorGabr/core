import { describe, expectTypeOf, test } from "vitest";
import { createDefaultI18n, createServerI18n } from "../src";

describe("types", () => {
	const { t, scopedT } = createDefaultI18n(
		{
			"pt-BR": () => import("./utils/pt-br").then((module) => module.default),
		},
	);

	test("it should work", async () => {
		type Key = Parameters<typeof t>[0];
		type Function = (k: Key) => string;

		type PossibleKeys =
			| "globals.usert_types.admin"
			| "globals.usert_types.default"
			| "globals.usert_types.manager"
			| "globals.usert_types.realtor"
			| "globals.usert_types.test"
			| "globals.usert_types.nested.deep.key";

		expectTypeOf<Function>().parameters.toEqualTypeOf<[PossibleKeys]>();
	});

	test("it should work with nested keys", async () => {
		const t = scopedT("globals.usert_types");
		type Key = Parameters<typeof t>[0];
		type Function = (k: Key) => string;

		type PossibleKeys =
			| "admin"
			| "default"
			| "manager"
			| "realtor"
			| "test"
			| "nested.deep.key";

		expectTypeOf<Function>().parameters.toEqualTypeOf<[PossibleKeys]>();
	});
});
