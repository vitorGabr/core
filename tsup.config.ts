import { defineConfig } from "tsup";

export default defineConfig(({
	entry: [
		"src/index.ts",
		"src/create/client.tsx",
		"src/create/server.ts",
		"src/create/default.ts",
	],
	dts: true,
	clean: true,
	splitting: true,
	external: ['react'],
}));
