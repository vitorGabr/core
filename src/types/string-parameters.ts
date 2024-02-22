type StringToArray<S extends string> =
	S extends `{${infer Key}}${infer Rest}`
		? [Key, ...StringToArray<Rest>]
		: S extends `${infer _}${infer Rest}`
		  ? StringToArray<Rest>
		  : [];

type ArrayToObject<T extends string[]> = {
	[K in T[number]]: string;
};

export type StringParameters<S extends string> = ArrayToObject<StringToArray<S>>;