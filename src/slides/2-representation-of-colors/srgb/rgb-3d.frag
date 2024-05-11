#define CAMERA_POSITION vec3(0., 1., 3.)
#define CAMERA_ORIENTATION vec3(0., -.4, -1.)
#define BACKGROUND vec3(.2)

#define CUBE_SIZE 1.

// Ray casting
#define INFINITY 1e10

// anti-aliasing
#define AA 4

//===============================================//
//  Generic utilities stolen from smarter people //
//===============================================//

// https://iquilezles.org/articles/intersectors/
// axis aligned box centered at the origin, with size boxSize
float boxIntersection( in vec3 ro, in vec3 rd, vec3 boxSize) {
    vec3 m = 1.0/rd; // can precompute if traversing a set of aligned boxes
    vec3 n = m*ro;   // can precompute if traversing a set of aligned boxes
    vec3 k = abs(m)*boxSize;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
    float tN = max( max( t1.x, t1.y ), t1.z );
    float tF = min( min( t2.x, t2.y ), t2.z );
    if( tN>tF || tF<0.0) return INFINITY; // no intersection

    return tN;
}

#ifndef saturate
    #define saturate(v) clamp(v,0.,1.)
#endif
vec3 hue2rgb(float hue){
	hue=fract(hue);
	return saturate(vec3(
		abs(hue*6.-3.)-1.,
		2.-abs(hue*6.-2.),
		2.-abs(hue*6.-4.)
	));
}

// https://www.shadertoy.com/view/wt23Rt
vec3 hsl2rgb(vec3 hsl){
	if(hsl.y==0.){
		return vec3(hsl.z); //Luminance.
	}else{
		float b;
		if(hsl.z<.5){
			b=hsl.z*(1.+hsl.y);
		}else{
			b=hsl.z+hsl.y-hsl.y*hsl.z;
		}
		float a=2.*hsl.z-b;
		return a+hue2rgb(hsl.x)*(b-a);
	}
}

mat3 rotateY(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat3(//
    vec3(c, 0, s),//
    vec3(0, 1, 0),//
    vec3(-s, 0, c)//
  );
}

//================//
//  Project code  //
//================//

float cubeDist(in vec3 ro, in vec3 rd) {
    vec3 roWithRotation = rotateY(uTime) * ro;
    vec3 rdWithRotation = rotateY(uTime) * rd;
    return boxIntersection(roWithRotation, rdWithRotation, vec3(CUBE_SIZE / 2.));
}

vec4 trace(in vec3 ro, in vec3 rd) {
  float distance = cubeDist(ro, rd);

  if (distance == INFINITY) {
    return vec4(0.);
  }

  vec3 p = ro + rd * distance;
  vec3 pWithRotation = rotateY(uTime) * p;
	vec3 color = (pWithRotation + CUBE_SIZE / 2.) / CUBE_SIZE;

  return vec4(color, 1.);
}

void main() {
  vec3 ro = CAMERA_POSITION;
	vec2 UV = uv;
	vec4 color = vec4(0.0);

	#if AA>1
		for( int m=0; m<AA; m++ )
		for( int n=0; n<AA; n++ ) {
				UV += (vec2(float(m),float(n)) / float(AA) - 0.5) / uResolution.xy;

				vec3 rd = normalize(vec3(UV, 0.) + CAMERA_ORIENTATION);

				color += trace(ro, rd);
		}
		color /= float(AA*AA);
	#else
		vec3 rd = normalize(vec3(UV, 0.) + CAMERA_ORIENTATION);
		color += trace(ro, rd);
	#endif

  fragColor = color;
}
