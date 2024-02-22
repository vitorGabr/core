import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
	NestedValueByPath,
} from "../types/flatten-types";

export function flatten<T extends Record<string, unknown>, P extends string>(
	obj: T,
	path: P,
	params: Record<string, string> = {},
): NestedValueByPath<T, P> {
	const keys = `${path}`.split(".");
	let newObj = obj as T | string;

	for (const key of keys) {
		if (typeof newObj !== "string" && newObj[key]) {
			newObj = newObj[key] as T | string;
		} else {
			newObj = path;
			break;
		}
	}

	newObj = `${newObj}`.replace(/{([^}]+)}/g, (match, p1) =>
		params[p1] ? params[p1] : match,
	);

	return newObj as NestedValueByPath<T, P>;
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
