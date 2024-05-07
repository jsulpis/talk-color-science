<script lang="ts">
	import { onMount } from "svelte";
	import { useGlslCanvas } from "../../../webgl/renderer";
	import fragment from "./wave.frag";
	import Arrow from "../../../components/Arrow.svelte";
	import MonochromaticWaveCanvas from "./MonochromaticWaveCanvas.svelte";

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
	<MonochromaticWaveCanvas class="canvas" />
</div>

<style lang="scss">
	.container :global(.canvas) {
		width: min(90%, 1400px);
	}
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
</style>
