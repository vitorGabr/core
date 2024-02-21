import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	NestedValueByPath,
} from "./types";

export function flatten<T extends Record<string, unknown>, P extends string>(
	obj: T,
	path: P,
	params: Record<string, string> = {},
) {
	const keys = `${path}`.split(".");
	let newObj = obj as T | string;
	for (const key of keys) {
		if (typeof newObj !== "string" && newObj[key]) {
			newObj = newObj[key] as T;
		} else {
			newObj = path;
		}
	}

	const regex = /{([^}]+)}/g;
	let match: RegExpExecArray | null = null;

	while ((match = regex.exec(`${newObj}`)) !== null) {
		console.log(match[0]);
		newObj = `${newObj}`.replace(
			match[0],
			params[match[1]] ? params[match[1]] : match[0],
		);
	}

	return `${newObj}` as NestedValueByPath<T, P>;
}

export function retrieveValueAtPath<
	T extends Record<string, unknown>,
	P extends DeepKeyStringUnion<T>,
>({
	obj,
	path,
	params = {},
}: {
	obj: T;
	path: P;
	params?: Record<string, string>;
}) {
	return flatten(obj, path, params);
}

export function retrieveScopeValueAtPath<
	T extends Record<string, unknown>,
	S extends DeepKeyUnion<T>,
>({
	obj,
	scope,
	path,
	params = {},
}: {
	obj: T;
	scope?: S;
	path: FlattenedValueByPath<T, S>;
	params?: Record<string, string>;
}) {
	return flatten(obj, `${scope}.${path}`, params);
}
