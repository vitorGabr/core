export type ImportedLocales = Record<string,Promise<{
	default: Record<string, unknown>;
}>>;

export type Locale<T extends ImportedLocales[keyof ImportedLocales]> =
	T extends Promise<infer R>
		? R extends { default: infer T }
			? T extends Record<string, unknown>
				? T
				: never
			: never
		: never;

export type LocaleOptions<T extends Record<string, unknown>> = {
	defaultLocale: keyof T;
	storedLocale: {
		get: () => (string | Promise<string | null | undefined> | null | undefined);
		set: (locale: string) => Promise<void>;
	};
};

export type LocaleServerOptions<T extends Record<string, unknown>> = Omit<
	LocaleOptions<T>,
	"storedLocale"
> & {
	storedLocale: Omit<LocaleOptions<T>["storedLocale"], "set">;
};
