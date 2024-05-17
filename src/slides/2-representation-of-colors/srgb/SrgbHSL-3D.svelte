<script lang="ts">
	import { onMount } from "svelte";
	import fragment from "./hsl-3d.frag";
	import { useGlslCanvas } from "../../../webgl/renderer";
	import hsl from "../assets/hsl.png";

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

<div class="container">
	<canvas
		bind:this={canvas}
		on:click={() => (isPlaying.value ? pause() : play())}
	/>
	<img src={hsl.src} class="fragment" alt="" />
</div>

<style lang="scss">
	.container {
		display: inline-flex;
		position: relative;
		margin-top: -2%;
	}
	canvas {
		width: 50dvw;
		aspect-ratio: 1;
	}
	img {
		position: absolute;
		inset: 0;
	}
</style>
