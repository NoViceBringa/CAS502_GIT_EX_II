// animations.js

let model = null;
let isPointerDown = false;
let velocity = { x: 0, y: 0 };
let rotationSpeed = 0.025;    // baseline spin
const damping = 0.90;         // inertia friction (0=no inertia, 1=no friction)
const velocityScale = 0.005;  // match your old scaling

export function setModel(m) {
  model = m;
}

export function getModel() {
  return model;
}

export function setMouseDown(state) {
  isPointerDown = state;
}

export function updateRotationSpeed(speed) {
  rotationSpeed = speed;
}

export function updateVelocity(deltaX, deltaY) {
  // scale the raw pointer delta to match your previous behavior
  velocity.x = deltaX * velocityScale;
  velocity.y = deltaY * velocityScale;
}

export function animate() {
  if (!model) return;

  // 1) baseline constant spin
  model.rotation.z += rotationSpeed;

  // 2) apply the drag‑inertia on every frame
  model.rotation.y += velocity.x;
  model.rotation.x += velocity.y;

  // 3) when not dragging, apply friction
  if (!isPointerDown) {
    velocity.x *= damping;
    velocity.y *= damping;
    // zero‑out tiny velocities
    if (Math.abs(velocity.x) < 0.0001) velocity.x = 0;
    if (Math.abs(velocity.y) < 0.0001) velocity.y = 0;
  }
}
