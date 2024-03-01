import { defineConfig } from "tsup";

export default defineConfig(({
	entry: [
		"src/create/index.ts",
	],
	dts: true,
	clean: true,
	splitting: true,
	external: ['react'],
}));
