const _ = require('lodash');
const Q = require('q');
import * as THREE from 'three';

const TO_GEAR = 0;
const TO_SPHERE = 1;
const TO_BLOW = 2;

function rand() {
    return Math.random() * 2 - 1;
}

function createHashFromVector(v, precision) {
    return ['x', 'y', 'z'].reduce((hash, axes) => {
        return hash + _.round(v[axes], precision).toString();
    }, '');
}

function getRandomDirections(arr) {
    const directions = [];

    const posByHash = {};
    let pos = new THREE.Vector3();
    let hash;
    _.times(arr.length / 3, (i) => {
        pos = pos.set(arr[i * 3], arr[i * 3 + 1], arr[i * 3 + 2]);
        hash = createHashFromVector(pos, 2);

        const v = posByHash[hash] || new THREE.Vector3(rand(), rand(), rand());

        posByHash[hash] = v;

        directions.push(v.x, v.y, v.z);
    });

    return directions;
}

function getPosProgres(arr, xMinMax) {
    const xDelta = xMinMax[1] - xMinMax[0];

    const xPosProgress = [];
    _.times(arr.length / 3, (i) => {
        const pr = xDelta - (xMinMax[1] - arr[i * 3]);

        xPosProgress.push(pr, pr, pr);
    });

    return xPosProgress;
}

const vec1 = new THREE.Vector3();
const vec2 = new THREE.Vector3();
const clock = new THREE.Clock();

