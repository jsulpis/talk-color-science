#define PI acos(-1.)

// first
uniform float uFrequency;
uniform float uAmplitude;

// additional wave
uniform float uFrequency2;
uniform float uAmplitude2;

void main() {
	float v = sin(uv.x * uFrequency * PI - PI/2.) * uAmplitude / 8. - uv.y;

	if (uFrequency2 > 0.) {
		v += sin(uv.x * uFrequency2 * PI - PI/2.) * uAmplitude2 / 8. - uv.y;
	}

	float lineThickness = 4.;
	float graph = smoothstep(0., 1., lineThickness - abs(v)/fwidth(v));

	graph *= 1. - smoothstep(.5, .65, abs(uv.x));

	fragColor = vec4(graph);
}
