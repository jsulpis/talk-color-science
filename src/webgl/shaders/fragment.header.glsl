#version 300 es

precision highp float;

uniform vec2 uResolution;
uniform float uQuality;
uniform float uTime;

in vec2 uv;
in vec2 fragCoord;
out vec4 fragColor;
