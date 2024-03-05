import type {  ImportedLocales } from "../types";
import type { LocaleOptions } from "../types/i18n";
import { client } from "./client";
import { server } from "./server";

export const createI18n = <Locales extends ImportedLocales>(
	locales: Locales,
	options: LocaleOptions<Locales>,
) => {
	const createServer = server(locales, options);
	const createClient = client(locales, options);

	return {
		server: createServer,
		client: createClient
	};
};

