export type DeepKeyUnion<
	T extends Record<string, unknown>,
	Key extends keyof T = keyof T,
> = Key extends string
	? T[Key] extends Record<string, unknown>
		? `${Key}` | `${Key}.${DeepKeyUnion<T[Key]>}`
		: never
	: never;

export type DeepKeyStringUnion<
	T extends Record<string, unknown>,
	Key extends keyof T = keyof T,
> = Key extends string
	? T[Key] extends Record<string, unknown>
		? `${Key}.${DeepKeyStringUnion<T[Key]>}`
		: `${Key}`
	: never;

export type NestedKeysAndValuesUnion<
	T extends Record<string, unknown>,
	Key extends keyof T = keyof T,
> = Key extends string
	? T[Key] extends Record<string, unknown>
		? `${Key}` | `${Key}.${DeepKeyStringUnion<T[Key]>}`
		: `${Key}`
	: never;

export type NestedValueByPath<
	T extends Record<string, unknown>,
	K,
> = K extends `${infer Key}.${infer Rest}`
	? Key extends keyof T
		? T[Key] extends Record<string, unknown>
			? Rest extends DeepKeyUnion<T[Key]> | DeepKeyStringUnion<T[Key]>
				? NestedValueByPath<T[Key], Rest>
				: never
			: never
		: never
	: K extends keyof T
	  ? T[K]
	  : never;

export type FlattenedValueByPath<
	T extends Record<string, unknown>,
	K extends DeepKeyUnion<T>,
> = K extends `${infer Key}.${infer Rest}`
	? Key extends keyof T
		? T[Key] extends Record<string, unknown>
			? Rest extends DeepKeyUnion<T[Key]>
				? FlattenedValueByPath<T[Key], Rest>
				: never
			: never
		: never
	: K extends keyof T
	  ? T[K] extends Record<string, unknown>
			? DeepKeyStringUnion<T[K]>
			: never
	  : never;

