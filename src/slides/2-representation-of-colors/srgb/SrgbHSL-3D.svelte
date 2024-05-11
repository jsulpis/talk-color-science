<script lang="ts">
	import { onMount } from "svelte";
	import fragment from "./hsl-3d.frag";
	import { useGlslCanvas } from "../../../webgl/renderer";

	let canvas: HTMLCanvasElement;
	let pause: Function;
	let play: Function;
	let isPlaying = { value: false };

	onMount(() => {
		({ pause, play, isPlaying } = useGlslCanvas({
			canvas,
			fragment,
			animate: true,
		}));
	});
</script>

<canvas
	bind:this={canvas}
	on:click={() => (isPlaying.value ? pause() : play())}
/>

<style lang="scss">
	canvas {
		width: 50dvw;
		aspect-ratio: 1;
		margin-top: -5%;
	}
</style>
