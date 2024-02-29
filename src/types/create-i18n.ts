export type CreateI18nProps<T> = T extends {
	[K in keyof T]: T[K] extends () => Promise<infer R>
		? R extends Record<string, unknown>
			? T[K]
			: never
		: never;
}
	? T
	: never;

export type CreateI18nOptions<T extends Record<string, unknown>> = {
	storedLocale: {
		get: () => Promise<string>;
		set: (locale: string) => Promise<void>;
	};
};
