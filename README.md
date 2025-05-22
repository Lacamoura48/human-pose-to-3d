# CCDIKSolver + Mixamo 3D Model Example

Welcome to an interactive playground for real-time 3D character posing and Inverse Kinematics (IK) using [Three.js](https://threejs.org/) and the powerful [CCDIKSolver](https://threejs.org/docs/#examples/en/animation/CCDIKSolver)!

## ✨ What is this?
This project demonstrates how to load a Mixamo 3D character, visualize its skeleton, and manipulate its limbs and joints using CCD (Cyclic Coordinate Descent) IK in the browser. Move the hands, feet, or hips with intuitive controls and watch the character's pose update in real time—no animation experience required!

- **CCDIKSolver Integration**: Real-time IK for hands and feet, with joint constraints for natural movement.
- **Transform Controls**: Drag and position IK targets directly in the scene.

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
4. **Interact!**
   - Use your mouse to orbit, pan, and zoom the camera.
   - Drag the colored controls attached to the character’s hands, feet, and hips to pose the model.

## 🧩 How It Works
- The app loads a Mixamo character (`bot.glb`) and extracts its skeleton.
- For each IK target (hands, feet, hips), a draggable control is created using `TransformControls`.
- The [CCDIKSolver](https://threejs.org/docs/#examples/en/animation/CCDIKSolver) updates the skeleton in real time, solving for natural joint rotations using min and max rotation for each joint.
- All logic is in [`src/main.js`](src/main.js), with bone names in [`src/boneNames.js`](src/boneNames.js).

## 📦 Project Structure
```
public/
  bot.glb         # Mixamo 3D character model
  icon.svg        # App icon
src/
  main.js         # Main Three.js logic and IK setup
  boneNames.js    # List of bone names for IK
  style.css       # App styling
index.html        # App entry point
package.json      # Project config
```

## 🖼️ Credits
- **3D Model:** [Mixamo](https://www.mixamo.com/)
- **3D Engine & IK:** [Three.js](https://threejs.org/), [CCDIKSolver](https://threejs.org/docs/#examples/en/animation/CCDIKSolver)
- **Author:** [Anas Sghir](https://github.com/Lacamoura48)

## 🌟 Inspiration
This project is a creative sandbox for anyone curious about 3D model animation, rigging, or inverse knematics. Tweak, pose, and experiment—bring your character to life!
