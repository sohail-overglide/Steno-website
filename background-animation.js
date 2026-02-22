// Three.js Background Particle Animation
document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }

    const container = document.createElement('div');
    container.id = 'canvas-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-1'; // Behind card content, on top of hero bg (if needed)
    container.style.pointerEvents = 'none';
    document.body.prepend(container);

    const scene = new THREE.Scene();

    // Orthographic camera for better control over 2D-like positioning if needed, 
    // but Perspective is usually better for depth/parallax.
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 75; // Moved camera further back

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- Particles ---
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 800; // Adjust for density

    const posArray = new Float32Array(particleCount * 3);
    const sizeArray = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Spread particles across a wide area
        posArray[i] = (Math.random() - 0.5) * 400;     // x - wider spread
        posArray[i + 1] = (Math.random() - 0.5) * 400; // y - wider spread
        posArray[i + 2] = (Math.random() - 0.5) * 60;  // z - flatter depth, kept centered
    }

    // Random sizes between 1px and 2px (mapped in shader/material size)
    // We'll roughly simulate this with the material size and random scaling if needed,
    // or just use a base size.
    for (let i = 0; i < particleCount; i++) {
        sizeArray[i] = Math.random(); // 0.0 to 1.0
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(sizeArray, 1));

    // Create a circular texture for particles
    const sprite = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/disc.png');

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.4, // Doubled particle size (was 0.2)
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        map: sprite,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // --- Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    function animate() {
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.0005;
        targetY = mouseY * 0.0005;

        // Smooth rotation/parallax
        particlesMesh.rotation.y += 0.03 * (targetX - particlesMesh.rotation.y);
        particlesMesh.rotation.x += 0.03 * (targetY - particlesMesh.rotation.x);

        // Gentle floating
        particlesMesh.position.y = Math.sin(elapsedTime * 0.2) * 5;
        particlesMesh.position.x = Math.cos(elapsedTime * 0.15) * 5;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
});
