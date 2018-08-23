const _ = require('lodash');
const THREE = require('three');

const proto = {
    animate() {
        const dt = this.clock.getDelta();
        this.container.rotation.y += this.rotationSpeed * dt;
        this.fps = 1.0 / dt;
    },

    setGearScale(scale) {
        this.gear.scale.set(scale, scale, scale);
    },

    getGearPosition() {
        return this.container.position.toArray();
    },

    setGearPosition(x, y, z) {
        this.container.position.set(x, y, z);
    },

    getFPS() {
        return this.fps;
    },

    _addLights() {
        const directionalLight1 = new THREE.DirectionalLight(0xe6fdff, 0.8);
        directionalLight1.position.set(150.0, 100.0, 100.0);
        // directionalLight1.position.set(100.0, 100.0, 100.0);

        const directionalLight2 = new THREE.DirectionalLight(0xf7f0d5, 0.8);
        directionalLight2.position.set(-530.0, 340.0, 310.0);
        // directionalLight2.position.set(-100.0, -100.0, -100.0);

        this.scene.add(directionalLight1);
        this.scene.add(directionalLight2);
    },

    _init() {
        this._addLights();

        // this.container.rotation.y = 1.57;

        this.scene.add(this.container);
        // this.container.translateX(120.0);
        // this.container.translateZ(-100.0);
        this.container.name = 'gear_container';

        this.container.add(this.rotator);
        this.rotator.add(this.pivot);

        this.rotator.name = 'rotator';
        this.pivot.name = 'pivot';

        this.pivot.add(this.gear);
        this.gear.name = 'gear';
    }
};

exports.create = function({scene, config}) {
    scene.name = 'Scene';

    const instance = _.create(proto, {
        config,
        scene,
        container: new THREE.Object3D(),
        pivot: new THREE.Object3D(),
        rotator: new THREE.Object3D(),
        gear: new THREE.Object3D(),
        clock: new THREE.Clock(true),
        rotationSpeed: 0.05,
        fps: 0.0
    });
    instance.gear.position.x = 0;
    instance.gear.position.z = 0;
    instance._init();
    _.bindAll(instance, _.functions(proto));

    return instance;
};
