import defaultVertexShader from "./shaders/vertex.glsl";
import fragmentHeader from "./shaders/fragment.header.glsl";
import { Geometry, Mesh, Program, Renderer, type ProgramOptions } from "ogl";

function flatten<T>(array: T[][]): T[] {
	return array.reduce((acc, val) => acc.concat(val), []);
}

type Args = Partial<ProgramOptions> & {
	canvas: HTMLCanvasElement;
	animate?: boolean;
	colorSpace?: "srgb" | "p3";
};

export function useGlslCanvas<CustomUniforms>({
	canvas,
	animate,
	colorSpace,
	...programOptions
}: Args) {
	const renderer = new Renderer({
		canvas,
		alpha: true,
		dpr: Math.min(window.devicePixelRatio, 2),
		width: canvas.clientWidth,
		height: canvas.clientHeight,
	});
	removeInlineStyles(canvas);

	const gl = renderer.gl;

	if (colorSpace === "p3" && `drawingBufferColorSpace` in gl) {
		gl.drawingBufferColorSpace = "display-p3";
	}

	const geometry = new Geometry(gl, {
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

	const program = new Program(gl, {
		vertex: defaultVertexShader,
		...programOptions,
		fragment: fragmentHeader + "\n" + programOptions.fragment,
		uniforms: {
			uTime: { value: 100 },
			uQuality: { value: renderer.dpr },
			uResolution: { value: [canvas.clientWidth, canvas.clientHeight] },
			...programOptions?.uniforms,
		},
	});

	const scene = new Mesh(gl, { geometry, program });

	renderer.render({ scene });

	const isPlaying = { value: false };
	const uniforms = program.uniforms;

	let rafHandle: number | null;
	const parentSection = canvas.closest("section:not(.stack)");

	// ensure consistent animation speed with all screen's refresh rates
	// https://www.kirupa.com/animations/ensuring_consistent_animation_speeds.htm
	const fps = 60;
	const frameInterval = 1000 / fps;
	let previousTime = performance.now();
	let deltaTimeMultiplier = 1;
	let deltaTime = 0;

	function loop(currentTime: number) {
		rafHandle = requestAnimationFrame(loop);

		deltaTime = currentTime - previousTime;
		deltaTimeMultiplier = deltaTime / frameInterval;
		previousTime = currentTime;

		if (!parentSection?.classList.contains("present")) {
			// skip animation when the slide is not visible
			return;
		}

		uniforms.uTime.value += 0.02 * deltaTimeMultiplier;
		renderer.render({ scene });
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
		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		removeInlineStyles(canvas);

		uniforms.uResolution.value = [canvas.clientWidth, canvas.clientHeight];

		renderer.render({ scene: scene });
	});

	canvas.classList.add("loaded");

	return {
		renderer,
		uniforms,
		play,
		pause,
		isPlaying,
		canvas,
	};
}

/**
 * Remove inline style set by ogl
 */
function removeInlineStyles(canvas: HTMLCanvasElement) {
	canvas.style.width = "";
	canvas.style.height = "";
}
