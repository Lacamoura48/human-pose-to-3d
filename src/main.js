import {
  scene,
  camera,
  renderer,
  ikSolver,
  controls,
  skinnedMesh,
  ikTargetRightHand,
  ikTargetLeftHand,
  ikTargetRightFoot,
  ikTargetLeftFoot,
  ikTargetHips
} from './ModelSetup.js';
import { landmarkNames } from './constants/landmarkNames.js';
import { poseLandmarks } from './mediapipe.js';
import { scalesAndOffsets } from './constants/scalesAndOffsets.js';
import { setHipsRotation } from './utils/helpers.js';
import * as THREE from 'three';

const { hands, feet } = scalesAndOffsets;
const lerpFactor = 0.2; // Adjust for speed, 0.1 is a common starting point

// Animation loop
function animate() {

  requestAnimationFrame(animate);
  controls.update();
  if (ikSolver && poseLandmarks) {
    const rightHandLm = poseLandmarks[landmarkNames['RIGHT_WRIST']];
    const leftHandLm = poseLandmarks[landmarkNames['LEFT_WRIST']];
    const rightFootLm = poseLandmarks[landmarkNames['RIGHT_ANKLE']];
    const leftFootLm = poseLandmarks[landmarkNames['LEFT_ANKLE']];
    const leftHip = poseLandmarks[landmarkNames['LEFT_HIP']];
    const rightHip = poseLandmarks[landmarkNames['RIGHT_HIP']];


    if (leftHip && rightHip && ikTargetHips) {
      setHipsRotation(ikTargetHips, leftHip, rightHip, lerpFactor);
    }
    if (ikTargetRightHand && rightHandLm) {
      const targetPosition = new THREE.Vector3(
        rightHandLm.x * hands.x.scale - hands.x.offset,
        rightHandLm.y * hands.y.scale + hands.y.offset,
        rightHandLm.z * hands.z.scale + hands.z.offset
      );
      ikTargetRightHand.position.lerp(targetPosition, lerpFactor);
    }
    if (ikTargetLeftHand && leftHandLm) {
      const targetPosition = new THREE.Vector3(
        leftHandLm.x * hands.x.scale + hands.x.offset,
        leftHandLm.y * hands.y.scale + hands.y.offset,
        leftHandLm.z * hands.z.scale + hands.z.offset
      );
      ikTargetLeftHand.position.lerp(targetPosition, lerpFactor);
    }
    if (ikTargetRightFoot && rightFootLm) {
      const targetPosition = new THREE.Vector3(
        rightFootLm.x * feet.x.scale + feet.x.offset,
        (rightFootLm.y * feet.y.scale) / feet.y.offset + feet.y.scale,
        rightFootLm.z * feet.z.scale + feet.z.offset
      );
      ikTargetRightFoot.position.lerp(targetPosition, lerpFactor);
    }
    if (ikTargetLeftFoot && leftFootLm) {
      const targetPosition = new THREE.Vector3(
        leftFootLm.x * feet.x.scale + feet.x.offset,
        (leftFootLm.y * feet.y.scale) / feet.y.offset + feet.y.scale,
        leftFootLm.z * feet.z.scale + feet.z.offset
      );
      ikTargetLeftFoot.position.lerp(targetPosition, lerpFactor);
    }
    ikSolver.update();
  }

  renderer.render(scene, camera);
}

animate();
