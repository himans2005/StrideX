import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

import { GLTFLoader } from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js";


const stage =
    document.getElementById("avatarStage");


if (!stage) {

    console.error(
        "Astra 3D: #avatarStage not found."
    );

} else {


    /* =====================================================
       SCENE
    ===================================================== */

    const scene =
        new THREE.Scene();


    /* =====================================================
       CAMERA
    ===================================================== */

    const camera =
        new THREE.PerspectiveCamera(
            35,
            stage.clientWidth /
            stage.clientHeight,
            0.1,
            100
        );


    camera.position.set(
        0,
        1.1,
        3.2
    );


    /* =====================================================
       RENDERER
    ===================================================== */

    const renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        stage.clientWidth,
        stage.clientHeight
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.shadowMap.enabled = true;


    renderer.domElement.classList.add(
        "astra-3d-canvas"
    );


    stage.appendChild(
        renderer.domElement
    );


    /* =====================================================
       LIGHTING
    ===================================================== */

    const ambientLight =
        new THREE.HemisphereLight(
            0xffffff,
            0x222233,
            2.2
        );


    scene.add(
        ambientLight
    );


    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            2.5
        );


    keyLight.position.set(
        2,
        4,
        4
    );


    keyLight.castShadow = true;


    scene.add(
        keyLight
    );


    const fillLight =
        new THREE.DirectionalLight(
            0xc8b9ff,
            1.2
        );


    fillLight.position.set(
        -3,
        2,
        2
    );


    scene.add(
        fillLight
    );


    /* =====================================================
       REMY MODEL
    ===================================================== */

    const loader =
        new GLTFLoader();


    loader.load(

        "./ASTRA_REMY.glb",

        (gltf) => {

            const model =
                gltf.scene;


            console.log(
                "ASTRA_REMY.glb loaded successfully.",
                model
            );


            model.position.set(
                0,
                -1.05,
                0
            );


            model.scale.set(
                1,
                1,
                1
            );


            model.traverse(
                (object) => {

                    if (
                        object.isMesh
                    ) {

                        object.castShadow = true;

                        object.receiveShadow = true;

                    }

                }
            );


            scene.add(
                model
            );


            window.astraRemy =
                model;


            /* =============================================
               AUTO CENTER MODEL
            ============================================= */

            const box =
                new THREE.Box3()
                    .setFromObject(model);


            const center =
                box.getCenter(
                    new THREE.Vector3()
                );


            model.position.x -=
                center.x;


            model.position.z -=
                center.z;


            console.log(
                "Astra Remy ready."
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


    /* =====================================================
       RESIZE
    ===================================================== */

    function resizeRenderer() {

        const width =
            stage.clientWidth;


        const height =
            stage.clientHeight;


        if (
            width === 0 ||
            height === 0
        ) {
            return;
        }


        camera.aspect =
            width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );

    }


    window.addEventListener(
        "resize",
        resizeRenderer
    );


    resizeRenderer();


    /* =====================================================
       RENDER LOOP
    ===================================================== */

    function animate() {

        requestAnimationFrame(
            animate
        );


        renderer.render(
            scene,
            camera
        );

    }


    animate();

}