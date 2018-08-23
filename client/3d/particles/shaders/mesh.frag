precision highp float;

uniform vec3 color;
uniform float opacity;

uniform float maxOpacity;
varying float posFactor;

void main() {
    gl_FragColor = vec4(color, min((posFactor + opacity) * opacity, maxOpacity));
}
