import { defineConfig } from "tsup";

export default defineConfig((options) => ({
	entry: ["src/create"],
	sourcemap: true,
    minify: !options.watch,
	treeshake: true,
	splitting: true,
	clean: true,
	dts: true,
    legacyOutput: true,
}));
