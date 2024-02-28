import { defineConfig } from "tsup";

export default defineConfig((options) => ({
	entry: [
		"src/create/client.tsx",
		"src/create/server.ts",
		"src/create/default.ts",
	],
	treeshake: true,
	splitting: true,
	dts: true,
	minify: true,
	clean: true,
	external: ["react"],
	outDir: "dist",
}));
