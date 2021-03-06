// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');

const settings = {
  dimensions: [512, 512],
  fps: 24, // frames per second. enough for a good quality, 30 for better quality
  duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor("hsl(0, 0%, 95%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  const palette = random.pick(palettes);

  const box = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 40; i++) {
    const mesh = new THREE.Mesh(
        box,
        new THREE.MeshStandardMaterial({
          color: random.pick(palette),
        })
    );
    mesh.position.set(random.range(-1, 1), random.range(-1, 1), random.range(-1, 1));
    mesh.scale.set(random.range(-1, 1), random.range(-1, 1), random.range(-1, 1));
    mesh.scale.multiplyScalar(0.25);
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight('blue'));

  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(2,4,0);
  scene.add(light);

  const easeFn = BezierEasing(.58,.04,.43,.96);

  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight);

      const aspect = viewportWidth / viewportHeight;

      const zoom = 2.0;

      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      camera.near = 100;
      camera.far = -100;

      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      const t = Math.sin(playhead * Math.PI);
      scene.rotation.z = easeFn(t);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
