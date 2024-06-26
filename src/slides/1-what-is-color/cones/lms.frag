#define L_MIN 380.
#define L_MAX 780.
#define GRAPH_THICKNESS 3. + uQuality

float getGraphShape(in float value, in vec2 uv) {
	// by @FabriceNeyret2 https://www.shadertoy.com/view/lXlGRB
	float v = value - uv.y;
	float graph = smoothstep(0., GRAPH_THICKNESS/2., GRAPH_THICKNESS - abs(v)/fwidth(v));

	graph += .1 * step(0., uv.y) * smoothstep(-.1, .1, uv.y) * (1. - step(value, uv.y));

	return graph;
}


void main() {
	vec2 uv = fragCoord / uResolution;

	vec4 col = vec4(0.);
	float w = mix(L_MIN, L_MAX, uv.x);
	vec3 lms = waveToLms(w);

	if(uv.y < .1) {
		col = vec4(lms * LMS2XYZ * XYZ_WGRGB, 1.);
		col.rgb = reinhard_extended(col.rgb, 1.5);
	} else {
		uv.y = uv.y * 10. / 7. - .3;

		col = mix(col, vec4(1., 0.02, 0., 1.), getGraphShape(lms.x * .9, uv)); // long - red
		col = mix(col, vec4(0., 1., 0., 1.), getGraphShape(lms.y, uv)); // medium - green
		col = mix(col, vec4(0., 0.36, 1., 1.), getGraphShape(lms.z * .15, uv)); // short - blue
	}

	col = pow(col, vec4(1./2.2));

	fragColor = col;
}
