import { setMouseDown, getModel, updateVelocity } from './animations.js';

let previousPointerPosition = { x: 0, y: 0 };
let isPointerDown = false;

// Per‑axis smoothing: 1 = full speed, 0 = locked
const smoothing = { x: 1.0, y: 0.5 };

export function handlePointerDown(event) {
  event.preventDefault();
  isPointerDown = true;
  setMouseDown(true);
  previousPointerPosition = {
    x: event.clientX,
    y: event.clientY
  };
}

export function handlePointerMove(event) {
  if (!isPointerDown) return;
  event.preventDefault();

  const model = getModel();
  if (!model) return;

  const deltaMove = {
    x: event.clientX - previousPointerPosition.x,
    y: event.clientY - previousPointerPosition.y
  };

  // feed into inertia/smoothing system
  updateVelocity(
    deltaMove.x * smoothing.x,
    deltaMove.y * smoothing.y
  );

  previousPointerPosition = {
    x: event.clientX,
    y: event.clientY
  };
}

export function handlePointerUp(event) {
  event.preventDefault();
  isPointerDown = false;
  setMouseDown(false);
}
