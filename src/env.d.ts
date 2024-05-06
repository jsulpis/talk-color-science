/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare module "*.glsl" {
	const shaderSource: string;
	export default shaderSource;
}

declare module "*.frag" {
	const shaderSource: string;
	export default shaderSource;
}

declare module "*.vert" {
	const shaderSource: string;
	export default shaderSource;
}
