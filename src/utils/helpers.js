import * as THREE from 'three';

function estimateSpineRotation(lh, rh) {
    const hipVector = { x: lh.x - rh.x, z: lh.z - rh.z };
    const angleRad = Math.atan2(hipVector.z, hipVector.x);
    return angleRad;
}

export function setHipsRotation(ikTargetHips, leftHip, rightHip, lerpFactor = 0.3) {
    if (!leftHip || !rightHip || !ikTargetHips) return;

    const centerRotation = estimateSpineRotation(leftHip, rightHip);

    // Target position for hips
    const targetPosition = new THREE.Vector3(
        -(leftHip.x + rightHip.x) * 130 / 2,
        ikTargetHips.position.y, // Maintain current Y or set to a target Y if needed
        (leftHip.z + rightHip.z) * -65 / 2
    );

    // Lerp position
    ikTargetHips.position.lerp(targetPosition, lerpFactor);

    // Lerp rotation.y
    // Ensure the target rotation is handled correctly for shortest path if crossing -PI/PI boundary
    // For simplicity, a direct lerp is used here. For more complex scenarios, consider quaternion slerp.
    let currentAngle = ikTargetHips.rotation.y;
    let targetAngle = centerRotation;

    // Normalize angles to ensure shortest path for lerp if necessary,
    // though MathUtils.lerp handles this reasonably for simple cases.
    // For more robust angle lerping, especially across the -PI to PI boundary:
    const twoPi = Math.PI * 2;
    while (targetAngle - currentAngle > Math.PI) targetAngle -= twoPi;
    while (targetAngle - currentAngle < -Math.PI) targetAngle += twoPi;
    
    ikTargetHips.rotation.y = THREE.MathUtils.lerp(currentAngle, targetAngle, lerpFactor);
}