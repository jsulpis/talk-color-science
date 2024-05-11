<script>
	import { onMount } from "svelte";
	import iro from "@jaames/iro";

	let color = "#000";
	let picker;

	onMount(() => {
		const colorPicker = new iro.ColorPicker(picker, {
			color,
			width: 400,
			borderWidth: 2,
			borderColor: "#fff",
			handleRadius: 20,
			sliderSize: 70,
			margin: 20,
			layout: [
				{ component: iro.ui.Box },
				{
					component: iro.ui.Slider,
					options: {
						id: "hue-slider",
						sliderType: "hue",
					},
				},
			],
		});

		colorPicker.on("color:change", (value) => {
			console.log(value);
			color = value.hexString;
		});
	});
</script>

<div class="container" style={`background: ${color}`}>
	<div bind:this={picker}></div>
</div>

<style>
	.container {
		height: 100dvh;
		width: 100dvw;
		display: grid;
		place-items: center;
	}
</style>
