import { defineConfig } from "astro/config";
import glsl from "vite-plugin-glsl";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
	site: "https://jsulpis.github.io",
	base: "/talk-color-science",
	integrations: [svelte()],
	vite: {
		plugins: [glsl()],
	},
});
