import type {
	DeepKeyStringUnion,
	DeepKeyUnion,
	FlattenedValueByPath,
} from "../types";


export function createT<
	ObjectType extends Record<string, unknown>,
	Path extends DeepKeyStringUnion<ObjectType>,
	Scope extends DeepKeyUnion<ObjectType>,
>(
	props: { obj: ObjectType; params?: Record<string, string> } & (
		| {
				path: Path;
		  }
		| {
				scope: Scope;
				path: FlattenedValueByPath<ObjectType, Scope>;
		  }
	),
) {
	let path: string = props.path;
	const params = props.params || {};

	if ("scope" in props) {
		path = `${props.scope}.${props.path}`;
	}

	const keys = `${path}`.split(".");
	let newObj = props.obj as ObjectType | string;

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
