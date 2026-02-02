import * as THREE from 'three';
import { setModel } from './animations.js';
import { MODEL_PATH } from './config.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export function loadModels(scene) {
    const loader = new OBJLoader();

    loader.load(
        MODEL_PATH,
        (object) => {
            // Add to scene and pass to animations
            scene.add(object);
            setModel(object);

            // Adjust transform as needed
            object.position.set(0, 0, -3);
            object.scale.set(1, 1, 1);
            object.rotation.x = Math.PI / 2;
            object.rotation.y = Math.PI / 2;
        },
        (xhr) => console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`),
        (error) => console.error('OBJ load error:', error)
    );
}
