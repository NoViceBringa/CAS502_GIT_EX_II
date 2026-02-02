import * as THREE from 'three';

export function initScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);  // Set a background color

    // Add ambient light (soft global light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light with half intensity
    scene.add(ambientLight);

    // Add directional light (acts like sunlight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light with full intensity
    directionalLight.position.set(5, 10, 7.5); // Position the light source
    scene.add(directionalLight);

    return scene;
}
