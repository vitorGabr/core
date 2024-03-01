export type ImportedLocales = {
	[K in string]: Promise<{
		default: Record<string, unknown>;
	}>;
};

export type Locale<T extends ImportedLocales[keyof ImportedLocales]> = T extends Promise<infer R>
	? R extends { default: infer T }
		? T
		: never
	: never;

export type LocaleOptions<T extends Record<string, unknown>> = {
	defaultLocale: keyof T;
	storedLocale: {
		get: () => Promise<string>;
		set: (locale: string) => Promise<void>;
	};
};
