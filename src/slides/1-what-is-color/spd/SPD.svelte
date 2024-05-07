<script lang="ts">
	import { useGlslCanvas } from "../../../webgl/renderer";
	import fragment from "./spd.frag";
	import common from "./spd.common.frag";
	import { onMount } from "svelte";
	import Arrow from "../../../components/Arrow.svelte";

	let canvas: HTMLCanvasElement;

	export let mode: 1 | 2 | 3 | 4;

	onMount(() => {
		useGlslCanvas({
			canvas,
			fragment:
				common +
				"\n" +
				fragment.replace(
					/#define MODE (MONOCHROMATIC)/,
					`#define MODE ${mode}`,
				),
			animate: mode !== 4,
		});
	});
</script>

<div class="container">
	<canvas bind:this={canvas}></canvas>

	<div class="axis">
		<Arrow class="arrow" height={4} tip="right" />
		<span class="label">380</span>
		<span class="label">480</span>
		<span class="label">580</span>
		<span class="label">680</span>
		<span class="label">780</span>
		<span class="lambda"><strong>λ</strong>(nm)</span>
	</div>
</div>

<style lang="scss">
	.container {
		position: relative;
		font-size: 1.7rem;
		height: 100dvh;
	}
	canvas {
		height: 80dvh;
		width: 100dvw;
	}
	.axis {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateX(-45%);
		width: 70%;
		display: flex;
		justify-content: space-between;

		:global(.arrow) {
			position: absolute;
			top: 0;
			left: 50%;
			width: 115%;
			transform: translate(-50%, -50%);
		}

		.label {
			position: relative;
			line-height: 2em;

			&::before {
				content: "|";
				font-size: 0.5em;
				font-weight: bold;
				position: absolute;
				top: -2.1em;
				left: 50%;
				transform: translateX(-50%);
			}
		}

		.lambda {
			position: absolute;
			left: 104%;
			line-height: 2em;
			display: flex;
		}
	}
</style>
