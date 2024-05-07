#define PI acos(-1.)

void main() {
	float v = sin(uv.x * 7. * PI - PI/2.) / 8. - uv.y;
	float lineThickness = 4.;
	float graph = smoothstep(0., 1., lineThickness - abs(v)/fwidth(v));

	graph *= 1. - smoothstep(.5, .65, abs(uv.x));

	fragColor = vec4(graph);
}
