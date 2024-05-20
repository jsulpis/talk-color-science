// Copyright © 2014 Inigo Quilez
// https://www.shadertoy.com/view/MsS3Wc

// Smooth HSV to RGB conversion
vec3 hsv2rgb_smooth(in vec3 c) {
	vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0, 4, 2), 6.0) - 3.0) - 1.0, 0.0, 1.0);

	rgb = rgb * rgb * (3.0 - 2.0 * rgb); // cubic smoothing

	return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
	vec2 uv = fragCoord.xy / uResolution.xy;

	vec3 hsv = vec3(uv.x, 1, 1);

	vec3 rgb = hsv2rgb_smooth(hsv);

	fragColor = vec4(rgb, 1);
}
