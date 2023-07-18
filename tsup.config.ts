import { defineConfig } from "tsup";
import type { Options } from "tsup";

export default defineConfig(() => {
	let options: Options = {
		entry: ["src/index.ts"],
		sourcemap: true,
		external: [],
		tsconfig: "./tsconfig.json",
		dts: true,
	};

	return [
		{
			...options,
			format: "cjs",
		},

		{
			...options,
			format: "esm",
		},
	];
});