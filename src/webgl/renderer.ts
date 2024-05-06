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
};

export function useGlslCanvas<CustomUniforms>({
	canvas,
	...materialOptions
}: Args) {
	const renderer = new WebGLRenderer({ canvas });

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

	const uniforms = mesh.material.uniforms;

	requestAnimationFrame(function animate() {
		requestAnimationFrame(animate);

		rafCallbacks.forEach((callback) => callback());

		(uniforms.uTime as number) += 0.01;
		renderer.render(mesh, camera);
	});

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
	});

	return {
		renderer,
		raf,
		uniforms: mesh.material.uniforms as CustomUniforms,
		canvas,
	};
}
