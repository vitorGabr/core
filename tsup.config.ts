import { defineConfig } from "tsup";

export default defineConfig(({
	entry: [
		"src/create/client.tsx",
		"src/create/server.ts",
		"src/create/default.ts",
	],
	minify: true,
	external: ['react'],
	sourcemap: true,
	dts: true,
	format: ['esm', 'cjs'],
	esbuildOptions(options) {
	  options.banner = {
		js: '"use client"',
	  }
	},
}));
