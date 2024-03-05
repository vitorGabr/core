import { defineConfig } from "tsup";

export default defineConfig(({
	entry: [
		"src/index.tsx",
	],
	dts: true,
	clean: true,
	splitting: true,
	external: ['react'],
}));
