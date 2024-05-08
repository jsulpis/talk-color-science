<script lang="ts">
	import { useGlslCanvas } from "../../../webgl/renderer";
	import fragment from "./cie-rgb.frag";
	import ciergb from "../assets/cie-rgb.png";
	import { onMount } from "svelte";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		useGlslCanvas({ canvas, fragment });
	});
</script>

<div class="container">
	<canvas bind:this={canvas}></canvas>
	<img src={ciergb.src} alt="" />
</div>

<style>
	.container {
		position: relative;
		width: min(70%, 1200px);
		margin: 2% auto 0;
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
