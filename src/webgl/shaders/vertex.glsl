#version 300 es

precision highp float;

uniform vec2 uResolution;
uniform float uQuality;
uniform float uTime;

in vec3 position;
out vec2 uv;
out vec2 fragCoord;

void main() {
   vec2 resolution = uResolution * uQuality;

	 fragCoord = position.xy * uResolution;
   uv = (position.xy - 0.5) * resolution / min(resolution.y, resolution.x);

   gl_Position = vec4(2.0 * position - 1.0, 1.0);
}
