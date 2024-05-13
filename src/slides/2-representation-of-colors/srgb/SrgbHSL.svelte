<script>
	import { onMount } from "svelte";
	import iro from "@jaames/iro";

	let color = "#b524ff";
	let colorHsl = { h: 280, s: 86, l: 100 };
	let picker;

	onMount(() => {
		const colorPicker = new iro.ColorPicker(picker, {
			color,
			borderWidth: 2,
			borderColor: "#fff",
			layoutDirection: "horizontal",
			handleRadius: 20,
			sliderSize: 70,
			width: 350,
			margin: 20,
			layout: [
				{ component: iro.ui.Box },
				{
					component: iro.ui.Slider,
					options: {
						sliderType: "hue",
					},
				},
			],
		});

		colorPicker.on("color:change", (value) => {
			color = value.hexString;
			colorHsl = value.hsl;
		});
	});
</script>

<div>
	<div class="container" style={`--color: ${color}`}>
		<span class="circle"></span>
		<div class="picker hsv" bind:this={picker}></div>
	</div>
	<strong>
		{`hsl(${colorHsl.h.toFixed(0)}deg,
		${colorHsl.s.toFixed(0)}%,
		${colorHsl.l.toFixed(0)}%)`}
	</strong>
</div>

<style lang="scss">
	.container {
		display: flex;
		justify-content: center;
		gap: 10dvw;
		align-items: center;
	}

	.circle {
		background: var(--color);
		display: block;
		width: calc(30vmin);
		aspect-ratio: 1;
		border-radius: 100%;
		box-shadow: inset 0 0 4px black;
		mix-blend-mode: screen;
		transition: transform var(--animation-duration) var(--ease-in-out);
	}
	strong {
		display: block;
		margin-top: 1em;
		font-size: 4rem;
	}
</style>
