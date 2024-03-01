import { defineConfig } from "tsup";

export default defineConfig(({
	entry: [
		"src/index.ts",
		"src/create/client/index.tsx",
		"src/create/server/index.ts",
		"src/create/default/index.ts",
	],
	dts: true,
	clean: true,
	splitting: true,
	external: ['react'],
}));
