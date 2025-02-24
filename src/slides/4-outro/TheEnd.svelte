<script lang="ts">
	import github from "./assets/github.svg";
	import twitter from "./assets/x.svg";
	import codesandbox from "./assets/codesandbox.svg";
	import shadertoy from "./assets/shadertoy.png";
	import bluesky from "./assets/bluesky.svg";
	import mastodon from "./assets/mastodon.svg";
	import qrFeedback from "./assets/url_bento.me.png";
	import { onMount } from "svelte";
	import fragmentRgb from "../2-representation-of-colors/srgb/rgb-3d.frag";
	import fragmentHsl from "../2-representation-of-colors/srgb/hsl-3d.frag";
	import fragmentHsv from "../2-representation-of-colors/srgb/hsv-3d.frag";
	import srgb from "../3-color-space-for-humans/assets/srgb.mov";
	import { useGlslCanvas } from "../../webgl/renderer";

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
	<div class="me">
		<h1>Julien Sulpis</h1>
		<strong>@jsulpis</strong>
		<div class="icons">
			<a href="https://github.com/jsulpis" target="_blank">
				<img data-src={github.src} alt="github" />
			</a>
			<a href="https://twitter.com/jsulpis" target="_blank">
				<img data-src={twitter.src} alt="X" />
			</a>
			<a href="https://bsky.app/profile/jsulpis.bsky.social" target="_blank">
				<img data-src={bluesky.src} alt="Bluesky" />
			</a>
			<a href="https://mastodon.social/@jsulpis" target="_blank">
				<img data-src={mastodon.src} alt="Mastodon" />
			</a>
			<a href="https://codesandbox.io/u/jsulpis" target="_blank">
				<img data-src={codesandbox.src} alt="codesandbox" />
			</a>
			<a href="https://www.shadertoy.com/user/jsulpis" target="_blank">
				<img data-src={shadertoy.src} alt="shadertoy" />
			</a>
		</div>
	</div>

	<img data-src={qrFeedback.src} alt="qr code for feedback" class="qr" />

	<div class="color-spaces">
		<canvas bind:this={canvasRgb} />
		<canvas bind:this={canvasHsl} />
		<canvas bind:this={canvasHsv} />
		<!-- made from https://www.shadertoy.com/view/XddGRN -->
		<video data-src={srgb} loop data-autoplay></video>
	</div>
</div>

<style lang="scss">
	.container {
		display: grid;
		height: 100dvh;
		max-width: 80dvw;
		margin-inline: auto;
		grid-template: 1fr auto / 1fr 1fr;
		place-items: center;
	}
	a.github {
		display: block;
		font-size: 0.5em;
		margin-bottom: 2em;
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	.me {
		text-align: center;

		h1 {
			font-size: 3rem;
			margin-bottom: 0;
		}
		strong {
			font-size: 2rem;
		}

		.icons {
			display: flex;
			justify-content: center;
			margin-top: 0.5em;
			gap: 0.5em;
		}
		img {
			height: 1em;
			object-fit: contain;
		}
	}
	.qr {
		width: min(40dvh, 100%);
		aspect-ratio: 1;
		border-radius: 2%;
		box-shadow:
			0 0 2dvh - 1dvh red,
			0 0 15dvh rgba(255 0 0 / 0.6);
	}
	.color-spaces {
		grid-column-end: span 2;
		display: flex;
		width: 100%;
		justify-content: space-evenly;
		border-image: linear-gradient(
				90deg,
				transparent,
				rgba(255 255 255 / 0.5) 40%,
				rgba(255 255 255 / 0.5) 60%,
				transparent
			)
			1;
		border-top: 1px solid;
		padding-top: 1em;
		position: relative;

		&::before {
			content: "";
			position: absolute;
			width: 150%;
			height: 250%;
			left: -25%;
			bottom: -60%;
			background: radial-gradient(
				closest-side,
				hsla(215, 100%, 59%, 0.15),
				transparent
			);
		}

		canvas,
		video {
			height: 33dvh;
			aspect-ratio: 1;
		}
	}
</style>
