export type CreateI18nProps<T extends Record<string, unknown>> = Record<
	string,
	() => Promise<T>
>;

export type CreateI18nOptions<T extends Record<string, unknown>> = {
	defaultLocale?: keyof T;
};