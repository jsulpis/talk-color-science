<script>
	import { onMount } from "svelte";
	import iro from "@jaames/iro";

	let color = "#f00";
	let colorHsv = { h: 0, s: 100, v: 100 };
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
				{
					component: iro.ui.Slider,
					options: { id: "red-slider", sliderType: "red" },
				},
				{
					component: iro.ui.Slider,
					options: { id: "green-slider", sliderType: "green" },
				},
				{
					component: iro.ui.Slider,
					options: { id: "blue-slider", sliderType: "blue" },
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
		<div class="picker rgb" bind:this={picker}></div>
	</div>
	<strong
		>{`hsb(${colorHsv.h.toFixed(0)}deg,
		${colorHsv.s.toFixed(0)}%,`}
		<span class="underline">{`${colorHsv.v.toFixed(0)}%`}</span>)</strong
	>
</div>

<style lang="scss">
	.container {
		display: flex;
		justify-content: center;
		gap: 10dvw;
		align-items: center;
		margin-top: 5dvh;
	}

	.circle {
		width: calc(30vmin);
		aspect-ratio: 1;
		border-radius: 100%;
	}
	strong {
		display: block;
		margin-top: 1em;
		font-size: 3rem;
	}
	.underline {
		text-decoration: underline;
		text-underline-offset: 0.3em;
	}
</style>
