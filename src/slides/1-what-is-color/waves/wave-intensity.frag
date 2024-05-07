#define L_MIN 380.
#define L_MAX 780.

#define PI acos(-1.)

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

// https://64.github.io/tonemapping/#extended-reinhard
vec3 reinhard_extended(vec3 v, float max_white) {
	vec3 numerator = v * (1.0f + (v / vec3(max_white * max_white)));
	return numerator / (1.0f + v);
}

// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
const mat3 XYZ_WGRGB = mat3( 1.4628067, -0.1840623, -0.2743606,
                            -0.5217933,  1.4472381,  0.0677227,
                             0.0349342, -0.0968930,  1.2884099);

void main( ) {
	vec2 uv = fragCoord / uResolution.xy;

	float wl = mix(L_MIN, L_MAX, uv.x);
	vec3 col = wl2xyz(wl) * XYZ_WGRGB * pow(uv.y, 2.2);
	col = reinhard_extended(col, 1.5);
	col = pow(col, vec3(1./2.2)) ;

	fragColor = vec4(col, 1.);
}
