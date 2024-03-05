import { describe, expect, test } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { createI18n } from "../src/create";
import { Suspense } from "react";

describe("create-i18n-client", () => {
	const {client:{
		useI18n,
		Provider
	}} = createI18n(
		{
			"pt-BR": import("./utils/pt-br"),
			"en-US": import("./utils/en"),
		},
		{
			defaultLocale: "pt-BR",
			persistentLocale: {
				server: {
					get: () => "pt-BR",
					set: () => Promise.resolve(),
				},
				client: {
					get: () => "pt-BR",
					set: () => Promise.resolve(),
				},
			},
		},
	);

	
	test("it translate function work", async () => {
		const { result } = renderHook(() => useI18n(), {
			wrapper: ({ children }) => (
				<Provider>
					<Suspense>{children}</Suspense>
				</Provider>
			),
		});
		await waitFor(() => {
			expect(result.current("globals.usert_types.admin")).toBe("Admin");
		});
	});
});


