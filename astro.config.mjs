import { defineConfig } from "astro/config";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
	site: "https://jsulpis.github.io",
	base: "/talk-color-science",
	integrations: [svelte()],
});
