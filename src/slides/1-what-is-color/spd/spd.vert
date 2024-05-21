#version 300 es

precision highp float;

uniform vec2 uResolution;
uniform float uQuality;
uniform float uTime;

in vec3 position;
out vec2 uv;
out vec2 fragCoord;
out vec3 beamColor;

#include "./spd.common.frag"

void main() {
	vec2 resolution = uResolution * uQuality;

	fragCoord = position.xy * uResolution;
	uv = (position.xy - 0.5f) * resolution / min(resolution.y, resolution.x);

	gl_Position = vec4(2.0f * position - 1.0f, 1.0f);

	#if MODE == MONOCHROMATIC
	beamColor = wl2xyz(getMonochromaticWavelength());
	#else
	vec3 color = vec3(0.f);
	for(float wl = L_MIN; wl < L_MAX; wl += 5.0f) {
		vec3 vCurrXYZ = wl2xyz(wl);
		float fPower = SPD(wl);
		color += vCurrXYZ * fPower;
	}
	beamColor = color / color.y; // normalize lightness
	#endif
}
