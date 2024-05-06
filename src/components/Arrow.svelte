<script lang="ts">
	export let width = 250;
	export let height = 25;
	export let strokeWidth = height / 7;
	export let tip: "left" | "right" | "both" = "both";

	const pathLeft =
		tip === "left" || tip === "both"
			? `M${height / 2} ${height - strokeWidth / 2}L${strokeWidth / 2} ${height / 2}L${height / 2} ${strokeWidth / 2}`
			: "";
	const pathRight =
		tip === "right" || tip === "both"
			? `M${width - height / 2} ${height - strokeWidth / 2}L${width - strokeWidth / 2} ${height / 2}L${width - height / 2} ${strokeWidth / 2}`
			: "";
</script>

<svg
	{width}
	{height}
	viewBox={`0 0 ${width} ${height}`}
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	{...$$restProps}
>
	<path
		d={`M${strokeWidth} ${height / 2}H${width - strokeWidth}`}
		stroke="currentColor"
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
	></path>
	<path
		d={`${pathLeft}${pathRight}`}
		stroke="currentColor"
		stroke-width={strokeWidth}
		stroke-linecap="round"
		stroke-linejoin="round"
	></path>
</svg>

<style>
	svg {
		width: 100%;
		height: auto;
	}
</style>
