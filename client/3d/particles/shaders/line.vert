precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute float opacity;

varying float vOpacity;

void main() {
    vOpacity = opacity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}