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
	<img data-src={lmsNormalized.src} alt="" />
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
		width: 120%;
		left: -6%;
		bottom: 16.5%;
		max-width: none;
		max-height: none;
	}
</style>
