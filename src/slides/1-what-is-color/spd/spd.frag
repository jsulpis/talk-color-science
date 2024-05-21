//=======================================================================================//
//
// Light spectrum
// by Julien Sulpis (https://twitter.com/jsulpis)
// https://www.shadertoy.com/view/lctSDf
//
// inspired by:
// P_Malin - Spectral Power Distribution (https://www.shadertoy.com/view/lsKczc)
// Tynach - Color Blindness LMS Curves (https://www.shadertoy.com/view/MtcfDj)
//
//=======================================================================================//

#define BEAM_LENGTH 2.
#define BEAM_WIDTH .04
#define PADDING_TOP .3
#define PADDING_BOTTOM .75
#define GRAPH_LINE_THICKNESS 3.

in vec3 beamColor;

#include "./spd.common.frag"

float getGraphShape(in float value, in vec2 uv, in bool filled) {
	float v = value - uv.y;
	float graph = smoothstep(0., 1., GRAPH_LINE_THICKNESS - abs(v)/fwidth(v)); // by @FabriceNeyret2 https://www.shadertoy.com/view/lXlGRB

	if (filled) {
		graph += .3 * step(0., uv.y) * (1. - step(value, uv.y));
	}

	graph *= smoothstep(-.1, .15, uv.x)
				* smoothstep(1.1, .5, uv.x);
	return .9 * graph;
}


void main( ) {
	vec2 uv = 2. * (fragCoord - 0.5 * uResolution.xy) / uResolution.y;

	vec3 col = vec3(0.);

	vec2 spectrumUV = vec2(fragCoord.x / uResolution.x * 1.5 - .3, fragCoord.y / uResolution.y * 4. - PADDING_BOTTOM * 2.);
	float w = mix(L_MIN, L_MAX, spectrumUV.x);
	float fPower = SPD(w);

	if (uv.y < 0. && uv.y > -1. + PADDING_BOTTOM) {
		#if MODE == MONOCHROMATIC
			col = wl2xyz(w);
		#else
			col = wl2xyz(w) * fPower * 5.;
		#endif

	} else if (uv.y > 0. && abs(uv.x) < .6) {
		#if MODE == MONOCHROMATIC
			float beamDist = sdBox(uv, vec2(BEAM_WIDTH/2., 100.));
			beamDist = clamp(beamDist, 0., 1.);
			float beamIntensity = pow(1. - beamDist, 150.) + .2 * pow(1. - beamDist, 40.);
			beamIntensity *= smoothstep(-.1, .5, uv.y);
			col = mix(col, beamColor, beamIntensity);
		#else
			// radial gradient, inspired by @izutionix: https://www.shadertoy.com/view/wtsyDl (l.31)
			float t = (fragCoord.x/uResolution.x - .5)/(1. - fragCoord.y/uResolution.y - PADDING_TOP * .45) + .45;
			float w = mix(L_MIN, L_MAX, t);
			float fPower = SPD(w);
			col = wl2xyz(w) * fPower * smoothstep(-.3, .5, uv.y) * 2.;

			// cleaning
			col *= smoothstep(0., .1, 1. - abs(t - .5) );
			col *= step(PADDING_TOP, 1. - uv.y);
			col = clamp(col, 0., 1.);

			vec2 p = rotateZ(-PI/5.) * (uv - vec2(.0, 1. - PADDING_TOP));
			float beamDist = sdBox(p, vec2(BEAM_WIDTH/2., 100.));
			beamDist = clamp(beamDist, 0., 1.);
			float beamIntensity = pow(1. - beamDist, 150.) + .2 * pow(1. - beamDist, 40.);
			beamIntensity *= smoothstep(-.7, .7, uv.x + uv.y);
			beamIntensity *= 1. - 0.8 * step(1., 1. - p.y);
			col += beamColor * beamIntensity;

			float gratingDist = sdBox(p, vec2(.15, .001));
			gratingDist = clamp(gratingDist, 0., 1.);
			float gratingIntensity = smoothstep(.008, .0, gratingDist);
			col += vec3(.5) * gratingIntensity;

			float glareDist = sdCircle(p, BEAM_WIDTH/10.);
			glareDist = clamp(glareDist, 0., 1.);
			float glareIntensity = .8 * pow(1. - glareDist, 20.) + .05 * pow(1. - glareDist, 10.);
			col += beamColor * glareIntensity;
		#endif
	}

	#if MODE == MONOCHROMATIC
		float wl = getMonochromaticWavelength();
		vec3 lms = .2 * waveToLms(w, vec3(0.)) * waveToLms(wl, vec3(0.));
		float spdGraph = smoothstep(wl - 1., wl, w) * smoothstep(wl+1., wl, w) * smoothstep(.6, .58, spectrumUV.y) * smoothstep(-.1, -.08, spectrumUV.y);
	#else
		vec3 lms = waveToLms(w, vec3(0.)) * fPower * 1.2;
		vec2 spdUV = spectrumUV * vec2(1., .25);
		float spdGraph = getGraphShape(fPower, spdUV, false);
	#endif

	col = col * XYZ_WGRGB;
	col = reinhard_extended(col, 1.5);

	#if MODE != WHITE
		col = mix(col, vec3(1.), spdGraph);
	#endif

	vec2 lmsGraphUV = (spectrumUV + vec2(0., 1.3)) * vec2(1., .3);
	col = mix(col, vec3(1., 0.02, 0.), getGraphShape(lms.x, lmsGraphUV, true)); // long - red
	col = mix(col, vec3(0., 1., 0.), getGraphShape(lms.y, lmsGraphUV, true)); // medium - green
	col = mix(col, vec3(0., 0.36, 1.), getGraphShape(lms.z, lmsGraphUV, true)); // short - blue

	col = pow(col, vec3(1./2.2));

	fragColor = vec4(col, 1.);
}
