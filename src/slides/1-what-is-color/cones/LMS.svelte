<script lang="ts">
	import { useGlslCanvas } from "../../../webgl/renderer";
	import fragment from "./lms.frag";
	import common from "./lms.common.frag";
	import lmsNormalized from "../assets/lms-normalized.png";
	import { onMount } from "svelte";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		useGlslCanvas({
			canvas,
			fragment: common + "\n" + fragment,
		});
	});
</script>

<div class="container">
	<canvas bind:this={canvas}></canvas>
	<img src={lmsNormalized.src} alt="" />
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
