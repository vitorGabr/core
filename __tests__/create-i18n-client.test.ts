import { describe, expect, test } from "vitest";
import { createI18n } from "../src";
import { renderHook, waitFor } from "@testing-library/react";

describe("create-i18n-client", () => {
	const { client } = createI18n({
		"pt-BR": () => import("./utils/pt-br").then((module) => module.default),
	});

	test("it translate function work", async () => {
		const { result } = renderHook(() => client.useI18n());
		await waitFor(() => {
			expect(result.current("globals.usert_types.admin")).toBe("Admin");
		});
	});

	test("it scoped translate function work", async () => {
		const {result} = renderHook(() => client.useScopedI18n("globals"));
		await waitFor(() => {
			expect(result.current("usert_types.admin")).toBe("Admin");
		});
	});

	test("it show path when not found", async () => {
		const {result} = renderHook(() => client.useScopedI18n("globals"));
		await waitFor(() => {
			// @ts-expect-error - testing purpose
			expect(result.current("notfound")).toBe("globals.notfound");
		});
	});
});
