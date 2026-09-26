/* =========================================================
   ASTRA — STRIDEX
   COMPLETE FRESH JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =========================================================
       PRODUCTS
    ========================================================= */

    const products = [

        {
            id: "SX001",
            name: "Oversized Black Tee",
            category: "tops",
            type: "T-Shirt",
            price: 999,
            color: "Black",
            fit: "Oversized",
            style: "Casual",
            colorCode: "#292b31",
            description:
                "A clean oversized silhouette designed for everyday styling."
        },

        {
            id: "SX002",
            name: "Cloud White Shirt",
            category: "tops",
            type: "Shirt",
            price: 1299,
            color: "White",
            fit: "Relaxed",
            style: "Smart Casual",
            colorCode: "#d9d9d4",
            description:
                "A relaxed white shirt that works across casual and smart looks."
        },

        {
            id: "SX003",
            name: "Relaxed Blue Jeans",
            category: "bottoms",
            type: "Jeans",
            price: 1599,
            color: "Blue",
            fit: "Relaxed",
            style: "Casual",
            colorCode: "#526b89",
            description:
                "Easy relaxed denim with a modern everyday silhouette."
        },

        {
            id: "SX004",
            name: "Stone Straight Trousers",
            category: "bottoms",
            type: "Trousers",
            price: 1499,
            color: "Stone",
            fit: "Straight",
            style: "Smart Casual",
            colorCode: "#8d897c",
            description:
                "Minimal stone trousers for a polished understated outfit."
        },

        {
            id: "SX005",
            name: "Studio White Sneakers",
            category: "shoes",
            type: "Sneakers",
            price: 1899,
            color: "White",
            fit: "Regular",
            style: "Minimal",
            colorCode: "#d9d9d4",
            description:
                "Minimal sneakers designed to pair with almost anything."
        },

        {
            id: "SX006",
            name: "Midnight Overshirt",
            category: "outerwear",
            type: "Overshirt",
            price: 1799,
            color: "Midnight",
            fit: "Relaxed",
            style: "Street",
            colorCode: "#252a34",
            description:
                "A lightweight dark overshirt for layered street looks."
        },

        {
            id: "SX007",
            name: "Graphite Bomber",
            category: "outerwear",
            type: "Jacket",
            price: 2199,
            color: "Graphite",
            fit: "Regular",
            style: "Street",
            colorCode: "#464b55",
            description:
                "A clean bomber layer with a structured contemporary fit."
        },

        {
            id: "SX008",
            name: "Silver Chain",
            category: "accessories",
            type: "Accessory",
            price: 499,
            color: "Silver",
            fit: "One Size",
            style: "Minimal",
            colorCode: "#b8bbc0",
            description:
                "A subtle silver accessory to finish a minimal look."
        }

    ];


    /* =========================================================
       STATE
    ========================================================= */

    const state = {

        category: "all",

        search: "",

        selectedProducts: [],

        avatar: "01",

        pose: "front",

        rotation: 0,

        scale: 1,

        style: "casual"

    };


    /* =========================================================
       ELEMENTS
    ========================================================= */

    const $ = (selector) =>
        document.querySelector(selector);


    const $$ = (selector) =>
        document.querySelectorAll(selector);


    const productGrid =
        $("#productGrid");


    const resultCount =
        $("#resultCount");


    const searchInput =
        $("#searchInput");


    const avatar =
        $("#avatar");


    const selectedLookName =
        $("#selectedLookName");


    const shirtLayer =
        $("#shirtLayer");


    const previewStatus =
        $("#previewStatus");


    const toast =
        $("#toast");


    const chatMessages =
        $("#chatMessages");


    /* =========================================================
       MONEY
    ========================================================= */

    function formatPrice(price) {

        return `₹${price.toLocaleString("en-IN")}`;

    }


    /* =========================================================
       TOAST
    ========================================================= */

    function showToast(message) {

        toast.textContent =
            message;

        toast.classList.add("show");


        clearTimeout(
            showToast.timer
        );


        showToast.timer =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 2000);

    }


    /* =========================================================
       PRODUCT FILTER
    ========================================================= */

    function getFilteredProducts() {

        return products.filter(product => {

            const categoryMatch =
                state.category === "all" ||
                product.category ===
                state.category;


            const searchText =
                `${product.name}
             ${product.type}
             ${product.color}
             ${product.style}`
                    .toLowerCase();


            const searchMatch =
                state.search === "" ||
                searchText.includes(
                    state.search.toLowerCase()
                );


            return (
                categoryMatch &&
                searchMatch
            );

        });

    }


    /* =========================================================
       RENDER PRODUCTS
    ========================================================= */

    function renderProducts() {

        const filtered =
            getFilteredProducts();


        resultCount.textContent =
            `${filtered.length} items`;


        if (filtered.length === 0) {

            productGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                padding:25px 5px;
                text-align:center;
                color:#858b97;
                font-size:10px;
            ">
                No pieces found.
            </div>
        `;

            return;

        }


        productGrid.innerHTML =
            filtered.map(product => {

                const selected =
                    state.selectedProducts
                        .includes(product.id);


                return `

                <button
                    class="product-card ${selected
                        ? "selected"
                        : ""
                    }"
                    data-product-id="${product.id}"
                    style="
                        --product-color:
                        ${product.colorCode};
                    "
                >

                    <span class="product-check">
                        ✓
                    </span>

                    <div class="product-visual">

                        <span class="product-icon">
                            ◇
                        </span>

                    </div>

                    <span class="product-name">
                        ${product.name}
                    </span>

                    <span class="product-price">
                        ${formatPrice(product.price)}
                    </span>

                </button>

            `;

            }).join("");


        $$(".product-card")
            .forEach(card => {

                card.addEventListener(
                    "click",
                    () => {

                        const product =
                            products.find(
                                item =>
                                    item.id ===
                                    card.dataset.productId
                            );


                        if (product) {

                            openProductModal(
                                product
                            );

                        }

                    }
                );

            });

    }


    /* =========================================================
       PRODUCT SELECT
    ========================================================= */

    function selectProduct(product) {

        const alreadySelected =
            state.selectedProducts
                .includes(product.id);


        if (alreadySelected) {

            state.selectedProducts =
                state.selectedProducts
                    .filter(
                        id =>
                            id !==
                            product.id
                    );


            showToast(
                `${product.name} removed`
            );

        } else {

            state.selectedProducts.push(
                product.id
            );


            showToast(
                `${product.name} added`
            );

        }


        updatePreview();

        renderProducts();

    }


    /* =========================================================
       UPDATE PREVIEW
    ========================================================= */

    function updatePreview() {

        const selected =
            state.selectedProducts
                .map(id =>
                    products.find(
                        product =>
                            product.id ===
                            id
                    )
                )
                .filter(Boolean);


        const mainTop =
            selected.find(product =>
                product.category === "tops" ||
                product.category === "outerwear"
            );


        if (mainTop) {

            selectedLookName.textContent =
                mainTop.name;


            shirtLayer.style.background =
                mainTop.colorCode;

        } else {

            selectedLookName.textContent =
                "Studio Essentials";


            shirtLayer.style.background =
                "transparent";

        }


        updatePreviewStatus();

    }


    /* =========================================================
       PREVIEW STATUS
    ========================================================= */

    function updatePreviewStatus() {

        const poseName = {

            front: "Front view",

            side: "Side view",

            walk: "Walk pose"

        };


        const itemCount =
            state.selectedProducts.length;


        previewStatus.textContent =
            `${poseName[state.pose]} · ${itemCount} item${itemCount === 1
                ? ""
                : "s"
            }`;

    }


    /* =========================================================
       CATEGORY
    ========================================================= */

    $$(".category")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.category =
                        button.dataset.category;


                    $$(".category")
                        .forEach(item => {

                            item.classList.toggle(
                                "active",
                                item === button
                            );

                        });


                    renderProducts();

                }
            );

        });


    /* =========================================================
       SEARCH
    ========================================================= */

    searchInput.addEventListener(
        "input",
        () => {

            state.search =
                searchInput.value.trim();


            renderProducts();

        }
    );


    /* =========================================================
       ⭐ BODY COLOUR
    ========================================================= */

    const skinColors = {

        "01": "#a47c68",

        "02": "#c3957e",

        "03": "#73594d"

    };


    function selectAvatar(number) {

        state.avatar =
            number;


        const color =
            skinColors[number];


        if (!color) {
            return;
        }


        /*
            Main CSS variable
        */

        document.documentElement
            .style
            .setProperty(
                "--skin-color",
                color
            );


        /*
            Directly update
            all skin areas
        */

        const skinParts =
            document.querySelectorAll(
                "#avatarHead, #avatarNeck, .avatar-hand, .ear"
            );


        skinParts.forEach(part => {

            part.style.background =
                color;

        });


        /*
            Update mini avatar
        */

        $$(".avatar-option")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.avatar ===
                    number
                );

            });


        showToast(
            `Body colour ${number} selected`
        );

    }


    /* Body colour buttons */

    $$(".avatar-option")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    selectAvatar(
                        button.dataset.avatar
                    );

                }
            );

        });


    /* =========================================================
       POSE
    ========================================================= */

    function setPose(pose) {

        state.pose =
            pose;


        $$(".pose-btn")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.pose ===
                    pose
                );

            });


        if (pose === "front") {

            avatar.style.transform =
                `
            rotateY(
                ${state.rotation}deg
            )
            scale(
                ${state.scale}
            )
            `;

        }


        if (pose === "side") {

            avatar.style.transform =
                `
            rotateY(65deg)
            scale(
                ${state.scale}
            )
            `;

        }


        if (pose === "walk") {

            avatar.style.transform =
                `
            rotateY(
                ${state.rotation}deg
            )
            rotateZ(-2deg)
            scale(
                ${state.scale}
            )
            `;

        }


        updatePreviewStatus();

    }


    /* Pose buttons */

    $$(".pose-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    setPose(
                        button.dataset.pose
                    );

                }
            );

        });


    /* =========================================================
       ROTATION
    ========================================================= */

    function rotateAvatar(amount) {

        state.rotation +=
            amount;


        avatar.style.transform =
            `
        rotateY(
            ${state.rotation}deg
        )
        scale(
            ${state.scale}
        )
        `;

    }


    $("#rotateLeft")
        .addEventListener(
            "click",
            () => {

                rotateAvatar(-20);

            }
        );


    $("#rotateRight")
        .addEventListener(
            "click",
            () => {

                rotateAvatar(20);

            }
        );


    /* =========================================================
       ZOOM
    ========================================================= */

    function zoomAvatar(amount) {

        state.scale =
            Math.max(
                .75,
                Math.min(
                    1.25,
                    state.scale + amount
                )
            );


        avatar.style.transform =
            `
        rotateY(
            ${state.rotation}deg
        )
        scale(
            ${state.scale}
        )
        `;

    }


    $("#zoomIn")
        .addEventListener(
            "click",
            () => {

                zoomAvatar(.08);

            }
        );


    $("#zoomOut")
        .addEventListener(
            "click",
            () => {

                zoomAvatar(-.08);

            }
        );


    /* =========================================================
       RESET
    ========================================================= */

    $("#resetView")
        .addEventListener(
            "click",
            () => {

                state.rotation = 0;

                state.scale = 1;

                setPose("front");

                showToast(
                    "Preview reset"
                );

            }
        );


    /* =========================================================
       RECOMMENDATIONS
    ========================================================= */
    /* =========================================================
       APPLY COMPLETE ASTRA OUTFIT TO 3D AVATAR
    ========================================================= */

    function applyAstraOutfit(productIds) {

        state.selectedProducts = [...productIds];

        productIds.forEach(id => {

            const product = products.find(
                item => item.id === id
            );

            if (
                product &&
                window.applyAstraProduct
            ) {
                window.applyAstraProduct(product);
            }

        });

        updatePreview();

        renderProducts();

        showToast(
            "Astra outfit applied to your avatar ✦"
        );
    }

    function renderRecommendations() {

        const recommendationIds = [
            "SX001",
            "SX003",
            "SX005"
        ];


        const container =
            $("#recommendationProducts");


        container.innerHTML =
            recommendationIds
                .map(id =>
                    products.find(
                        product =>
                            product.id === id
                    )
                )
                .filter(Boolean)
                .map(product => {

                    return `

                    <button
                        class="reco-card"
                        data-reco-id="${product.id}"
                    >

                        <div
                            class="reco-visual"
                            style="
                                --reco-color:
                                ${product.colorCode};
                            "
                        ></div>

                        <span>
                            ${product.name}
                        </span>

                    </button>

                `;

                })
                .join("");


        $$(".reco-card")
            .forEach(card => {

                card.addEventListener(
                    "click",
                    () => {

                        const product =
                            products.find(
                                item =>
                                    item.id ===
                                    card.dataset.recoId
                            );


                        if (product) {

                            applyAstraOutfit([
                                "SX001",
                                "SX003",
                                "SX005"
                            ]);

                        }

                    }
                );

            });

    }


    $("#refreshRecommendation")
        .addEventListener(
            "click",
            () => {

                const texts = [

                    "A monochrome base with relaxed proportions keeps the look clean and modern.",

                    "Try one structured layer over a simple base for an easy elevated outfit.",

                    "Keep the palette neutral and let one statement piece carry the look."

                ];


                const text =
                    $("#recommendationText");


                const current =
                    text.textContent.trim();


                const available =
                    texts.filter(
                        item =>
                            item !== current
                    );


                text.textContent =
                    available[
                    Math.floor(
                        Math.random() *
                        available.length
                    )
                    ];


                showToast(
                    "Recommendation refreshed"
                );

            }
        );


    /* =========================================================
       PRODUCT MODAL
    ========================================================= */

    let activeProduct = null;


    function openProductModal(product) {

        activeProduct =
            product;


        $("#modalCategory")
            .textContent =
            product.type;


        $("#modalTitle")
            .textContent =
            product.name;


        $("#modalPrice")
            .textContent =
            formatPrice(
                product.price
            );


        $("#modalDescription")
            .textContent =
            product.description;


        $("#modalColor")
            .textContent =
            `Color: ${product.color}`;


        $("#modalFit")
            .textContent =
            `Fit: ${product.fit}`;


        $("#modalVisual")
            .style
            .setProperty(
                "--product-color",
                product.colorCode
            );


        $("#productModal")
            .classList
            .add("open");

    }


    function closeProductModal() {

        $("#productModal")
            .classList
            .remove("open");

    }


    $("#modalClose")
        .addEventListener(
            "click",
            closeProductModal
        );


    $("#productModal")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("#productModal")
                ) {

                    closeProductModal();

                }

            }
        );


    /* Add product */

    $("#modalAdd")
        .addEventListener(
            "click",
            () => {

                if (!activeProduct) {
                    return;
                }


                if (
                    !state.selectedProducts
                        .includes(
                            activeProduct.id
                        )
                ) {

                    state.selectedProducts
                        .push(
                            activeProduct.id
                        );

                }


                updatePreview();

                renderProducts();

                closeProductModal();

                showToast(
                    `${activeProduct.name} added to outfit`
                );

            }
        );


    /* Try on */

    $("#modalTryOn")
        .addEventListener(
            "click",
            () => {

                if (!activeProduct) {
                    return;
                }


                if (
                    !state.selectedProducts
                        .includes(
                            activeProduct.id
                        )
                ) {

                    state.selectedProducts
                        .push(
                            activeProduct.id
                        );

                }


                if (window.applyAstraProduct) {
                    window.applyAstraProduct(activeProduct);
                }

                updatePreview();

                renderProducts();

                closeProductModal();

                showToast(
                    `${activeProduct.name} is now on your avatar`
                );

            }
        );


    /* =========================================================
       CHAT
    ========================================================= */

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            text;


        return div.innerHTML;

    }


    function addChatMessage(
        message,
        type
    ) {

        if (type === "user") {

            chatMessages.insertAdjacentHTML(
                "beforeend",
                `
                <div class="chat-message user-message">

                    <div>
                        <p>
                            ${escapeHTML(message)}
                        </p>
                    </div>

                </div>
            `
            );

        } else {

            chatMessages.insertAdjacentHTML(
                "beforeend",
                `
                <div class="chat-message ai-message">

                    <div class="chat-avatar">
                        ✦
                    </div>

                    <div>
                        <p>
                            ${escapeHTML(message)}
                        </p>
                    </div>

                </div>
            `
            );

        }


        chatMessages.scrollTop =
            chatMessages.scrollHeight;

    }


    function getAIResponse(message) {

        const text =
            message.toLowerCase();


        if (
            text.includes("college")
        ) {

            return "For college, try the Oversized Black Tee with Relaxed Blue Jeans and Studio White Sneakers. Comfortable and easy to style.";

        }


        if (
            text.includes("casual")
        ) {

            return "For a casual look, I'd suggest the Oversized Black Tee, Relaxed Blue Jeans and Studio White Sneakers.";

        }


        if (
            text.includes("party")
        ) {

            return "For a party, try the Cloud White Shirt with Stone Straight Trousers and the Silver Chain.";

        }


        if (
            text.includes("street")
        ) {

            return "For streetwear, try the Oversized Black Tee with the Midnight Overshirt and white sneakers.";

        }


        return "Tell me the occasion — college, casual, party or streetwear — and I'll suggest a StrideX look.";

    }


    function sendMessage() {

        const input =
            $("#chatInput");


        const message =
            input.value.trim();


        if (!message) {
            return;
        }


        addChatMessage(
            message,
            "user"
        );


        input.value = "";


        setTimeout(
            () => {

                addChatMessage(
                    getAIResponse(
                        message
                    ),
                    "ai"
                );

            },
            400
        );

    }


    $("#sendChat")
        .addEventListener(
            "click",
            sendMessage
        );


    $("#chatInput")
        .addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    sendMessage();

                }

            }
        );


    /* Quick prompts */

    $$(".quick-prompts button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    $("#chatInput")
                        .value =
                        button.dataset.prompt;


                    sendMessage();

                }
            );

        });


    /* =========================================================
       BUILD OUTFIT
    ========================================================= */

    $("#buildOutfitBtn")
        .addEventListener(
            "click",
            () => {

                $("#outfitModal")
                    .classList
                    .add("open");

            }
        );


    $("#outfitClose")
        .addEventListener(
            "click",
            () => {

                $("#outfitModal")
                    .classList
                    .remove("open");

            }
        );


    $("#outfitModal")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    $("#outfitModal")
                ) {

                    $("#outfitModal")
                        .classList
                        .remove("open");

                }

            }
        );


    /* Outfit style */

    $$(".outfit-choice")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.style =
                        button.dataset.style;


                    $$(".outfit-choice")
                        .forEach(item => {

                            item.classList.toggle(
                                "active",
                                item === button
                            );

                        });

                }
            );

        });


    /* Generate */

    $("#generateOutfit")
        .addEventListener(
            "click",
            () => {

                const outfits = {

                    casual: [
                        "SX001",
                        "SX003",
                        "SX005"
                    ],

                    street: [
                        "SX001",
                        "SX006",
                        "SX005"
                    ],

                    smart: [
                        "SX002",
                        "SX004",
                        "SX005"
                    ]

                };


                state.selectedProducts =
                    [
                        ...outfits[
                        state.style
                        ]
                    ];

                applyAstraOutfit(
                    state.selectedProducts
                );

                $("#outfitModal")
                    .classList
                    .remove("open");


                showToast(
                    "Astra created your outfit ✦"
                );

            }
        );


    /* =========================================================
       KEYBOARD
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                (event.ctrlKey ||
                    event.metaKey) &&
                event.key.toLowerCase() ===
                "k"
            ) {

                event.preventDefault();

                searchInput.focus();

            }


            if (
                event.key ===
                "Escape"
            ) {

                closeProductModal();

                $("#outfitModal")
                    .classList
                    .remove("open");

            }

        }
    );


    /* =========================================================
       INITIALIZATION
    ========================================================= */

    renderProducts();

    renderRecommendations();

    updatePreview();

    selectAvatar("01");


});