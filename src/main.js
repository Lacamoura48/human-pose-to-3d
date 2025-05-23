// javascript
// Import Three.js core and GLTFLoader
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CCDIKSolver } from 'three/examples/jsm/animation/CCDIKSolver.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { boneNames } from './boneNames.js'; // Import boneNames

// Function to create IK target and TransformControls
function createIKTargetAndControl(bone, camera, renderer, scene, controlName, controls) {
  const ikTarget = bone;
  ikTarget.getWorldPosition(ikTarget.position); // Position at the bone's initial position

  const transformControl = new TransformControls(camera, renderer.domElement);
  transformControl.attach(ikTarget);
  transformControl.name = controlName;
  transformControl.setSize(0.8);

  transformControl.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
  });

  scene.add(ikTarget);
  scene.add(transformControl.getHelper());

  return { ikTarget, transformControl };
}

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222229);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 250);

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ antialias: false, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222233);

// Add some light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const loader = new GLTFLoader();
let ikSolver, skeleton;
let ikTargetRightHand, ikTargetLeftHand, ikTargetRightFoot, ikTargetLeftFoot, ikTargetHips;
let transformControlRightHand, transformControlLeftHand, transformControlRightFoot, transformControlLeftFoot, transformControlHips;
let skinnedMesh;


