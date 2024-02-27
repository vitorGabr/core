import { describe, expect, test } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createClientI18n } from "../src/create/client";


describe("create-i18n-client", () => {
	const { useI18n, useScopedI18n, Provider } = createClientI18n(
		{
			"pt-BR": () => import("./utils/pt-br").then((module) => module.default),
		},
		{
			defaultLocale: "pt-BR",
			storedLocale: {
				get: async () => "pt-BR",
				set: async () => {},
			},
		},
	);
	test("it translate function work", async () => {
		const { result } = renderHook(() => useI18n(), {
			wrapper: Provider,
		});
		await waitFor(() => {
			expect(result.current("globals.usert_types.admin")).toBe("Admin");
		});
	});

	test("it scoped translate function work", async () => {
		const { result } = renderHook(() => useScopedI18n("globals"), {
			wrapper: Provider,
		});
		await waitFor(() => {
			expect(result.current("usert_types.admin")).toBe("Admin");
		});
	});

	test("it show path when not found", async () => {
		const { result } = renderHook(() => useScopedI18n("globals"), {
			wrapper: Provider,
		});
		await waitFor(() => {
			// @ts-expect-error - testing purpose
			expect(result.current("notfound")).toBe("globals.notfound");
		});
	});
});
