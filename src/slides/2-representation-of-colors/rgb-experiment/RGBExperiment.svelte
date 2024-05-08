<script>
	import { onMount } from "svelte";
	import iro from "@jaames/iro";

	let colorRgb = { r: 255, g: 255, b: 255 };
	let color = "#fff";
	let picker;

	onMount(() => {
		const colorPicker = new iro.ColorPicker(picker, {
			color,
			borderWidth: 2,
			borderColor: "#fff",
			layoutDirection: "horizontal",
			handleRadius: 15,
			sliderSize: 60,
			width: 350,
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
			console.log(value);
		});
	});
</script>

<div
	class="container fragment custom"
	data-fragment-index="2"
	style={`--color: ${color}`}
>
	<div class="reference light"></div>

	<div class="primaries lights">
		<div class="circles">
			<span class="circle red"></span>
			<span class="circle green"></span>
			<span class="circle blue"></span>
		</div>

		<div class="picker rgb" bind:this={picker}></div>
	</div>

	<span class="reference text fragment" data-fragment-index="1">580nm </span>
	<span class="primaries text fragment" data-fragment-index="1">
		<span class="values">
			<span class="value">{Number(colorRgb.r / 255).toFixed(2)}</span>x
		</span>
		<span class="wavelength red">700nm</span>

		<span class="values">
			<span class="plus">+</span>
			<span class="value">{Number(colorRgb.g / 255).toFixed(2)}</span>x
		</span>
		<span class="wavelength green">546.1nm</span>

		<span class="values">
			<span class="plus">+</span>
			<span class="value">{Number(colorRgb.b / 255).toFixed(2)}</span>x
		</span>
		<span class="wavelength blue">435.8nm</span>
	</span>
</div>

<style lang="scss">
	.container {
		--animation-duration: 2s;
		--circle-radius: 20vmin;

		display: grid;
		grid-template: 1fr 15vh / 1fr 1fr;
		height: 100dvh;
		column-gap: 4px;
		align-items: center;
		padding-inline: 4vw;
	}

	.reference.light {
		width: calc(1.6 * var(--circle-radius));
		aspect-ratio: 1;
		border-radius: 100%;
		box-shadow: inset 0 0 4px black;
		background: #ebc900;
		justify-self: center;
		transition: transform 1s var(--ease-in-out);

		.container:global(.current-fragment) & {
			transform: translateX(130%);
		}
	}
	.reference.text {
		color: #ebc900;
	}

	.primaries.lights {
		display: grid;
		grid-template-columns: 1fr 1fr;
		overflow: hidden;
		align-items: center;
		isolation: isolate;
		border-width: 0 0 0 4px;
		border-style: solid;
		border-color: transparent;
		transition: border 1s;

		.container:global(.current-fragment) & {
			border-color: white;
		}
	}

	.circles {
		display: grid;
		place-items: center;
		height: 60dvh;
		transition: transform 1s var(--ease-in-out);
		transform: translateX(50%);

		.container:global(.current-fragment) & {
			transform: translateX(-50%);
		}
	}

	.circle {
		--end-offset: -10%;
		display: block;
		position: absolute;
		width: calc(2 * var(--circle-radius));
		aspect-ratio: 1;
		border-radius: 100%;
		mix-blend-mode: screen;
		box-shadow: inset 0 0 4px black;

		&.red {
			background: rgb(from var(--color) r 0 0);
			transform: translateY(calc(var(--end-offset)));
		}

		&.green {
			background: rgb(from var(--color) 0 g 0);
			transform: translateX(calc(-1 * var(--end-offset)));
		}

		&.blue {
			background: rgb(from var(--color) 0 0 b);
			transform: translateY(calc(-1 * var(--end-offset)));
		}
	}

	.picker {
		opacity: 0;

		.container:global(.current-fragment) & {
			transition: opacity 0.9s 0.1s var(--ease-in-out);
			opacity: 1;
		}
	}

	.values {
		opacity: 0;
		transition: opacity 1s var(--ease-in-out);

		.container:global(.current-fragment) & {
			opacity: 1;
		}
	}

	.text {
		font-size: 1.2vw;
		align-self: start;

		.value {
			display: inline-block;
			font-weight: bold;
			font-size: 2em;
			width: 4ch;
		}
		&.reference {
			font-weight: bold;
			font-size: 2.4vw;
		}

		.plus {
			margin-inline: 0.3em;
		}

		.wavelength {
			font-size: 1.5em;
			text-decoration: underline;
			text-decoration-thickness: 10px;
		}

		.red {
			text-decoration-color: rgb(255, 0, 0);
		}

		.green {
			text-decoration-color: rgb(0, 255, 0);
		}

		.blue {
			text-decoration-color: rgb(0, 0, 255);
		}
	}
</style>
