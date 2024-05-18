<script lang="ts">
	import { onMount } from "svelte";
	import fragmentRgb from "../../2-representation-of-colors/srgb/rgb-3d.frag";
	import fragmentHsl from "../../2-representation-of-colors/srgb/hsl-3d.frag";
	import fragmentHsv from "../../2-representation-of-colors/srgb/hsv-3d.frag";
	import { useGlslCanvas } from "../../../webgl/renderer";
	import srgb from "../assets/srgb.mov";

	let canvasRgb: HTMLCanvasElement;
	let canvasHsl: HTMLCanvasElement;
	let canvasHsv: HTMLCanvasElement;

	onMount(() => {
		useGlslCanvas({ canvas: canvasRgb, fragment: fragmentRgb, animate: true });
		useGlslCanvas({ canvas: canvasHsl, fragment: fragmentHsl, animate: true });
		useGlslCanvas({ canvas: canvasHsv, fragment: fragmentHsv, animate: true });
	});
</script>

<div class="container">
	<div class="srgb">
		<figure>
			<figcaption>sRGB / RGB</figcaption>
			<canvas bind:this={canvasRgb} />
		</figure>
		<figure>
			<figcaption>sRGB / HSL</figcaption>
			<canvas bind:this={canvasHsl} />
		</figure>
		<figure>
			<figcaption>sRGB / HSB</figcaption>
			<canvas bind:this={canvasHsv} />
		</figure>
	</div>
	<figure>
		<!-- made from https://www.shadertoy.com/view/XddGRN -->
		<video data-src={srgb} loop data-autoplay></video>
		<figcaption>sRGB / LCH</figcaption>
	</figure>
</div>

<style lang="scss">
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100dvh;
		padding-left: 5%;
	}
	.srgb {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		figure {
			display: flex;
			align-items: center;
		}
		figcaption {
			font-size: 2rem;
		}
	}
	canvas {
		height: 33dvh;
		aspect-ratio: 1;
	}
	figure {
		margin: 0;
	}
	figcaption {
		display: block;
		margin-top: -1.5em;
		font-size: 3rem;
		font-weight: bold;
		white-space: nowrap;
	}
	video {
		margin-bottom: 1rem;
	}
</style>
