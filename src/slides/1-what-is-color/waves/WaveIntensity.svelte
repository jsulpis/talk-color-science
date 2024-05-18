<script lang="ts">
	import { onMount } from "svelte";
	import { useGlslCanvas } from "../../../webgl/renderer";
	import fragment from "./wave-intensity.frag";
	import lmsNormalized from "../assets/intensity.png";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		useGlslCanvas({ canvas, fragment });
	});
</script>

<div class="container">
	<canvas bind:this={canvas}></canvas>
	<img data-src={lmsNormalized.src} alt="" />
</div>

<style>
	.container {
		position: relative;
		width: min(70%, 1200px);
		margin: auto;
	}
	canvas {
		width: 100%;
		aspect-ratio: 2;
	}
	img {
		position: absolute;
		width: 120%;
		left: -6%;
		bottom: -5.5%;
		max-width: none;
		max-height: none;
	}
</style>
