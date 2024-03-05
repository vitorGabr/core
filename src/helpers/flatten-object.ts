import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
} from "../types/flatten-types";

/**
 * Flattens an object to retrieve a value at a specified path.
 * @param {ObjectType} obj - The object to flatten.
 * @param {string} path - The path to the value.
 * @param {Record<string, string>} params - Optional parameters for string interpolation.
 * @returns {string} The value at the specified path.
 */
function flatten<
	ObjectType extends Record<string, unknown>,
	Path extends string,
>(obj: ObjectType, path: Path, params: Record<string, string> = {}): string {
	const keys = `${path}`.split(".");
	let newObj = obj as ObjectType | string;

	for (const key of keys) {
		if (typeof newObj !== "string" && newObj[key]) {
			newObj = newObj[key] as ObjectType | string;
		} else {
			newObj = path;
			break;
		}
	}

	newObj = `${newObj}`.replace(/{([^}]+)}/g, (match, p1) =>
		params[p1] ? params[p1] : match,
	);

	return newObj as string;
}

/**
 * Retrieves a value from an object at a specified path.
 * @param {ObjectType} obj - The object to retrieve the value from.
 * @param {Path} path - The path to the value.
 * @param {Record<string, string>} params - Optional parameters for string interpolation.
 * @returns {string} The value at the specified path.
 */
export function retrieveValueAtPath<
	ObjectType extends Record<string, unknown>,
	Path extends DeepKeyStringUnion<ObjectType>,
>({
	obj,
	path,
	params = {},
}: { obj: ObjectType; path: Path; params?: Record<string, string> }): string {
	return flatten(obj, path, params);
}

/**
 * Retrieves a scoped value from an object at a specified path.
 * @param {ObjectType} obj - The object to retrieve the value from.
 * @param {Scope} scope - The scope of the value.
 * @param {Path} path - The path to the value within the scope.
 * @param {Record<string, string>} params - Optional parameters for string interpolation.
 * @returns {string} The value at the specified scoped path.
 */
export function retrieveScopeValueAtPath<
	ObjectType extends Record<string, unknown>,
	Scope extends DeepKeyUnion<ObjectType>,
>({
	obj,
	scope,
	path,
	params = {},
}: {
	obj: ObjectType;
	scope?: Scope;
	path: FlattenedValueByPath<ObjectType, Scope>;
	params?: Record<string, string>;
}): string {
	return flatten(obj, `${scope}.${path}`, params);
}
