window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-3d');
  if (!canvas) return;

  // 1. Сцена и камера
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 500;

  // 2. Рендерер с черным фоном
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: false, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  // 3. Создаем 1500 красных светящихся 3D-частиц
  const particleCount = 1500;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    // Разбрасываем частицы в пространстве
    positions[i] = (Math.random() - 0.5) * 1200;     // X
    positions[i + 1] = (Math.random() - 0.5) * 1200; // Y
    positions[i + 2] = (Math.random() - 0.5) * 1200; // Z
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Фирменный красный цвет VEKX (#ff0000)
  const material = new THREE.PointsMaterial({
    color: 0xff0000,
    size: 3,
    transparent: true,
    opacity: 0.8
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // 4. Интерактив: реакция на мышь
  let mouseX = 0;
  let mouseY = 0;

  window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.05;
    mouseY = (event.clientY - window.innerHeight / 2) * 0.05;
  });

  // Автоматический ресайз при изменении размера окна
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 5. Анимация полета
  function animate() {
    requestAnimationFrame(animate);

    // Медленное вращение всего пространства частиц
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;

    // Плавное следование за курсором мыши
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();
});