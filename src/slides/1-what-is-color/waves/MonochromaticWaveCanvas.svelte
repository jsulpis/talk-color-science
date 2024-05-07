<script lang="ts">
	import { onMount } from "svelte";
	import { useGlslCanvas } from "../../../webgl/renderer";
	import fragment from "./wave.frag";

	export let frequency = 7;
	export let amplitude = 1;
	export let frequency2 = 0;
	export let amplitude2 = 1;

	let canvas: HTMLCanvasElement;

	onMount(() => {
		useGlslCanvas({
			canvas,
			fragment,
			uniforms: {
				uFrequency: frequency,
				uFrequency2: frequency2,
				uAmplitude: amplitude,
				uAmplitude2: amplitude2,
			},
		});
	});
</script>

<canvas bind:this={canvas} {...$$restProps}></canvas>

<style lang="scss">
	canvas {
		aspect-ratio: 1200/900;
	}
</style>
