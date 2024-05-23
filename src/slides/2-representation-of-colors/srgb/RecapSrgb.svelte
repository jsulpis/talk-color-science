<script lang="ts">
	import { onMount } from "svelte";
	import fragmentRgb from "./rgb-3d.frag";
	import fragmentHsl from "./hsl-3d.frag";
	import fragmentHsv from "./hsv-3d.frag";
	import { useGlslCanvas } from "../../../webgl/renderer";

	let canvasRgb: HTMLCanvasElement;
	let canvasHsl: HTMLCanvasElement;
	let canvasHsv: HTMLCanvasElement;

	onMount(() => {
		useGlslCanvas({ canvas: canvasRgb, fragment: fragmentRgb, animate: true });
		useGlslCanvas({ canvas: canvasHsl, fragment: fragmentHsl, animate: true });
		useGlslCanvas({ canvas: canvasHsv, fragment: fragmentHsv, animate: true });
	});
</script>

<div class="container">
	<div>
		<canvas bind:this={canvasRgb} />
		<strong>RGB / Hexa</strong>
	</div>
	<div>
		<canvas bind:this={canvasHsl} />
		<strong>HSL</strong>
	</div>
	<div>
		<canvas bind:this={canvasHsv} />
		<strong>HSB</strong>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	canvas {
		width: 30dvw;
		margin-top: 10%;
		aspect-ratio: 1;
	}
	strong {
		display: block;
		margin-top: -1.5em;
		white-space: nowrap;
	}
</style>
