import { Pose } from '@mediapipe/pose';

const videoElement = document.getElementById('videoPreview');
const fileInput = document.getElementById('videoUpload');

const pose = new Pose({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
});
pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false, // Set to true if you want segmentation masks
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

pose.onResults(onResults);

export let poseLandmarks = null;

function onResults(results) {
  if (results.poseWorldLandmarks) {
    poseLandmarks = results.poseWorldLandmarks;
    // console.log('Pose world landmarks:', poseLandmarks); // For debugging
  } else {
    poseLandmarks = null;
  }
  // If you were drawing on a canvas, you'd do it here.
  // e.g., drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
  // drawLandmarks(canvasCtx, results.poseLandmarks, {color: '#FF0000', lineWidth: 2});
}

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      videoElement.src = e.target.result;
      videoElement.onloadeddata = () => {
        videoElement.play();
        sendVideoFrame();
      };
    };
    reader.readAsDataURL(file);
  }
});

async function sendVideoFrame() {
  if (!videoElement.paused && videoElement.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    await pose.send({ image: videoElement });
  }
    requestAnimationFrame(sendVideoFrame);
}

// Remove or comment out the automatic startPoseDetection if it processes a static image
// startPoseDetection();