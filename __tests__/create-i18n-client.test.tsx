import { describe, expect, test } from "vitest";
import { act,  renderHook, waitFor } from "@testing-library/react";
import { createClientI18n } from "../src/create/client";

describe("create-i18n-client", () => {
	const { useI18n, useScopedI18n, Provider, useChangeLocale } =
		createClientI18n(
			{
				"pt-BR": () => import("./utils/pt-br").then((module) => module.default),
				"en-US": () => import("./utils/en").then((module) => module.default),
			},
			{
				defaultLocale: "pt-BR",
				storedLocale: {
					get: async () => 'pt-BR',
					set: async (locale) => {},
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
		const { result: i18nResult } = renderHook(
			() => {
				const changeLocale = useChangeLocale();
				const i18n = useI18n();
				return { i18n, changeLocale };
			},
			{
				wrapper: Provider,
			},
		);
		
		await waitFor(() => {
			// @ts-ignore
			expect(i18nResult.current.i18n("notfound")).toBe("notfound");
		});

		act(() => {
			i18nResult.current.changeLocale('en-USa')
		})

		await waitFor(() => {
			// @ts-ignore
			expect(i18nResult.current.i18n("notfound")).toBe("notfound");
		});
	});

	test("it change locale", async () => {
		const { result: i18nResult } = renderHook(
			() => {
				const changeLocale = useChangeLocale();
				const i18n = useI18n();
				return { i18n, changeLocale };
			},
			{
				wrapper: Provider,
			},
		);

		await waitFor(() => {
			expect(i18nResult.current.i18n("globals.usert_types.admin")).toBe(
				"Admin",
			);
		});

		// act(() => {
		// 	i18nResult.current.changeLocale("en-US"); // Altera a localidade
		// });

		// await waitFor(() => {
		// 	expect(i18nResult.current.i18n("globals.usert_types.admin")).toBe(
		// 		"Admin2",
		// 	);
		// });
	});
});
