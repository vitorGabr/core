import { defineConfig } from "tsup";
import react18Plugin from "esbuild-plugin-react18";

export default defineConfig((options) => ({
	entry: ["src/create"],
	sourcemap: true,
    minify: !options.watch,
	treeshake: true,
	splitting: true,
	clean: true,
	dts: true,
    esbuildPlugins: [react18Plugin()],
    legacyOutput: true,
}));
