# MediaPipe Pose Detection + 3D Model Animation

Welcome to a real-time pose detection application that captures human poses from video input and applies them to a 3D character using [MediaPipe](https://mediapipe.dev/), [Three.js](https://threejs.org/), and [CCDIKSolver](https://threejs.org/docs/#examples/en/animation/CCDIKSolver)!

## ✨ What is this?
This project demonstrates how to detect human poses from video input using MediaPipe's pose detection model and transfer those poses to a Mixamo 3D character in real time. Upload a video, watch the AI detect the human pose, and see your 3D model mirror those movements with natural joint constraints!

- **MediaPipe Integration**: Real-time human pose detection from video input
- **CCDIKSolver Integration**: Natural pose transfer to 3D model with joint constraints
- **Video Input Support**: Upload and process video files for pose detection

## 🕹️ How to Use
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the development server:**
   ```sh
   npm run dev
   ```
3. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).
4. **Upload and Animate!**
   - Click the video input to upload a video file
   - Watch as MediaPipe detects the human pose in the video
   - See your 3D character automatically mirror the detected poses
   - Use your mouse to orbit, pan, and zoom the camera around the animated model

## 🧩 How It Works
- MediaPipe's pose detection model analyzes the uploaded video frame by frame
- Detected pose landmarks are mapped to the 3D model's bone structure
- The [CCDIKSolver](https://threejs.org/docs/#examples/en/animation/CCDIKSolver) applies the poses to the skeleton with natural joint constraints
- Real-time pose transfer creates smooth, realistic character animation from human movement
- All logic is in [`src/main.js`](src/main.js), with bone names in [`src/boneNames.js`](src/boneNames.js)

## 📦 Project Structure
```
public/
  bot.glb         # Mixamo 3D character model
  icon.svg        # App icon
src/
  main.js         # Main Three.js, MediaPipe, and IK setup
  boneNames.js    # List of bone names for pose mapping
  style.css       # App styling
index.html        # App entry point with video input
package.json      # Project config
```

## 🖼️ Credits
- **3D Model:** [Mixamo](https://www.mixamo.com/)
- **Pose Detection:** [MediaPipe](https://mediapipe.dev/)
- **3D Engine & IK:** [Three.js](https://threejs.org/), [CCDIKSolver](https://threejs.org/docs/#examples/en/animation/CCDIKSolver)
- **Author:** [Anas Sghir](https://github.com/Lacamoura48)

## 🌟 Inspiration
This project bridges the gap between human movement and 3D animation using cutting-edge pose detection technology. Upload any video of human movement and watch your 3D character come to life with the same poses and gestures!
