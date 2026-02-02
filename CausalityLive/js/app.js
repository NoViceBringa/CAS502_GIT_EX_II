// app.js
import * as THREE from 'three';
import { initScene } from './scene.js';
import { initCamera, updateCameraOnResize } from './camera.js';
import { initRenderer, renderScene, updateRendererSize } from './renderer.js';
import { loadModels } from './models.js';
import {
  handlePointerDown,
  handlePointerMove,
  handlePointerUp
} from './controls.js';
import {
  animate as startAnimation,
  setModel,
  updateRotationSpeed
} from './animations.js';

function throttle(func, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function getPinchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.hypot(dx, dy);
}

let scene, camera, renderer, model;
let initialPinchDistance = null;

// Mobile‑first defaults
const isMobile    = window.innerWidth < 600;
let rotationSpeed = isMobile ? 0.015 : 0.025;
let zoomSpeed     = isMobile ? 0.9  : 0.3;
let targetZoom;

const container = document.getElementById('3d-container');

function init() {
  // 1) Core setup
  scene      = initScene();
  camera     = initCamera();
  targetZoom = camera.position.z;

  renderer = initRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // 1a) Sync initial sizes
  updateCameraOnResize(camera);
  updateRendererSize(renderer);

  // 2) Canvas tweaks
  const canvas = renderer.domElement;
  canvas.style.touchAction = 'none';
  canvas.addEventListener('contextmenu', e => e.preventDefault());

  // 3) Load model and register for animation
  loadModels(scene);
  scene.traverse(child => {
    if (child.isMesh) {
      model = child;
      model.rotation.x = Math.PI / 4;
      model.rotation.y = Math.PI / 2;
      setModel(model);
      updateRotationSpeed(rotationSpeed);
    }
  });

  // 4) Wire up all interactions
  setupEventListeners(canvas);

  // 5) Start loop
  animate();
}

function setupEventListeners(canvas) {
  // a) Resize/orientation
  const handleResize = throttle(() => {
    updateCameraOnResize(camera);
    updateRendererSize(renderer);
    renderer.setPixelRatio(window.devicePixelRatio);
  }, 100);
  window.addEventListener('resize', handleResize, false);
  window.addEventListener('orientationchange', handleResize, false);

  // b) Pointer capture for drag‑to‑rotate
  canvas.addEventListener('pointerdown', e => {
    handlePointerDown(e);
    canvas.setPointerCapture(e.pointerId);
  }, { passive: false });
  canvas.addEventListener('pointermove', handlePointerMove, { passive: false });
  canvas.addEventListener('pointerup', e => {
    handlePointerUp(e);
    canvas.releasePointerCapture(e.pointerId);
  }, { passive: false });

  // c) Wheel zoom/rotation
  const handleWheel = throttle(handleScroll, 100);
  canvas.addEventListener('wheel', handleWheel, { passive: false });

  // d) Pinch‑to‑zoom
  canvas.addEventListener('touchstart', e => {
    if (e.touches.length === 2) {
      e.preventDefault();
      initialPinchDistance = getPinchDistance(e.touches);
    }
  }, { passive: false });
                canvas.addEventListener('touchmove', e => {
          if (e.touches.length === 2 && initialPinchDistance != null) {
            e.preventDefault();
            const newDist = getPinchDistance(e.touches);
            const delta = newDist - initialPinchDistance;
        
            // Introduce a minimum threshold to avoid reacting to small movements
            const pinchThreshold = 5; // Adjust this value as needed
            if (Math.abs(delta) > pinchThreshold) {
              // Introduce a damping factor to smooth zoom changes
              const dampingFactor = 0.1; // Lower value for smoother zoom
              const zoomChange = (delta / window.innerHeight) * (10 - 1) * dampingFactor;
        
              // Smoothly interpolate targetZoom to avoid abrupt changes
              targetZoom += (THREE.MathUtils.clamp(targetZoom - zoomChange, 1, 10) - targetZoom) * 0.2;
        
              // Update initialPinchDistance for the next frame
              initialPinchDistance = newDist;
            }
          }
        }, { passive: false });
        
        canvas.addEventListener('touchend', e => {
          // Reset initialPinchDistance only when all touches are lifted
          if (e.touches.length < 2) {
            initialPinchDistance = null;
          }
        }, false);
}

function handleScroll(event) {
  if (event.deltaY < 0) {
    rotationSpeed = Math.max(0.001, rotationSpeed - 0.01);
    targetZoom     = Math.max(1, targetZoom - zoomSpeed);
  } else {
    rotationSpeed = Math.min(0.5, rotationSpeed + 0.01);
    targetZoom     = Math.min(10, targetZoom + zoomSpeed);
  }
  updateRotationSpeed(rotationSpeed);
}

function animate() {
  requestAnimationFrame(animate);
  camera.position.z += (targetZoom - camera.position.z) * 0.3;
  startAnimation();
  renderScene(renderer, scene, camera);
}

init();
