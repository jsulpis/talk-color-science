<script lang="ts">
	import { useGlslCanvas } from "../../../webgl/renderer";
	import fragment from "./cie-xyz.frag";
	import ciexyz from "../assets/cie-xyz.png";
	import { onMount } from "svelte";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		useGlslCanvas({ canvas, fragment });
	});
</script>

<div class="container">
	<canvas bind:this={canvas}></canvas>
	<img data-src={ciexyz.src} alt="" />
</div>

<style>
	.container {
		position: relative;
		width: min(70%, 1200px);
		margin-inline: auto;
		margin-top: -2%;
	}
	canvas {
		width: 100%;
		aspect-ratio: 1.5;
	}
	img {
		position: absolute;
		width: 130%;
		left: -11.5%;
		bottom: 1%;
		max-width: none;
		max-height: none;
	}
</style>
