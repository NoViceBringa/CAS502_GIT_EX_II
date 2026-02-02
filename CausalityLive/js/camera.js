import * as THREE from 'three';

const isMobile = window.innerWidth < 600;

export function initCamera() {
    const fov    = isMobile ? 45 : 30;                       // wider FOV on mobile
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    camera.position.set(0, 0, 3);
    return camera;
}

export function updateCameraOnResize(camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov    = window.innerWidth < 600 ? 45 : 30;      // recalc FOV on resize
    camera.updateProjectionMatrix();
}
