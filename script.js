import dat from 'dat.gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const monkeyUrl = new URL('../assets/puppet_rigged_with_mixamo.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.001, 10);

renderer.setClearColor(0xFFFFFF);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 2, 4);
orbit.update();

const light = new THREE.DirectionalLight(0xFFFFFF, 1);
scene.add(light);
light.position.y = 1;
light.position.z = 1;

const aLight = new THREE.AmbientLight(0xFFFFFF, 1);
scene.add(aLight);

const target = new THREE.Object3D();
target.position.z = 2;

const assetLoader = new GLTFLoader();

let mixer;
assetLoader.load(monkeyUrl.href, function (gltf) {
    const model = gltf.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = gltf.animations;

    const bbox = new THREE.Box3().setFromObject(model);
    const center = bbox.getCenter(new THREE.Vector3());

    model.position.x = -center.x;
    model.position.y = -center.y;
    model.position.z = -center.z;

}, undefined, function (error) {
    console.error(error);
});

const gui = new dat.GUI();

const controls = {
    mixamorigLeftArm_43: { x: 0, y: 0, z: 0 },
    mixamorigRightArm_84: { x: 0, y: 0, z: 0 },
    mixamorigLeftForeArm_41: { x: 0, y: 0, z: 0 },
    mixamorigRightForeArm_82: { x: 0, y: 0, z: 0 },
    mixamorigSpine1_88: { x: 0, y: 0, z: 0 },
    mixamorigLeftUpLeg_97: { x: 0, y: 0, z: 0 },
    mixamorigRightUpLeg_104: { x: 0, y: 0, z: 0 },
};

for (let control in controls) {
    const folder = gui.addFolder(control);

    folder.add(controls[control], 'x', -Math.PI, Math.PI).name('Rotation X').onChange(updateRotation.bind(null, control));
    folder.add(controls[control], 'y', -Math.PI, Math.PI).name('Rotation Y').onChange(updateRotation.bind(null, control));
    folder.add(controls[control], 'z', -Math.PI, Math.PI).name('Rotation Z').onChange(updateRotation.bind(null, control));
}

function updateRotation(name) {
    const part = scene.getObjectByName(name);
    if (part) {
        part.rotation.set(controls[name].x, controls[name].y, controls[name].z);
    }
}

function animate(time) {
    if (mixer) {
        mixer.update(time);
    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});