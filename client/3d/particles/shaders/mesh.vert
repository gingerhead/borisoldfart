precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;

uniform vec3 minPos;
uniform vec3 maxPos;

varying float posFactor;

void main() {
    posFactor = 1. - (position.x - minPos.x) / (maxPos.x - minPos.x);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}
