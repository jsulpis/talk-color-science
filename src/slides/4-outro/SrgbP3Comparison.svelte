<script lang="ts">
	import { useGlslCanvas } from "../../webgl/renderer";
	import fragment from "./hsv.frag";
	import { onMount } from "svelte";

	let canvas: HTMLCanvasElement;
	let canvasP3: HTMLCanvasElement;

	onMount(() => {
		useGlslCanvas({ canvas, fragment });
		useGlslCanvas({ canvas: canvasP3, fragment, colorSpace: "p3" });
	});
</script>

<figure>
	<figcaption>sRGB</figcaption>
	<canvas bind:this={canvas}></canvas>
</figure>
<figure>
	<figcaption>Display P3</figcaption>
	<canvas bind:this={canvasP3}></canvas>
</figure>

<style>
	figure {
		display: inline-grid;
		grid-template-columns: 20dvw 60dvw;
		align-items: center;
		font-weight: bold;
		color: white;
		margin: 0.5rem;
	}
	canvas {
		width: 100%;
		height: 25dvh;
		border-radius: 16px;
	}
</style>
