import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { GLTFLoader } from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";

const stage = document.getElementById("avatarStage");

if (!stage) {
    console.error("Astra 3D: #avatarStage not found.");
} else {

    const scene = new THREE.Scene();
    const clock = new THREE.Clock();
    const camera = new THREE.PerspectiveCamera(
        35,
        stage.clientWidth / stage.clientHeight,
        0.1,
        100
    );

    camera.position.set(0, 1.1, 3.2);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        stage.clientWidth,
        stage.clientHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.shadowMap.enabled = true;

    renderer.domElement.classList.add(
        "astra-3d-canvas"
    );

    stage.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.HemisphereLight(
        0xffffff,
        0x222233,
        2.2
    );

    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(
        0xffffff,
        2.5
    );

    keyLight.position.set(2, 4, 4);
    keyLight.castShadow = true;

    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(
        0xc8b9ff,
        1.2
    );

    fillLight.position.set(-3, 2, 2);

    scene.add(fillLight);

    // Load Remy
    const loader = new GLTFLoader();

    loader.load(
        "./ASTRA_REMY.glb",

        (gltf) => {
            console.log(
                "ASTRA animation names:",
                gltf.animations.map(animation => animation.name)
            );
            const model = gltf.scene;

            console.log(
                "ASTRA_REMY.glb loaded successfully.",
                model
            );

            // =====================================================
            // ASTRA REMY - AUTO FRAME
            // =====================================================

            model.traverse((object) => {

                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }

            });

            scene.add(model);

            window.astraRemy = model;
            // =====================================================
            // ASTRA CLOTHING SYSTEM
            // =====================================================

            window.astraClothing = {
                tops: null,
                bottoms: null,
                shoes: null
            };

            model.traverse((object) => {

                const name = object.name.toLowerCase();

                if (name === "tops" || name.includes("tops")) {
                    window.astraClothing.tops = object;
                }

                if (name === "bottoms" || name.includes("bottoms")) {
                    window.astraClothing.bottoms = object;
                }

                if (name === "shoes" || name.includes("shoes")) {
                    window.astraClothing.shoes = object;
                }

            });

            console.log(
                "ASTRA clothing objects:",
                window.astraClothing
            );


            // =====================================================
            // ASTRA CLOTHING VISIBILITY
            // =====================================================

            window.showTop = function () {

                if (window.astraClothing.tops) {
                    window.astraClothing.tops.visible = true;
                }

            };

            window.hideTop = function () {

                if (window.astraClothing.tops) {
                    window.astraClothing.tops.visible = false;
                }

            };

            window.showBottom = function () {

                if (window.astraClothing.bottoms) {
                    window.astraClothing.bottoms.visible = true;
                }

            };

            window.hideBottom = function () {

                if (window.astraClothing.bottoms) {
                    window.astraClothing.bottoms.visible = false;
                }

            };

            window.showShoes = function () {

                if (window.astraClothing.shoes) {
                    window.astraClothing.shoes.visible = true;
                }

            };

            window.hideShoes = function () {

                if (window.astraClothing.shoes) {
                    window.astraClothing.shoes.visible = false;
                }

            };
            // =========================================================
            // ASTRA PRODUCT -> 3D AVATAR
            // =========================================================

            window.applyAstraProduct = function (product) {

                if (!product || !window.astraClothing) return;

                let target = null;

                if (product.category === "tops") {
                    target = window.astraClothing.tops;
                }

                if (product.category === "bottoms") {
                    target = window.astraClothing.bottoms;
                }

                if (product.category === "shoes") {
                    target = window.astraClothing.shoes;
                }

                // Outerwear ke liye abhi separate 3D mesh nahi hai
                if (product.category === "outerwear") {
                    console.log("ASTRA: Outerwear 3D asset not available yet.");
                    return;
                }

                if (!target) return;

                // Clothing visible karo
                target.visible = true;

                // Product ka color 3D clothing par apply karo
                target.traverse((object) => {

                    if (!object.isMesh) return;

                    const materials = Array.isArray(object.material)
                        ? object.material
                        : [object.material];

                    materials.forEach((material) => {

                        if (material && material.color) {
                            material.color.set(product.colorCode);
                            material.needsUpdate = true;
                        }

                    });

                });

                console.log(
                    "ASTRA 3D product applied:",
                    product.name,
                    product.colorCode
                );
            };
            // =====================================================
            // ASTRA REMY - ANIMATION PLAYER
            // =====================================================

            const mixer = new THREE.AnimationMixer(model);

            window.astraMixer = mixer;

            if (gltf.animations.length > 0) {

                const animation = gltf.animations[0];
                console.log("Animation duration:", animation.duration);
                console.log("Animation tracks:", animation.tracks.length);
                console.log(
                    "First tracks:",
                    animation.tracks.slice(0, 10).map(track => track.name)
                );

                console.log(
                    "ASTRA playing animation:",
                    animation.name
                );

                const action = mixer.clipAction(animation);
                action.setLoop(THREE.LoopRepeat, Infinity);
                action.reset();
                action.play();
            }
            // =====================================================
            // ASTRA REMY - MOUSE ROTATION
            // =====================================================

            let isDragging = false;
            let previousMouseX = 0;

            const rotationSpeed = 0.01;

            // Make sure canvas can receive mouse input
            renderer.domElement.style.pointerEvents = "auto";
            renderer.domElement.style.cursor = "grab";

            renderer.domElement.addEventListener("mousedown", (event) => {

                isDragging = true;
                previousMouseX = event.clientX;

                renderer.domElement.style.cursor = "grabbing";

                event.preventDefault();
            });

            window.addEventListener("mousemove", (event) => {

                if (!isDragging || !window.astraRemy) {
                    return;
                }

                const deltaX =
                    event.clientX - previousMouseX;

                window.astraRemy.rotation.y +=
                    deltaX * rotationSpeed;

                previousMouseX = event.clientX;
            });

            window.addEventListener("mouseup", () => {

                isDragging = false;

                renderer.domElement.style.cursor = "grab";
            });
            // =====================================================
            // ASTRA REMY - MOUSE WHEEL ZOOM
            // =====================================================

            renderer.domElement.addEventListener("wheel", (event) => {

                event.preventDefault();

                camera.position.z += event.deltaY * 0.003;

                // Zoom limits
                camera.position.z = THREE.MathUtils.clamp(
                    camera.position.z,
                    3.5,
                    9
                );

            }, { passive: false });


            // Get model dimensions
            const box = new THREE.Box3().setFromObject(model);

            const size = box.getSize(
                new THREE.Vector3()
            );

            const center = box.getCenter(
                new THREE.Vector3()
            );


            // Find model height
            const modelHeight = size.y;


            // Target height inside Astra preview
            const targetHeight = 1.85;


            // Scale model automatically
            const fitScale =
                targetHeight / modelHeight;

            model.scale.setScalar(
                fitScale
            );


            // Recalculate bounds after scaling
            const scaledBox =
                new THREE.Box3().setFromObject(model);

            const scaledCenter =
                scaledBox.getCenter(
                    new THREE.Vector3()
                );


            // Center horizontally
            // Center model
            model.position.x = 0;
            model.position.y = 0;
            model.position.z = 0;

            // Camera position
            camera.position.set(
                0,
                1.0,
                6.5
            );

            // Camera target
            camera.lookAt(
                0,
                1.0,
                0
            );

            console.log(
                "Astra Remy ready - auto framed.",
                {
                    originalHeight: modelHeight,
                    scale: fitScale
                }
            );
        },

        undefined,

        (error) => {

            console.error(
                "Astra 3D: GLB loading failed.",
                error
            );

        }
    );

    // Resize
    function resizeRenderer() {

        const width = stage.clientWidth;
        const height = stage.clientHeight;

        if (width === 0 || height === 0) {
            return;
        }

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    window.addEventListener(
        "resize",
        resizeRenderer
    );

    resizeRenderer();

    // Render loop
    function animate() {

        requestAnimationFrame(animate);

        const delta = clock.getDelta();

        if (window.astraMixer) {
            window.astraMixer.update(delta);
        }

        renderer.render(
            scene,
            camera
        );
    }

    animate();
}