#define L_MIN 380.
#define L_MAX 780.
#define GRAPH_THICKNESS 3. + uQuality

float g(in float x, in float m, in float t1, in float t2) {
	return exp(-0.5 * pow((x < m ? t1 : t2) * (x - m), 2.));
}

// https://en.wikipedia.org/wiki/CIE_1931_color_space#Analytical_approximation
vec3 wl2xyz(in float w) {
	float x = 1.056 * g(w, 599.8, 0.0264, 0.0323) + 0.362 * g(w, 442.0, 0.0624, 0.0374) - 0.065 * g(w, 501.1, 0.049, 0.0382);
	float y = 0.821 * g(w, 568.8, 0.0213, 0.0247) + 0.286 * g(w, 530.9, 0.0613, 0.0322);
	float z = 1.217 * g(w, 437.0, 0.0845, 0.0278) + 0.681 * g(w, 459.0, 0.0385, 0.0725);
	return vec3(x, y, z);
}

const mat3 XYZ_WGRGB = mat3(//
1.4628067, -0.1840623, -0.2743606,//
-0.5217933, 1.4472381, 0.0677227,//
0.0349342, -0.0968930, 1.2884099);

// https://64.github.io/tonemapping/#extended-reinhard
vec3 reinhard_extended(vec3 v, float max_white) {
	vec3 numerator = v * (1.0 + (v / vec3(max_white * max_white)));
	return numerator / (1.0 + v);
}

float getGraphShape(in float value, in vec2 uv) {
	// by @FabriceNeyret2 https://www.shadertoy.com/view/lXlGRB
	float v = value - uv.y;
	float graph = smoothstep(0., GRAPH_THICKNESS / 2., GRAPH_THICKNESS - abs(v) / fwidth(v));

	graph += .1 * step(0., uv.y) * smoothstep(-.1, .1, uv.y) * (1. - step(value, uv.y));

	return graph;
}

void main() {
	vec2 uv = fragCoord / uResolution;

	vec4 col = vec4(0.);
	float w = mix(L_MIN, L_MAX, uv.x);
	vec3 xyz = wl2xyz(w);

	if(uv.y > .1 && uv.y < .3) {
		col = vec4(xyz * XYZ_WGRGB, 1.);
		col.rgb = reinhard_extended(col.rgb, 1.5);
	} else {
		uv.y = uv.y * 10. / 5. - .8;

		col = mix(col, vec4(0., 1., 0., 1.), getGraphShape(xyz.y, uv)); // medium - green
	}

	col = pow(col, vec4(1. / 2.2));

	fragColor = col;
}
