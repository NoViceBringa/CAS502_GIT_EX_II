// renderer.js
import * as THREE from 'three';

export function initRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    return renderer;
}

export function renderScene(renderer, scene, camera) {
    renderer.render(scene, camera);
}

export function updateRendererSize(renderer) {
    renderer.setSize(window.innerWidth, window.innerHeight);
}
