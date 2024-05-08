#define L_MIN 380.
#define L_MAX 780.
#define GRAPH_THICKNESS 3. + uQuality

float g(in float x, in float m, in float t1, in float t2) {
    return exp(-0.5 * pow((x < m ? t1 : t2) * (x - m), 2.));
}

// https://en.wikipedia.org/wiki/CIE_1931_color_space#Analytical_approximation
vec3 wl2xyz(in float w){
    float x = 1.056 * g(w, 599.8, 0.0264, 0.0323) + 0.362 * g(w, 442.0, 0.0624, 0.0374) - 0.065 * g(w, 501.1, 0.049, 0.0382);
    float y = 0.821 * g(w, 568.8, 0.0213, 0.0247) + 0.286 * g(w, 530.9, 0.0613, 0.0322);
    float z = 1.217 * g(w, 437.0, 0.0845, 0.0278) + 0.681 * g(w, 459.0, 0.0385, 0.0725);
    return vec3(x,y,z);
}

// https://en.wikipedia.org/wiki/CIE_1931_color_space#Construction_of_the_CIE_XYZ_color_space_from_the_Wright%E2%80%93Guild_data
const mat3 XYZ2RGB = mat3( 8041697., -3049000., -1591847.,
													 -1752003., 4851000., 301853.,
													 17697., -49000., 3432153. ) / 3400850.;

float getGraphShape(in float value, in vec2 uv) {
	// by @FabriceNeyret2 https://www.shadertoy.com/view/lXlGRB
	float v = value - uv.y;
	float graph = smoothstep(0., GRAPH_THICKNESS/2., GRAPH_THICKNESS - abs(v)/fwidth(v));

	graph += .1 * step(min(value, 0.), uv.y) * smoothstep(-.1, .1, abs(uv.y)) * (1. - step(max(value, 0.), uv.y));

	return graph;
}


void main() {
	vec2 uv = fragCoord / uResolution;
	uv.y -= .2;

	vec4 col = vec4(0.);
	float w = mix(L_MIN, L_MAX, uv.x);
	vec3 rgb = wl2xyz(w) * XYZ2RGB * .31;

	col = mix(col, vec4(1., 0.02, 0., 1.), getGraphShape(rgb.r, uv));
	col = mix(col, vec4(0., 1., 0., 1.), getGraphShape(rgb.g, uv));
	col = mix(col, vec4(0., 0.36, 1., 1.), getGraphShape(rgb.b, uv));

	col = pow(col, vec4(1./2.2));

	fragColor = col;
}
