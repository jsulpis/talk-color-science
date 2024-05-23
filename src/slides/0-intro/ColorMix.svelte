<script>
	import { onMount } from "svelte";
	import iro from "@jaames/iro";

	let color = "#fff";
	let colorRgb = { r: 255, g: 255, b: 255 };
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
			colorRgb = value.rgb;
		});
	});
</script>

<div class="container" style={`--color: ${color}`}>
	<div class="circles fragment" data-fragment-index="1">
		<span class="circle red"></span>
		<span class="circle green"></span>
		<span class="circle blue"></span>
	</div>

	<div class="fragment" data-fragment-index="1">
		<div class="picker rgb" bind:this={picker}></div>
		<strong>{`rgb(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b})`}</strong>
	</div>
</div>

<style lang="scss">
	.picker {
		margin-bottom: 1em;

		+ strong {
			font-size: 3rem;
		}
	}
	.fragment {
		transition-duration: var(--animation-duration);
	}
	.container {
		--animation-duration: 1s;
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
		box-shadow: inset 0 0 4px black;
		mix-blend-mode: screen;
		transition: transform var(--animation-duration) var(--ease-in-out);
		background: var(--circle-color);
		box-shadow: 0 0 60px var(--circle-color);
		filter: blur(5px);
	}

	.red {
		--circle-color: rgb(from var(--color) r 0 0);

		transform: translateY(var(--start-offset));

		.circles.fragment:global(.visible) & {
			transform: translateY(calc(var(--end-offset)));
		}
	}

	.green {
		--circle-color: rgb(from var(--color) 0 g 0);
		transform: rotate(120deg) translateY(var(--start-offset));

		.circles.fragment:global(.visible) & {
			transform: rotate(120deg) translateY(var(--end-offset));
		}
	}

	.blue {
		--circle-color: rgb(from var(--color) 0 0 b);
		transform: rotate(-120deg) translateY(var(--start-offset));

		.circles.fragment:global(.visible) & {
			transform: rotate(-120deg) translateY(var(--end-offset));
		}
	}
</style>
