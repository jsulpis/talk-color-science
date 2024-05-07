#define PI acos(-1.)

// x = current wavelength
// u = control point wavelength
#define gauss(x, u, o, A) A/o*exp(-0.5*pow((x - u)/o, 2.0))

// by @Tynach (https://www.shadertoy.com/view/MtcfDj)
// Converts from a wavelength to LMS.
// Constructed using multi-peak Gaussian functions generated using Labplot
// and closely fitted to the CIE 2006 2° cone fundamentals created by Stockman & Sharp 2000).
vec3 waveToLms(float wave) {
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

// https://en.wikipedia.org/wiki/LMS_color_space#physiological_CMFs
const mat3 LMS2XYZ = mat3(1.94735469, -1.41445123, 0.36476327,
								  0.68990272, 0.34832189, 0.0,
								  0.0, 0.0, 1.93485343);

const mat3 XYZ_WGRGB = mat3(1.4628067, -0.1840623, -0.2743606,
									-0.5217933, 1.4472381, 0.0677227,
									0.0349342, -0.0968930, 1.2884099);

// https://64.github.io/tonemapping/#extended-reinhard
vec3 reinhard_extended(vec3 v, float max_white) {
	vec3 numerator = v * (1.0f + (v / vec3(max_white * max_white)));
	return numerator / (1.0f + v);
}
