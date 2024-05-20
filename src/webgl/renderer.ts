import {
	WebGLRenderer,
	PerspectiveCamera,
	Material,
	Geometry,
	Mesh,
	type MaterialOptions,
} from "four";
import defaultVertexShader from "./shaders/vertex.glsl";
import fragmentHeader from "./shaders/fragment.header.glsl";

function flatten<T>(array: T[][]): T[] {
	return array.reduce((acc, val) => acc.concat(val), []);
}

type Args = Omit<MaterialOptions, "vertex" | "compute"> & {
	canvas: HTMLCanvasElement;
	vertex?: string;
	animate?: boolean;
	colorSpace?: "srgb" | "p3";
};

export function useGlslCanvas<CustomUniforms>({
	canvas,
	animate,
	colorSpace,
	...materialOptions
}: Args) {
	const renderer = new WebGLRenderer({ canvas });

	const glP3 = renderer.gl;

	if (colorSpace === "p3" && `drawingBufferColorSpace` in glP3) {
		glP3.drawingBufferColorSpace = "display-p3";
		glP3.clearColor(1, 0, 0, 1);
		glP3.clear(glP3.COLOR_BUFFER_BIT);
	}

	const uniformsParams = {
		uTime: 100,
		...materialOptions?.uniforms,
		uQuality: Math.min(window.devicePixelRatio, 2),
		uResolution: [canvas.clientWidth, canvas.clientHeight],
	};

	renderer.setSize(
		canvas.clientWidth * uniformsParams.uQuality,
		canvas.clientHeight * uniformsParams.uQuality
	);
	const camera = new PerspectiveCamera();

	const processedMaterialOptions: Omit<MaterialOptions, "compute"> = {
		vertex: defaultVertexShader,
		...materialOptions,
		fragment: fragmentHeader + "\n" + materialOptions.fragment,
		uniforms: uniformsParams,
	};

	const material = new Material(processedMaterialOptions);

	const geometry = new Geometry({
		position: {
			size: 3,
			data: new Float32Array(
				flatten([
					[0, 0, 0],
					[1, 0, 0],
					[0, 1, 0],
					[0, 1, 0],
					[1, 0, 0],
					[1, 1, 0],
				])
			),
		},
	});

	const mesh = new Mesh(geometry, material);

	renderer.render(mesh, camera);

	const rafCallbacks: Function[] = [];

	/**
	 * Usage:
	 * ```javascript
	 * raf(() => {
	 *   // do something at each frame
	 * })
	 * ```
	 * @param callback function to execute at each frame
	 */
	function raf(callback: Function) {
		rafCallbacks.push(callback);
	}

	const isPlaying = { value: false };
	const uniforms = mesh.material.uniforms;
	let rafHandle: number | null;
	const parentSection = canvas.closest("section:not(.stack)");

	function loop() {
		rafHandle = requestAnimationFrame(loop);

		if (!parentSection?.classList.contains("present")) {
			// skip animation when the slide is not visible to save processing power
			return true;
		}

		rafCallbacks.forEach((callback) => callback());

		(uniforms.uTime as number) += 0.01;
		renderer.render(mesh, camera);
	}

	function pause() {
		if (rafHandle != undefined) {
			cancelAnimationFrame(rafHandle);
			rafHandle = null;
			isPlaying.value = false;
		}
	}
	function play() {
		isPlaying.value = true;
		rafHandle = requestAnimationFrame(loop);
	}

	if (animate) {
		play();
	}

	window.addEventListener("resize", () => {
		const quality = uniforms.uQuality as number;

		renderer.setSize(
			canvas.clientWidth * quality,
			canvas.clientHeight * quality
		);

		mesh.material.uniforms.uResolution = [
			canvas.clientWidth,
			canvas.clientHeight,
		];

		renderer.render(mesh, camera);
	});

	canvas.classList.add("loaded");

	return {
		renderer,
		raf,
		pause,
		play,
		isPlaying,
		uniforms: mesh.material.uniforms as CustomUniforms,
		canvas,
	};
}