loader.load('/bot.glb', (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  model.traverse((obj) => {
    if (obj.isSkinnedMesh && obj.skeleton) {
      skinnedMesh = obj;
      console.log('SkinnedMesh found:', skinnedMesh.skeleton);

      skeleton = obj.skeleton;
    }
  });

  if (!skinnedMesh) {
    console.error('No SkinnedMesh found in model');
    return;
  }
  if (!skeleton) {
    console.error('No skeleton found in model (should be linked to SkinnedMesh)');
    return;
  }

  const bones = {};
  let allBonesFound = true;
  boneNames.forEach((name) => {
    bones[name] = skeleton.bones.find((b) => b.name === name);
    if (!bones[name]) {
      console.error(`Bone not found: ${name}`);
      allBonesFound = false;
    }
  });

  if (!allBonesFound) {
    console.error('Not all IK bones found. CCDIKSolver will not be initialized.');
    return;
  }

  // Helper function to get bone index
  function getBoneIndex(boneName) {
    return skeleton.bones.indexOf(bones[boneName]);
  }

  // Create IK targets and controls using the new function
  const hipsData = createIKTargetAndControl(bones['mixamorigHips'], camera, renderer, scene, 'HipsControl', controls);
  ikTargetHips = hipsData.ikTarget;
  transformControlHips = hipsData.transformControl;

  const rightHandData = createIKTargetAndControl(bones['mixamorigRightHandMiddle4'], camera, renderer, scene, 'RightHandControl', controls);
  ikTargetRightHand = rightHandData.ikTarget;
  transformControlRightHand = rightHandData.transformControl;

  const leftHandData = createIKTargetAndControl(bones['mixamorigLeftHandMiddle4'], camera, renderer, scene, 'LeftHandControl', controls);
  ikTargetLeftHand = leftHandData.ikTarget;
  transformControlLeftHand = leftHandData.transformControl;

  const rightFootData = createIKTargetAndControl(bones['mixamorigRightToe_End'], camera, renderer, scene, 'RightFootControl', controls);
  ikTargetRightFoot = rightFootData.ikTarget;
  transformControlRightFoot = rightFootData.transformControl;

  const leftFootData = createIKTargetAndControl(bones['mixamorigLeftToe_End'], camera, renderer, scene, 'LeftFootControl', controls);
  ikTargetLeftFoot = leftFootData.ikTarget;
  transformControlLeftFoot = leftFootData.transformControl;


  // Set up CCDIKSolver
  const iks = [
    { // Right Hand
      target: getBoneIndex('mixamorigRightHandMiddle4'),
      effector: getBoneIndex('mixamorigRightHand'),
      links: [
        { index: getBoneIndex('mixamorigRightForeArm'), limitation: new THREE.Vector3(bones['mixamorigRightForeArm'].position.y, -bones['mixamorigRightForeArm'].position.x, 0 ).normalize() },
        { index: getBoneIndex('mixamorigRightArm'), rotationMin: new THREE.Vector3(-Math.PI / 4, -Math.PI / 2, -Math.PI / 4), rotationMax: new THREE.Vector3(Math.PI / 4, Math.PI / 2, Math.PI / 4) },
        { index: getBoneIndex('mixamorigRightShoulder'), rotationMin: new THREE.Vector3(-Math.PI / 20, -Math.PI / 20, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, Math.PI / 20, Math.PI / 20) },
        { index: getBoneIndex('mixamorigSpine2'), rotationMin: new THREE.Vector3(-Math.PI / 20, 0, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, 0, Math.PI / 20) },
        // { index: getBoneIndex('mixamorigSpine1'), rotationMin: new THREE.Vector3(-Math.PI / 20, 0, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, 0, Math.PI / 20) },
        // { index: getBoneIndex('mixamorigSpine'), rotationMin: new THREE.Vector3(-Math.PI / 20, 0, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, 0, Math.PI / 20) },
      ],
    },
    { // Left Hand
      target: getBoneIndex('mixamorigLeftHandMiddle4'),
      effector: getBoneIndex('mixamorigLeftHand'),
      links: [
        { index: getBoneIndex('mixamorigLeftForeArm'), limitation: new THREE.Vector3(bones['mixamorigLeftForeArm'].position.y, -bones['mixamorigLeftForeArm'].position.x, 0 ).normalize()  },
        { index: getBoneIndex('mixamorigLeftArm'), rotationMin: new THREE.Vector3(-Math.PI / 4, -Math.PI / 2, -Math.PI / 4), rotationMax: new THREE.Vector3(Math.PI / 4, Math.PI / 2, Math.PI / 4) },
        { index: getBoneIndex('mixamorigLeftShoulder'), rotationMin: new THREE.Vector3(-Math.PI / 20, -Math.PI / 20, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, Math.PI / 20, Math.PI / 20) },
        { index: getBoneIndex('mixamorigSpine2'), rotationMin: new THREE.Vector3(-Math.PI / 20, -Math.PI / 20, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, Math.PI / 20, Math.PI / 20) },
        // { index: getBoneIndex('mixamorigSpine1'), rotationMin: new THREE.Vector3(-Math.PI / 20, -Math.PI / 20, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, Math.PI / 20, Math.PI / 20) },
        // { index: getBoneIndex('mixamorigSpine'), rotationMin: new THREE.Vector3(-Math.PI / 20, -Math.PI / 20, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, Math.PI / 20, Math.PI / 20) },
      ],
    },
    { // Right Leg
      target: getBoneIndex('mixamorigRightToe_End'),
      effector: getBoneIndex('mixamorigRightFoot'),
      links: [
        { index: getBoneIndex('mixamorigRightLeg'), rotationMin: new THREE.Vector3(0, 0, -Math.PI / 24), rotationMax: new THREE.Vector3(2.61799, 0, Math.PI / 24) }, // Knee
        { index: getBoneIndex('mixamorigRightUpLeg'), rotationMin: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 3), rotationMax: new THREE.Vector3(Math.PI / 2, 0, Math.PI / 3) }, // Hip
      ],
    },
    { // Left Leg
      target: getBoneIndex('mixamorigLeftToe_End'),
      effector: getBoneIndex('mixamorigLeftFoot'),
      links: [
        { index: getBoneIndex('mixamorigLeftLeg'), rotationMin: new THREE.Vector3(0, 0, -Math.PI / 24), rotationMax: new THREE.Vector3(2.61799, 0, Math.PI / 24) }, // Knee
        { index: getBoneIndex('mixamorigLeftUpLeg'), rotationMin: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 3), rotationMax: new THREE.Vector3(Math.PI / 2, 0, Math.PI / 3) }, // Hip
      ],
    }
  ];
  ikSolver = new CCDIKSolver(skinnedMesh, iks);

}, undefined, (error) => {
  console.error('An error happened while loading the model:', error);
});

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 1, 0);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (ikSolver && ikTargetRightHand && ikTargetLeftHand && ikTargetRightFoot && ikTargetLeftFoot && ikTargetHips) {
    ikSolver.update();
  }
  renderer.render(scene, camera);
}
animate();