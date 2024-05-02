<script>
	import { onMount } from "svelte";
	import iro from "@jaames/iro";

	let color = "#fff";
	let picker;

	onMount(() => {
		const colorPicker = new iro.ColorPicker(picker, {
			color,
			borderWidth: 2,
			borderColor: "#fff",
			layoutDirection: "horizontal",
			handleRadius: 15,
			sliderSize: 50,
			width: 300,
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
			console.log(value.rhv);
			color = value.hexString;
		});
	});
</script>

<div class="container" style={`--color: ${color}`}>
	<div class="circles fragment">
		<span class="circle red"></span>
		<span class="circle green"></span>
		<span class="circle blue"></span>
	</div>

	<div class="picker rgb fragment" bind:this={picker}></div>
</div>

<style lang="scss">
	.container {
		--animation-duration: 2s;
		--circle-radius: 20vmin;

		display: grid;
		grid-template-columns: 35vw 1fr 35vw;
		align-items: center;
	}

	.circles {
		display: grid;
		place-items: center;
		height: 100dvh;
		grid-column-start: 2;

		&.fragment {
			opacity: 1;
			visibility: visible;
		}
	}

	.circle {
		--start-offset: calc(-1 * var(--circle-radius) - 15%);
		--end-offset: -10%;
		display: block;
		position: absolute;
		width: calc(2 * var(--circle-radius));
		aspect-ratio: 1;
		border-radius: 100%;
		mix-blend-mode: screen;
		transition: transform var(--animation-duration) var(--ease-in-out);
	}

	.red {
		background: rgb(from var(--color) r 0 0);
		transform: translateY(var(--start-offset));

		.circles.fragment:global(.visible) & {
			transform: translateY(calc(var(--end-offset)));
		}
	}

	.green {
		background: rgb(from var(--color) 0 g 0);
		transform: rotate(120deg) translateY(var(--start-offset));

		.circles.fragment:global(.visible) & {
			transform: rotate(120deg) translateY(var(--end-offset));
		}
	}

	.blue {
		background: rgb(from var(--color) 0 0 b);
		transform: rotate(-120deg) translateY(var(--start-offset));

		.circles.fragment:global(.visible) & {
			transform: rotate(-120deg) translateY(var(--end-offset));
		}
	}
</style>
