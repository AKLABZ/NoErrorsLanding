let scene, camera, renderer, model, directionalLight;
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;
let rotateSpeed = 0.001;
let dampingFactor = .9999;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe6e6fa);
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1200);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("3d-viewer").appendChild(renderer.domElement);

    const loader = new THREE.GLTFLoader();
    loader.load('./Wallet_2.glb', function (gltf) {
        model = gltf.scene;
        scene.add(model);

        const boundingBox = new THREE.Box3().setFromObject(model);
        const center = boundingBox.getCenter(new THREE.Vector3());
        model.position.sub(center);

        model.rotation.set(Math.PI / 1, Math.PI / 1, Math.PI / 1);
        model.rotation.z += Math.PI / 1;

        model.scale.set(50.1, 50.1, 50.1);
    });

    camera.position.z = 0.5;
    camera.position.y = 5;
    camera.position.x = -.3;
    camera.rotation.x = 17;

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5.0);
    scene.add(directionalLight2);

    const ambientLight = new THREE.AmbientLight(0xe0e1dd, 2.0, 10);
    ambientLight.position.set(-5, 7, 1);
    scene.add(ambientLight);

    document.addEventListener("mousedown", onDocumentMouseDown, false);
    document.addEventListener("mouseup", onDocumentMouseUp, false);
    document.addEventListener("mousemove", updateLightPosition, false);
}

function updateLightPosition(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (directionalLight && camera) {
        const distance = 5;
        const mouseWorldPosition = new THREE.Vector3(mouse.x, mouse.y, distance).unproject(camera);
        const direction = mouseWorldPosition.sub(camera.position).normalize();
        directionalLight.position.copy(direction);
    }
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    isDragging = true;
    previousMouseX = event.clientX;
    previousMouseY = event.clientY;
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    document.addEventListener("mouseup", onDocumentMouseUp, false);
}

function onDocumentMouseMove(event) {
    if (isDragging && model) {
        let deltaX = event.clientX - previousMouseX;
        let deltaY = event.clientY - previousMouseY;

        model.rotation.y += deltaX * rotateSpeed * 2;
        model.rotation.x += deltaY * rotateSpeed * 2;

        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
}

function onDocumentMouseUp(event) {
    isDragging = false;
    document.removeEventListener("mousemove", onDocumentMouseMove);
    document.removeEventListener("mouseup", onDocumentMouseUp);
}

function animate() {
    requestAnimationFrame(animate);

    if (!isDragging && model) {
        model.rotation.y *= dampingFactor;
        model.rotation.x *= dampingFactor;
    }

    renderer.render(scene, camera);
}

init();
animate();
