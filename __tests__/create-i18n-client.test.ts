import { describe, expect, test } from "vitest";
import { createI18n } from "../src";
import { renderHook } from '@testing-library/react-hooks'

describe("create-i18n-client", () => {
	const { client } = createI18n({
		"pt-BR": () => import("./utils/pt-br").then((module) => module.default),
	});

	test("it translate function work", async () => {
		const {result,waitForNextUpdate} = renderHook(() => client.useI18n());
		await waitForNextUpdate();
		expect(result.current("globals.usert_types.admin")).toBe("Admin");
	});

	test("it scoped translate function work", async () => {
		const {result,waitForNextUpdate} = renderHook(() => client.useScopedI18n("globals"));
		await waitForNextUpdate();
		expect(result.current("usert_types.admin")).toBe("Admin");
	});

	test("it scoped translate function work", async () => {
		const {result,waitForNextUpdate} = renderHook(() => client.useScopedI18n("globals"));
		await waitForNextUpdate();
		expect(result.current("usert_types.admin")).toBe("Admin");
	});


});
