// javascript
// Import Three.js core and GLTFLoader
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CCDIKSolver } from 'three/examples/jsm/animation/CCDIKSolver.js';
import { boneNames } from './constants/boneNames.js'; // Import boneNames

// Function to create IK target and TransformControls
function createIKTargetAndControl(bone, scene, targetName) { // Added targetName for coloring
  const ikTarget = bone
  bone.getWorldPosition(ikTarget.position); // Position at the bone's initial position

  // Create a visual sphere for the IK target
  // const sphereGeometry = new THREE.SphereGeometry(10, 200, 200); // Adjust radius (0.05) as needed
  // let sphereColor = 0xff0000; // Default red
  // if (targetName) {
  //   if (targetName.toLowerCase().includes('left')) {
  //     sphereColor = 0x00ff00; // Green for left targets
  //   } else if (targetName.toLowerCase().includes('right')) {
  //     sphereColor = 0x0000ff; // Blue for right targets
  //   } else if (targetName.toLowerCase().includes('hips')) {
  //     sphereColor = 0xffff00; // Yellow for hips
  //   }

  // }
  // const sphereMaterial = new THREE.MeshBasicMaterial({ color: sphereColor, wireframe: true });
  // const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // ikTarget.add(sphereMesh); // Add sphere as a child of ikTarget

  scene.add(ikTarget);
  return ikTarget;
}

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222229);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 220);

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
let skinnedMesh;


loader.load('/bot.glb', (gltf) => {
  const model = gltf.scene;
  console.log('Model loaded:', model); // Adjusted log
  
  scene.add(model);
  model.traverse((obj) => {
    if (obj.isSkinnedMesh && obj.skeleton) {
      skinnedMesh = obj;
      console.log('SkinnedMesh found:', skinnedMesh.name); // Adjusted log
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
    bones[name] = skeleton.bones.find((b) => b.name.includes(name));
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
  ikTargetHips = createIKTargetAndControl(bones['Hips'], scene, 'HipsTarget');
  ikTargetRightHand = createIKTargetAndControl(bones['RightHandMiddle4'], scene, 'RightHandTarget');
  ikTargetLeftHand = createIKTargetAndControl(bones['LeftHandMiddle4'], scene, 'LeftHandTarget');
  ikTargetRightFoot = createIKTargetAndControl(bones['RightToe_End'], scene, 'RightFootTarget');
  ikTargetLeftFoot = createIKTargetAndControl(bones['LeftToe_End'], scene, 'LeftFootTarget');



  // Set up CCDIKSolver
  const iks = [
    { // Right Hand
      target: getBoneIndex('RightHandMiddle4'),
      effector: getBoneIndex('RightHand'),
      links: [
        { index: getBoneIndex('RightForeArm'), limitation: new THREE.Vector3(bones['RightForeArm'].position.y, -bones['RightForeArm'].position.x, 0).normalize() },
        { index: getBoneIndex('RightArm'), rotationMin: new THREE.Vector3(-Math.PI / 4, -Math.PI / 2, -Math.PI / 4), rotationMax: new THREE.Vector3(Math.PI / 4, Math.PI / 2, Math.PI / 4) },
        { index: getBoneIndex('RightShoulder'), rotationMin: new THREE.Vector3(-Math.PI / 20, -Math.PI / 20, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, Math.PI / 20, Math.PI / 20) },
        // { index: getBoneIndex('Spine2'), rotationMin: new THREE.Vector3(-Math.PI / 20, 0, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, 0, Math.PI / 20) },
        // { index: getBoneIndex('Spine1'), rotationMin: new THREE.Vector3(-Math.PI / 20, 0, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, 0, Math.PI / 20) },
        // { index: getBoneIndex('Spine'), rotationMin: new THREE.Vector3(-Math.PI / 20, 0, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, 0, Math.PI / 20) },
      ],
    },
    { // Left Hand
      target: getBoneIndex('LeftHandMiddle4'),
      effector: getBoneIndex('LeftHand'),
      links: [
        { index: getBoneIndex('LeftForeArm'), limitation: new THREE.Vector3(bones['LeftForeArm'].position.y, -bones['LeftForeArm'].position.x, 0).normalize() },
        { index: getBoneIndex('LeftArm'), rotationMin: new THREE.Vector3(-Math.PI / 4, -Math.PI / 2, -Math.PI / 4), rotationMax: new THREE.Vector3(Math.PI / 4, Math.PI / 2, Math.PI / 4) },
        { index: getBoneIndex('LeftShoulder'), rotationMin: new THREE.Vector3(-Math.PI / 20, -Math.PI / 20, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, Math.PI / 20, Math.PI / 20) },
        // { index: getBoneIndex('Spine2'), rotationMin: new THREE.Vector3(-Math.PI / 20, -Math.PI / 20, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, Math.PI / 20, Math.PI / 20) },
        // { index: getBoneIndex('Spine1'), rotationMin: new THREE.Vector3(-Math.PI / 20, -Math.PI / 20, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, Math.PI / 20, Math.PI / 20) },
        // { index: getBoneIndex('Spine'), rotationMin: new THREE.Vector3(-Math.PI / 20, -Math.PI / 20, -Math.PI / 20), rotationMax: new THREE.Vector3(Math.PI / 20, Math.PI / 20, Math.PI / 20) },
      ],
    },
    { // Right Leg
      target: getBoneIndex('RightToe_End'),
      effector: getBoneIndex('RightFoot'),
      links: [
        { index: getBoneIndex('RightLeg'), rotationMin: new THREE.Vector3(0, 0, -Math.PI / 24), rotationMax: new THREE.Vector3(2.61799, 0, Math.PI / 24) }, // Knee
        { index: getBoneIndex('RightUpLeg'), rotationMin: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 3), rotationMax: new THREE.Vector3(Math.PI / 2, 0, Math.PI / 3) }, // Hip
      ],
    },
    { // Left Leg
      target: getBoneIndex('LeftToe_End'),
      effector: getBoneIndex('LeftFoot'),
      links: [
        { index: getBoneIndex('LeftLeg'), rotationMin: new THREE.Vector3(0, 0, -Math.PI / 24), rotationMax: new THREE.Vector3(2.61799, 0, Math.PI / 24) }, // Knee
        { index: getBoneIndex('LeftUpLeg'), rotationMin: new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 3), rotationMax: new THREE.Vector3(Math.PI / 2, 0, Math.PI / 3) }, // Hip
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
// function animate() {
//   requestAnimationFrame(animate);
//   controls.update();
//   if (ikSolver && ikTargetRightHand && ikTargetLeftHand && ikTargetRightFoot && ikTargetLeftFoot && ikTargetHips) {
//     ikSolver.update();
//   }
//   renderer.render(scene, camera);
// }
// animate();

export {scene, camera, renderer, controls, ikSolver, skinnedMesh, ikTargetRightHand, ikTargetLeftHand, ikTargetRightFoot, ikTargetLeftFoot, ikTargetHips};
