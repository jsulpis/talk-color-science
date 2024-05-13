<script>
	import { onMount } from "svelte";
	import iro from "@jaames/iro";

	let color = "#b524ff";
	let colorHsv = { h: 280, s: 86, v: 100 };
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
			colorHsv = value.hsv;
		});
	});
</script>

<div>
	<div class="container">
		<div class="circle" style:background={color}></div>
		<div class="picker hsv" bind:this={picker}></div>
	</div>
	<strong>
		{`hsb(${colorHsv.h.toFixed(0)}deg,
		${colorHsv.s.toFixed(0)}%,
		${colorHsv.v.toFixed(0)}%)`}
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
		width: calc(30vmin);
		aspect-ratio: 1;
		border-radius: 100%;
	}
	strong {
		display: block;
		margin-top: 1em;
		font-size: 4rem;
	}
</style>