const proto = {
    _blow(ms = 1000) {
        this.tweening.stopTween('particles');

        const time = (1.0 - this.progress) * ms;
        return this.tweening.run(this, {progress: 1.0}, time, {name: 'particles', easing: _.get(this.tweening.easing, this.easing)});
    },

    blow(ms = 1000) {
        this.state = TO_BLOW;
        return this._blow(ms);
    },

    toGear(ms = 1000) {
        this.tweening.stopTween('particles');

        const preanimation = this.state === TO_GEAR ? Q() : this._blow();

        this.state = TO_GEAR;
        return preanimation.then(() => {
            this.isToSphere = false;

            const time = this.progress * ms;
            return this.tweening.run(this, {progress: 0.0}, time, {name: 'particles', easing: _.get(this.tweening.easing, this.easing)});
        });
    },

    toSphere(ms = 1000) {
        this.tweening.stopTween('particles');

        const preanimation = this.state === TO_SPHERE ? Q() : this._blow();

        this.state = TO_SPHERE;
        return preanimation.then(() => {
            this.isToSphere = true;

            const time = this.progress * ms;
            return this.tweening.run(this, {progress: 0.3}, time, {name: 'particles', easing: _.get(this.tweening.easing, this.easing)});
        });
    },

    random() {
        if (!this.cloud) { return; }

        this.randomProgressDirections = getRandomDirections(this.originalPositions.array);
        this.randomChaoticDirections = getRandomDirections(this.originalPositions.array);
    },

    _createCloud(geo, {texture}) {
        const mat = new THREE.PointsMaterial({
            color: this.color,
            size: this.pointSize,
            // blending: THREE.AdditiveBlending,
            transparent: true,
            // sizeAttenuation: false,
            depthTest: false,
            map: texture
        });

        const cloud = new THREE.Points(geo, mat);
        cloud.name = 'Cloud';

        return cloud;
    },

    _createLines(geo) {
        const uniforms = {
            maxOpacity: { type: 'f', value: this.maxLineOpacity },
            color: { type: 'c', value: this.color }
        };

        geo.addAttribute('opacity', new THREE.BufferAttribute(new Float32Array(geo.attributes.opacity.array), 1));

        const mat = new THREE.RawShaderMaterial({
            vertexShader: require('./shaders/line.vert'),
            fragmentShader: require('./shaders/line.frag'),
            uniforms,
            transparent: true,
            depthTest: false,
            linewidth: this.linewidth
        });

        const lines = new THREE.LineSegments(geo, mat, THREE.LinePieces);
        lines.name = 'Lines';

        return lines;
    },

    createFromMesh(model, {texture}) {
        model.updateMatrix();
        const geo = (new THREE.BufferGeometry()).fromGeometry(model.geometry);
        geo.applyMatrix(model.matrix);
        geo.computeBoundingBox();

        const posAttr = geo.attributes.position;

        const box = geo.boundingBox;
        const xMinMax = [box.min.x * 2, box.max.x * 1];
        const xPosProgress = getPosProgres(posAttr.array, xMinMax);

        const originalPositions = geo.attributes.position.clone();
        const randomProgressDirections = getRandomDirections(originalPositions.array);
        const randomChaoticDirections = getRandomDirections(originalPositions.array);

        const chaoticOffsets = _.fill(posAttr.clone().array, 0);
        const velocityDirection = _.fill(posAttr.clone().array, 1);

        const opacityAttr = posAttr.clone();
        _.fill(opacityAttr.array, 0);
        geo.addAttribute('opacity', opacityAttr);

        const cloud = this._createCloud(geo, {texture});

        const lines = this._createLines(geo);

        this.container.add(cloud);
        this.container.add(lines);

        this.geo = geo;
        this.cloud = cloud;
        this.lines = lines;
        this.originalPositions = originalPositions;
        this.randomProgressDirections = randomProgressDirections;
        this.randomChaoticDirections = randomChaoticDirections;
        this.chaoticOffsets = chaoticOffsets;
        this.velocityDirection = velocityDirection;
        this.xPosProgress = xPosProgress;
    },

    animate: (function() {
        let attr;
        let pos;
        let origPos;
        let xPosProgress;
        let maxOffset;
        let prevProgress;

        let vPos;
        let vCenter;
        let distance;
        let opacity;
        const direction = [0, 0, 0];
        const center = [0, 0, 0];

        let i;
        let j;
        let l;

        return function() {
            if (!this.cloud) { return; }

            if (this.isDemo) {
                this.progress = Math.max(Math.cos(clock.getElapsedTime() * this.speedDemo), 0);
            }

            // const easingFn = _.get(this.tweening.easing, this.easing);
            // this._realProgress = easingFn(this.isToSphere ? Math.max(this.progress, 0.8) : this.progress);

            prevProgress = this._realProgress;
            this._realProgress = this.progress;

            attr = this.geo.attributes;
            pos = attr.position.array;
            origPos = this.originalPositions.array;

            for (i = 0, l = attr.position.array.length; i < l; i++) {
                // Update chaotic
                this.chaoticOffsets[i] += this.randomChaoticDirections[i] *
                    this.absVelocity * this._realProgress * this.velocityDirection[i];

                maxOffset = this.maxParticleOffset * this._realProgress;
                if (Math.abs(this.chaoticOffsets[i]) > maxOffset) {
                    this.velocityDirection[i] *= -1;
                    this.chaoticOffsets[i] = this.chaoticOffsets[i] > 0 ? maxOffset : -maxOffset;
                }

                // If progress doesn't change update only chaotic
                if (prevProgress === this._realProgress) { continue; }

                // Update position
                xPosProgress = Math.pow(this.xPosProgress[i], this.xPosPower);
                pos[i] = origPos[i] + this.chaoticOffsets[i] + this.randomProgressDirections[i] * this._realProgress * this.maxDistance * xPosProgress;

                // Check sphere
                if (this.isToSphere && i % 3 === 2) {
                    vPos = vec1.set(pos[i - 2], pos[i - 1], pos[i - 0]);
                    vCenter = vec2.set(0, 0, 0);
                    distance = vPos.distanceTo(vCenter);

                    if (distance < this.sphereRadius) {
                        vPos.normalize();
                        direction[0] = vPos.x;
                        direction[1] = vPos.y;
                        direction[2] = vPos.z;
                        center[0] = vCenter.x;
                        center[1] = vCenter.y;
                        center[2] = vCenter.z;

                        for (j = 2; j >= 0; j--) {
                            pos[i - j] = center[2 - j] + direction[2 - j] * this.sphereRadius;
                        }
                    }
                }

                // Update opacity
                if (i % 6 === 0) {
                    vec1.set(pos[i + 0], pos[i + 1], pos[i + 2]);
                    vec2.set(pos[i + 3], pos[i + 4], pos[i + 5]);

                    distance = vec1.distanceTo(vec2);
                    opacity = Math.max(1 - distance / this.maxLineLength, 0);

                    for (j = 0; j < 6; j++) {
                        attr.opacity.array[i + j] = opacity;
                    }
                }
            }

            attr.position.needsUpdate = true;
            attr.opacity.needsUpdate = true;

            // const mat = this.mesh.material.materials ? this.mesh.material.materials[0] : this.mesh.material;
            // mat.opacity = (1 - Math.min(this._realProgress / this.meshAppearEdge, 1)) * this.meshMaxOpacity;
        };
    }()),

};

export const create = function({container, tweening, gui, config = {}}) {
    const instance = _.create(proto, {
        container,
        tweening,
        gui,
        config,
        state: TO_GEAR,
        speedDemo: 0.5,
        easing: 'Quartic.InOut',
        isDemo: false,
        isToSphere: false,
        sphereRadius: 102,
        progress: 0,
        maxDistance: 0.007,
        maxLineLength: 50,
        maxLineOpacity: 0.24,
        maxParticleOffset: 75,
        absVelocity: 0.123,
        pointSize: 0.28,
        linewidth: 1,
        color: new THREE.Color(0x1b1b1b),
        originalPositions: [],
        // meshAppearEdge: 0.07,
        // meshMaxOpacity: 0.7,
        xPosPower: 2
    });

    _.bindAll(instance, ['animate']);


    return instance;
};
