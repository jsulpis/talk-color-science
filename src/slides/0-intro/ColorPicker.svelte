<script>
	import { onMount } from "svelte";
	import iro from "@jaames/iro";

	let color = "#000";
	let picker;

	onMount(() => {
		const colorPicker = new iro.ColorPicker(picker, {
			color,
			width: 350,
			borderWidth: 2,
			borderColor: "#fff",
			handleRadius: 15,
			sliderSize: 50,
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
