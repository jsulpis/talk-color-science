#define PI acos(-1.)

//=========================//
//  Color transformations  //
//=========================//

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

// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
const mat3 XYZ_WGRGB = mat3( 1.4628067, -0.1840623, -0.2743606,
                            -0.5217933,  1.4472381,  0.0677227,
                             0.0349342, -0.0968930,  1.2884099);

// https://64.github.io/tonemapping/#extended-reinhard
vec3 reinhard_extended(vec3 v, float max_white) {
	vec3 numerator = v * (1.0f + (v / vec3(max_white * max_white)));
	return numerator / (1.0f + v);
}

// x = current wavelength
// u = control point wavelength
#define gauss(x, u, o, A) A/o*exp(-0.5*pow((x - u)/o, 2.0))

// by @Tynach (https://www.shadertoy.com/view/MtcfDj)
// Converts from a wavelength to LMS.
// Constructed using multi-peak Gaussian functions generated using Labplot
// and closely fitted to the CIE 2006 2° cone fundamentals created by Stockman & Sharp 2000).
vec3 waveToLms(float wave, vec3 amount) {
	// LMS Gaussian function parameters for each cone type
	const vec3[5] lParams = vec3[](
		vec3(449.682, 21.6622, 2.36612),
		vec3(477.589, 11.0682, 1.39883),
		vec3(532.488, 25.7494, 34.0478),
		vec3(570.2, 5.91487, 0.243387),
		vec3(585.858, 34.98, 77.8669)
	);

	const vec3[5] mParams = vec3[](
		vec3(450.237, 19.5222, 3.33537),
		vec3(479.559, 13.3211, 3.68813),
		vec3(519.924, 17.1502, 9.68484),
		vec3(542.8, 3.27696, 0.105766),
		vec3(552.158, 33.3895, 77.9298)
	);

	const vec3[5] sParams = vec3[](
		vec3(467.661, 8.84562, 5.32073),
		vec3(422.211, 10.2028, 8.58498),
		vec3(443.084, 11.9848, 19.6347),
		vec3(444.863, 1.30608, -0.0330768),
		vec3(460.886, 25.7907, 24.9128)
	);

	// Return the LMS values for the given wavelength
	return vec3(
		// L cone response curve
		gauss(wave, lParams[0].x, lParams[0].y, lParams[0].z) +
		gauss(wave, lParams[1].x, lParams[1].y, lParams[1].z) +
		gauss(wave, lParams[2].x, lParams[2].y, lParams[2].z) +
		gauss(wave, lParams[3].x, lParams[3].y, lParams[3].z) +
		gauss(wave, lParams[4].x, lParams[4].y, lParams[4].z),

		// M cone response curve
		gauss(wave, mParams[0].x, mParams[0].y, mParams[0].z) +
		gauss(wave, mParams[1].x, mParams[1].y, mParams[1].z) +
		gauss(wave, mParams[2].x, mParams[2].y, mParams[2].z) +
		gauss(wave, mParams[3].x, mParams[3].y, mParams[3].z) +
		gauss(wave, mParams[4].x, mParams[4].y, mParams[4].z),

		// S cone response curve
		gauss(wave, sParams[0].x, sParams[0].y, sParams[0].z) +
		gauss(wave, sParams[1].x, sParams[1].y, sParams[1].z) +
		gauss(wave, sParams[2].x, sParams[2].y, sParams[2].z) +
		gauss(wave, sParams[3].x, sParams[3].y, sParams[3].z) +
		gauss(wave, sParams[4].x, sParams[4].y, sParams[4].z)
	)/sqrt(2.0*PI);
}

// https://en.wikipedia.org/wiki/Planck%27s_law
float BlackBody( float w_nm, float t ) {
    float h = 6.6e-34; // Planck constant
    float k = 1.4e-23; // Boltzmann constant
    float c = 3e8;// Speed of light
    float w = w_nm / 1e9;
    float w5 = w*w*w*w*w;
    float o = 2.*h*(c*c) / (w5 * (exp(h*c/(w*k*t)) - 1.0));
    return o;
}

//==========//
//  Noises  //
//==========//

// by @P_Malin (https://www.shadertoy.com/view/lsKczc)
float hash11(float p) {
	vec3 p3  = fract(vec3(p) * .5);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

// by @P_Malin (https://www.shadertoy.com/view/lsKczc)
float SmoothNoise(float o) {
	float p = floor(o);
	float f = fract(o);

	float a = hash11(p);
	float b = hash11(p+1.0);

	float f2 = f * f;
	float f3 = f2 * f;

	float t = 3.0 * f2 - 2.0 * f3;

	float res = a + (b-a)*t;

    return res;
}

//================//
//  Ray marching  //
//================//

// https://iquilezles.org/articles/distfunctions2d/
float sdBox( in vec2 p, in vec2 b ) {
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

// https://iquilezles.org/articles/distfunctions2d/
float sdCircle( vec2 p, float r ) {
    return length(p) - r;
}

mat2 rotateZ(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(
    vec2(c, -s),
    vec2(s, c)
  );
}

