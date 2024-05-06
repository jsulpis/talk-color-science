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

#define L_MIN 380.
#define L_MAX 780.
#define BEAM_LENGTH 2.
#define BEAM_WIDTH .04
#define PADDING_TOP .3
#define PADDING_BOTTOM .75
#define GRAPH_LINE_THICKNESS 1.5

#define PI acos(-1.)

//======================//
//  Choose a mode here  //
//======================//

#define BLACKBODY 1
#define NOISE 2
#define MONOCHROMATIC 3

#define MODE MONOCHROMATIC



float getMonochromaticWavelength() {
    float lmin = L_MIN + 0.;
    float lmax = L_MAX - 0.;
    return mix(lmin, lmax, (sin(uTime/2. - PI/2.) + 1.) / 2.);
}

// by @P_Malin (https://www.shadertoy.com/view/lsKczc)
float FBM(float p, float ps) {
	float f = 0.0;
    float tot = 0.0;
    float a = .2;
    for( int i=0; i<5; i++) {
        f += SmoothNoise(p + uTime) * a;
        p *= 2.0;
        tot += a;
        a *= ps;
    }
    return f / tot;
}

// by @P_Malin (https://www.shadertoy.com/view/lsKczc)
float SPD_BlackBody(float w, float t) {
    return BlackBody( w, t ) / BlackBody( 600.0, t );
}

float SPD_Noise(float w) {
    float n = FBM((w) * 0.005, 0.5);
    return pow(n, 3.) * 40.;
}

float SPD(float l_nm) {
    #if MODE == BLACKBODY
        float blackBodyTemperature = 2000. + 8000. * (sin(uTime) + 1.) / 2.;
        return SPD_BlackBody(l_nm, blackBodyTemperature) / 10.;

    #elif MODE == NOISE
        return SPD_Noise(l_nm) * smoothstep(L_MIN-50., L_MIN+100. , l_nm) * smoothstep(L_MAX+50., L_MAX-100., l_nm);

    #elif MODE == MONOCHROMATIC
        return 1. - step(1., abs(l_nm - getMonochromaticWavelength()));

    #else
        return 1.;
    #endif
}

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

    if (uv.y < .1 && uv.y > -1. + PADDING_BOTTOM) {
        #if MODE == MONOCHROMATIC
            col = wl2xyz(w) * .5;
        #else
            col = wl2xyz(w) * fPower * 2.;
        #endif

    } else if (uv.y > .1 && abs(uv.x) < 1.) {
        #if MODE == MONOCHROMATIC
            vec3 beamColor =  wl2xyz(getMonochromaticWavelength());
            float beamDist = sdBox(uv, vec2(BEAM_WIDTH/2., 100.));
            beamDist = clamp(beamDist, 0., 1.);
            float beamIntensity = pow(1. - beamDist, 150.) + .2 * pow(1. - beamDist, 40.);
            beamIntensity *= smoothstep(0., .5, uv.y);
            col = mix(col, beamColor, beamIntensity);
        #else
            // radial gradient, inspired by @izutionix: https://www.shadertoy.com/view/wtsyDl (l.31)
            float t = (fragCoord.x/uResolution.x - .5)/(1. - fragCoord.y/uResolution.y - PADDING_TOP * .45) + .45;
            float w = mix(L_MIN, L_MAX, t);
            float fPower = SPD(w);
            col = wl2xyz(w) * fPower * smoothstep(-.3, .5, uv.y);

            // compute the resulting color
            vec3 lightColor = vec3(0.);
            for(float wl = L_MIN; wl < L_MAX; wl += 5.0) {
                vec3 vCurrXYZ = wl2xyz(wl);
                float fPower = SPD(wl);
                lightColor += vCurrXYZ * fPower;
            }

            // cleaning
            col *= smoothstep(0., .1, 1. - abs(t - .5) );
            col *= step(PADDING_TOP, 1. - uv.y);
            col = clamp(col, 0., 1.);

            vec3 beamColor = lightColor / lightColor.y; // normalize lightness

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
        float spdGraph = smoothstep(wl - 1., wl, w) * smoothstep(wl+1., wl, w) * smoothstep(.8, .78, spectrumUV.y) * smoothstep(-.1, -.08, spectrumUV.y);
    #else
        vec3 lms = waveToLms(w, vec3(0.)) * fPower * 1.2;
        vec2 spdUV = spectrumUV * vec2(1., .25);
        float spdGraph = getGraphShape(fPower, spdUV, false);
    #endif

    col = mix(col, vec3(1.), spdGraph);

    vec2 lmsGraphUV = (spectrumUV + vec2(0., 1.3)) * vec2(1., .3);
    col = mix(col, vec3(1., .5, 0.), getGraphShape(lms.x, lmsGraphUV, true)); // long - red
    col = mix(col, vec3(0.5, 1., 0.), getGraphShape(lms.y, lmsGraphUV, true)); // medium - green
    col = mix(col, vec3(0.2, 0.3, 1.), getGraphShape(lms.z, lmsGraphUV, true)); // short - blue

    col = col * XYZ2SRGB;
    col = clamp(col, 0., 1.);

    col = pow(col, vec3(1./2.2));

    fragColor = vec4(col, 1.);
}
