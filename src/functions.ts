import type { DeepKeyStringUnion, DeepKeyUnion, FlattenedValueByPath } from "./types";

function flatten<T extends Record<string, unknown>>(obj: T, path: string) {
	const keys = `${path}`.split(".");
	let newObj = obj as T | string;
	for (const key of keys) {
		newObj = path;
		if (typeof newObj !== "string" && newObj[key] !== undefined) {
			newObj = newObj[key];
		}
	}

	if (typeof newObj !== "string") {
		throw new Error("Invalid path");
	}

	return newObj;
}

export function retrieveValueAtPath<T extends Record<string, unknown>>({
	obj,
	path,
}: {
	obj: T;
	path: DeepKeyStringUnion<T>;
}): string {
	return flatten(obj, path);
}

export function retrieveScopeValueAtPath<
	T extends Record<string, unknown>,
	S extends DeepKeyUnion<T>,
>({
	obj,
	scope,
	path,
}: {
	obj: T;
	scope?: S;
	path: FlattenedValueByPath<T, S>;
}): string {
	return flatten(obj, `${scope}.${path}`);
}
