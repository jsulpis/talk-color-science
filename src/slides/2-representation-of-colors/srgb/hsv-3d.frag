#define CAMERA_POSITION vec3(0., 2.4, 3.)
#define CAMERA_ORIENTATION vec3(0., -0.5, -1.)
#define BACKGROUND vec3(.2)
#define CONE_HEIGHT 1.5
#define CONE_RADIUS 1.

#define LIGHT_1 vec3(3., 2., -5.)
#define LIGHT_2 vec3(-3., 2., -5.)

#define PI acos(-1.)

// Ray casting
#define INFINITY 1e10

// anti-aliasing
#define AA 4

//===============================================//
//  Generic utilities stolen from smarter people //
//===============================================//

float dot2(vec3 v) {
  return dot(v, v);
}

// https://iquilezles.org/articles/intersectors/
// axis aligned box centered at the origin, with size boxSize
vec2 boxIntersection( in vec3 ro, in vec3 rd, vec3 boxSize) {
    vec3 m = 1.0/rd; // can precompute if traversing a set of aligned boxes
    vec3 n = m*ro;   // can precompute if traversing a set of aligned boxes
    vec3 k = abs(m)*boxSize;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
    float tN = max( max( t1.x, t1.y ), t1.z );
    float tF = min( min( t2.x, t2.y ), t2.z );
    if( tN>tF || tF<0.0) return vec2(-1.); // no intersection

    return vec2(tN, tF);
}

// https://iquilezles.org/articles/intersectors/
// cone defined by extremes pa and pb, and radious ra and rb
vec4 coneIntersect( in vec3 ro, in vec3 rd, in vec3 pa, in vec3 pb, in float ra, in float rb ) {
    vec3  ba = pb - pa;
    vec3  oa = ro - pa;
    vec3  ob = ro - pb;

    float m0 = dot(ba,ba);
    float m1 = dot(oa,ba);
    float m2 = dot(ob,ba);
    float m3 = dot(rd,ba);

    //caps
         if( m1<0.0 ) { if( dot2(oa*m3-rd*m1)<(ra*ra*m3*m3) ) return vec4(-m1/m3,-ba*inversesqrt(m0)); }
    else if( m2>0.0 ) { if( dot2(ob*m3-rd*m2)<(rb*rb*m3*m3) ) return vec4(-m2/m3, ba*inversesqrt(m0)); }

    // body
    float m4 = dot(rd,oa);
    float m5 = dot(oa,oa);
    float rr = ra - rb;
    float hy = m0 + rr*rr;

    float k2 = m0*m0    - m3*m3*hy;
    float k1 = m0*m0*m4 - m1*m3*hy + m0*ra*(rr*m3*1.0        );
    float k0 = m0*m0*m5 - m1*m1*hy + m0*ra*(rr*m1*2.0 - m0*ra);

    float h = k1*k1 - k2*k0;
    if( h<0.0 ) return vec4(INFINITY);

    float t = (-k1-sqrt(h))/k2;

    float y = m1 + t*m3;
    if( y>0.0 && y<m0 ) {
        return vec4(t, normalize(m0*(m0*(oa+t*rd)+rr*ba*ra)-ba*hy*y));
    }
    return vec4(INFINITY);
}

// https://www.shadertoy.com/view/MsS3Wc
vec3 hsv2rgb( in vec3 c ) {
  vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
	return c.z * mix( vec3(1.0), rgb, c.y);
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

float shapeDist(in vec3 ro, in vec3 rd) {
	float coneDist = coneIntersect(ro, rd, vec3(0., 0., 0.), vec3(0., CONE_HEIGHT, 0.), 0., CONE_RADIUS).x;

	float opening = 4.;
	vec2 cubeDist = boxIntersection(
		rotateY(PI/4.) * (ro* vec3(opening, 1., 1.) - vec3(0., 0., .33)),
		rotateY(PI/4.) * (rd* vec3(opening, 1., 1.) - vec3(0., 0., .33)),
		vec3(CONE_RADIUS, CONE_HEIGHT, CONE_RADIUS)
	);

	return max(cubeDist.y, coneDist);
}

vec3 calculateNormal(vec3 rayOrigin, vec3 rayDirection) {
	float epsilon = 0.001;
	float dist = shapeDist(rayOrigin, rayDirection);

	float dx = shapeDist(rayOrigin + vec3(epsilon, 0.0, 0.0), rayDirection) - dist;
	float dy = shapeDist(rayOrigin + vec3(0.0, epsilon, 0.0), rayDirection) - dist;
	float dz = shapeDist(rayOrigin + vec3(0.0, 0.0, epsilon), rayDirection) - dist;

	return normalize(vec3(dx, dy, dz));
}

vec4 trace(in vec3 ro, in vec3 rd) {
  float distance = shapeDist(ro, rd);

  if (distance == INFINITY) {
    return vec4(0.);
  }

  vec3 p = ro + rd * distance;

  p = rotateY(uTime) * p;
	vec3 normal = calculateNormal(ro, rd);

  float lighting = min(dot(normalize(LIGHT_1), normal) + 1.5, 1.)
								 * min(dot(normalize(LIGHT_2), normal) + 1.5, 1.);

  float h = (atan(p.x, p.z) + PI) / (2. * PI);
  float s = length(vec2(p.x, p.z));
  float v = (p.y / CONE_HEIGHT) * lighting;

	vec3 color = hsv2rgb(vec3(h, s, v));
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
