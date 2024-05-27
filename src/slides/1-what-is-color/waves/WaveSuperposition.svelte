<script lang="ts">
	import MonochromaticWaveCanvas from "./MonochromaticWaveCanvas.svelte";
</script>

<div class="container">
	<MonochromaticWaveCanvas frequency={5} />
	<span>+</span>
	<MonochromaticWaveCanvas frequency={15} amplitude={0.4} />
	<span>=</span>
	<MonochromaticWaveCanvas frequency={5} frequency2={20} amplitude2={0.4} />
</div>

<style lang="scss">
	.container {
		display: flex;
		height: 100dvh;
		justify-content: center;
		flex-direction: column;
		gap: 1rem;
		align-items: center;

		:global(canvas) {
			width: min(60%, 800px);
			margin-block: max(-20dvw, -230px);
		}
	}
	span {
		font-size: 5rem;
		color: rgb(0, 150, 255);
	}
</style>
