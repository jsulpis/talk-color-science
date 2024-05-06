<script lang="ts">
	import { onMount } from "svelte";
	import { useGlslCanvas } from "../../../webgl/renderer";
	import fragment from "./waves.frag";
	import Arrow from "../../../components/Arrow.svelte";

	let canvas: HTMLCanvasElement;

	onMount(() => {
		useGlslCanvas({ canvas, fragment });
	});
</script>

<div class="container">
	<div class="lambda fragment">
		<span class="symbol">
			<strong>λ</strong> (nm)
		</span>
		<Arrow />
	</div>
	<canvas bind:this={canvas}></canvas>
</div>

<style lang="scss">
	.lambda {
		position: absolute;
		left: 50%;
		bottom: 50%;
		transform: translate(-50%, max(-170%, -12vw));
		display: flex;
		flex-direction: column;
		width: min(21%, 300px);
		line-height: 1;
	}
	.symbol strong {
		font-size: 1.5em;
		font-weight: bold;
	}
	canvas {
		width: min(90%, 1400px);
		aspect-ratio: 1200/900;
	}
	svg {
		width: 100%;
		height: auto;
	}
</style>
