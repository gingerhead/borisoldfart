import * as THREE from 'three';
import OrbitControls from 'exports-loader?THREE.OrbitControls!imports-loader?THREE=three!three/examples/js/controls/OrbitControls';
import EffectComposer from 'exports-loader?THREE.EffectComposer!imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer';
import RenderPass from 'exports-loader?THREE.RenderPass!imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass';
import DigitalGlitch from 'exports-loader?THREE.DigitalGlitch!imports-loader?THREE=three!three/examples/js/shaders/DigitalGlitch';
import CopyShader from 'exports-loader?THREE.CopyShader!imports-loader?THREE=three!three/examples/js/shaders/CopyShader';
import ShaderPass from 'exports-loader?THREE.ShaderPass!imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass';
import GlitchPass from 'exports-loader?THREE.GlitchPass!imports-loader?THREE=three!three/examples/js/postprocessing/GlitchPass';
import create from 'lodash/create';
import _ from 'lodash';
var loader = new THREE.ObjectLoader();
var TWEEN = require('tween.js');

const CAMERA_DISTANCE_FACTOR = 2.5;
const CAMERA_FAR_FACTOR = 10;
const CAMERA_NEAR_FACTOR = .001;

export default class ModelEditorViewer {
    _init() {
        _.bindAll(this, _.functions(this));
    }

    moveCamera(camera, to, time, opts) {
        if (_.isArray(to)) {
            // get object {x: [x1, x2 ...], y: [y1, y2 ...], z: [z1, z2 ...]}
            var waypoints = to;
            var axes = ['x', 'y', 'z'];

            to = _.zipObject(axes,
                _.map(axes, function (axis) {
                    return _.map(waypoints, axis);
                }));

            opts = _.merge({ interpolation: TWEEN.Interpolation.CatmullRom}, opts);
        }

        opts = _.merge({ name: 'camera' }, opts);

        return this.tweening.run(camera.position, to, time, opts);
    }


    constructor() {
        // Add the loaded object to the scene
        // once everything is loaded, we run our Three.js stuff.
        // create a scene, that will hold all our elements such as objects, cameras and lights.
        const texture = new THREE.TextureLoader().load( "upload/front.jpg" );
        var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
            map: texture
        });

        // plane
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(15.1, 10),img);
        plane.overdraw = true;

        var scene = new THREE.Scene();
        this.scene_ = scene;
        scene.add(plane);
        // create a camera, which defines where we're looking at.
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera_ = camera;
        // create a render and set the size
        var webGLRenderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer_ = webGLRenderer;
        //webGLRenderer.setClearColor(new THREE.Color(0xffffff));
        webGLRenderer.setSize(window.innerWidth, window.innerHeight);
        webGLRenderer.shadowMap.enabled = true;
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 15;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // var orbitControls = new OrbitControls(camera);
        // orbitControls.autoRotate = false;
        var clock = new THREE.Clock();
        var ambi = new THREE.AmbientLight(0x181818);
        scene.add(ambi);
        var spotLight = new THREE.DirectionalLight(0xffffff);
        spotLight.position.set(550, 100, 550);
        spotLight.intensity = 0.6;
        scene.add(spotLight);
        // add the output of the renderer to the html element
        document.getElementById("3d").appendChild(webGLRenderer.domElement);
        var renderPass = new RenderPass(scene, camera);
        var effectGlitch = new GlitchPass(64);
        effectGlitch.renderToScreen = true;
        var composer = new EffectComposer(webGLRenderer);
        composer.addPass(renderPass);
        composer.addPass(effectGlitch);
        // setup the control gui
        // call the render function
        var step = 0;

        // const env = require('./env').create({config: {}, scene});
        // const tweening = require('./tweening').create();
        // this.tweening = tweening;
        // const particles = require('./particles').create({config: {}, tweening, container: env.gear});
        //
        // const tex = new THREE.TextureLoader().load( "textures/particle.png" );
        // var geometry = new THREE.SphereGeometry( 5, 32, 32 );
        // var sphere = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( {color: 0xffff00} ) );
        // sphere.scale.set(1, 1, 1);
        // particles.createFromMesh(sphere, {texture: tex});
        //
        // const run = () => setTimeout(() => {
        //     particles.blow();
        //     setTimeout(() => {
        //         console.log('111');
        //         particles.toGear();
        //     }, 5000);
        //     run();
        // }, 5000);

        // setTimeout(() => {
        //     this.moveCamera(this.camera_, {x: [0], y: [0], z: [0]}, 100, {})
        // }, 2000);

        //run();

        scene.add(plane);
        render();
        this.setupSize();


        console.log(composer);

        function render() {
            //sphere.rotation.y=step+=0.01;
            var delta = clock.getDelta();
            // particles.animate();
            // tweening.animate();
            // env.animate();
            //orbitControls.update(delta);
            // render using requestAnimationFrame
            requestAnimationFrame(render);
            composer.render(delta);

        }

        // const instance = create(this, {
        //     env,
        //     particles,
        //     tweening,
        //     domElement: this.renderer_.domElement,
        // });

    }

    createMesh = (geom, material) => {
        var mesh = new THREE.Mesh(geom, material);
        return mesh;
    }


    animate = () => {
        if (!this.isRunning_) return;

        this.particles.animate();
        this.tweening.animate();
        this.renderer_.render(this.scene_, this.camera_);

        this.currentRafRequest_ = requestAnimationFrame(this.animate);
    };


    deteremineScreenCoordinate(object, camera) {
        var vector = new THREE.Vector3();
        vector.setFromMatrixPosition(object.matrixWorld);
        vector.project(camera);
        var width = window.innerWidth, height = window.innerHeight;
        var widthHalf = width / 2, heightHalf = height / 2;
        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = -( vector.y * heightHalf ) + heightHalf;
        return vector;
    }


    setupSize() {
        const setSize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            this.camera_.aspect = w / h;
            this.camera_.updateProjectionMatrix();
            this.renderer_.setSize(w, h);

        };
        setSize();
        window.addEventListener('resize', setSize);

        return () => {
            window.removeEventListener('resize', setSize);
        };
    };

    start(parent) {
        const stopAnimation = () => cancelAnimationFrame(this.currentRafRequest_);
        this.isRunning_ = true;
        this.animate();
        const disposeSize = this.setupSize();

        parent.appendChild(this.renderer_.domElement);
        return () => {
            this.isRunning_ = false;
            stopAnimation();
            disposeSize();
        };
    }
    injectLight_(loadedModel) {
        const lights = new THREE.Object3D();
        lights.name = 'Lights';
        const amb = new THREE.AmbientLight(0xffffff);
        amb.name = 'Ambient Light';

        const dir = new THREE.DirectionalLight(0xffffff, .56);
        dir.position.set(1, 1, -1).multiplyScalar(10 ** Math.floor(Math.log10(this.sizeLength)));
        dir.name = 'Direct Light';

        lights.add(amb, dir);

        if (initialSnapshots.has(loadedModel)) {
            console.warn('b3.json has no children; will add default lights directly to scene');
            this.scene_.add(lights);
        } else {
            loadedModel.add(lights);
        }
    }

}
