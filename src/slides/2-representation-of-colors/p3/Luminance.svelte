<script lang="ts">
	import { useGlslCanvas } from "../../../webgl/renderer";
	import fragment from "./luminance.frag";
	import { onMount } from "svelte";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		useGlslCanvas({ canvas, fragment });
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		position: relative;
		width: min(70%, 1200px);
		margin: 2% auto 0;
		aspect-ratio: 2;
	}
</style>
