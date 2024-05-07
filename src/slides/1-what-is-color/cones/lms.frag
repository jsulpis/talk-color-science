#define L_MIN 380.
#define L_MAX 780.
#define GRAPH_THICKNESS 3. + uQuality

float getGraphShape(in float value, in vec2 uv) {
	// by @FabriceNeyret2 https://www.shadertoy.com/view/lXlGRB
	float v = value - uv.y;
	float graph = smoothstep(0., GRAPH_THICKNESS/2., GRAPH_THICKNESS - abs(v)/fwidth(v));

	graph += .1 * step(0., uv.y) * (1. - step(value, uv.y));

	return graph;
}


void main() {
	vec2 uv = fragCoord / uResolution;

	if (abs(uv.x - .5) > .5) {
			fragColor = vec4(0.);
			return;
	}

	vec4 col = vec4(0.);

	float w = mix(L_MIN, L_MAX, uv.x);

	vec3 lms = waveToLms(w, vec3(0.)) * .9;

	col = mix(col, vec4(1., 0.02, 0., 1.), getGraphShape(lms.x * .9, uv)); // long - red
	col = mix(col, vec4(0., 1., 0., 1.), getGraphShape(lms.y, uv)); // medium - green
	col = mix(col, vec4(0., 0.36, 1., 1.), getGraphShape(lms.z * .15, uv)); // short - blue

	col = pow(col, vec4(1./2.2));

	fragColor = col;
}
