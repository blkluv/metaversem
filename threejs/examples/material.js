/*
 * :file description:
 * :name: /threejs/src/index.js
 * :author: 张德志
 * :copyright: (c) 2023, Tungee
 * :date created: 2022-07-12 07:44:44
 * :last editor: 张德志
 * :date last edited: 2023-01-02 23:01:19
 */
import * as THREE from 'three';
import Stats from 'stats.js';


let stats;

let camera, scene, renderer;
let pointLight;

const objects = [],
  materials = [];

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,2000);
  camera.position.set(0,200,800);

  scene = new THREE.Scene();
  
  const helper = new THREE.GridHelper(1000,40,0x303030,0x303030);
  helper.position.y = -75;
  scene.add(helper);

  const texture = new THREE.Texture(generateTexture());
  texture.needsUpdate = true;

  materials.push(
    new THREE.MeshLambertMaterial({ map: texture, transparent: true })
  );

  materials.push(new THREE.MeshLambertMaterial({color:0xdddddd}));
  
  materials.push(
    new THREE.MeshPhongMaterial({
      color:0xdddddd,
      specular: 0x009900,
      shininess: 30,
      flatShading: true,
    })
  )

  materials.push(new THREE.MeshNormalMaterial())
  materials.push(
    new THREE.MeshMatcapMaterial({
      color: 0xffaa00,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })
  )
  materials.push(new THREE.MeshLambertMaterial({ color: 0xdddddd }));
  materials.push(
    new THREE.MeshPhongMaterial({
      color: 0xdddddd,
      specular: 0x009900,
      shininess: 30,
      map: texture,
      transparent: true,
    }),
  );
  
  materials.push(new THREE.MeshNormalMaterial({ flatShading: true }));
  materials.push(
    new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true }),
  );
  materials.push(new THREE.MeshDepthMaterial());
  materials.push(
    new THREE.MeshLambertMaterial({ color: 0x666666, emissive: 0xff0000 }),
  );
  materials.push(
    new THREE.MeshPhongMaterial({
      color: 0x000000,
      specular: 0x666666,
      emissive: 0xff0000,
      shininess: 10,
      opacity: 0.9,
      transparent: true,
    }),
  );
  materials.push(
    new THREE.MeshBasicMaterial({ map: texture, transparent: true }),
  );

  const geometry = new THREE.SphereGeometry(70,32,16);
  for(let i =0;i < materials.length;i++) {
    addMesh(geometry,materials[i]);
  }

  scene.add(new THREE.AmbientLight(0x111111));

  const directionalLight = new THREE.DirectionalLight(0xffffff,0.125);
  directionalLight.position.x = Math.random() - 0.5;
  directionalLight.position.y = Math.random() - 0.5;
  directionalLight.position.z = Math.random() - 0.5;
  directionalLight.position.normalize();
  
  scene.add(directionalLight);

  pointLight = new THREE.PointLight(0xffffff,1);
  scene.add(pointLight);

  pointLight.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(4,8,8),
      new THREE.MeshBasicMaterial({color:0xffffff})
    )
  )


  renderer =  new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth,window.innerHeight);
  document.body.appendChild(renderer.domElement);

  stats = new Stats();
  document.body.appendChild(stats.dom);

  window.addEventListener('resize',onWindowResize);
}

// function init() {



function addMesh(geometry, material) {
  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.x = (objects.length % 4) * 200 - 400;
  mesh.position.z = Math.floor(objects.length / 4) * 200 - 200;

  mesh.rotation.x = Math.random() * 200 - 100;
  mesh.rotation.y = Math.random() * 200 - 100;
  mesh.rotation.z = Math.random() * 200 - 100;

  objects.push(mesh);

  scene.add(mesh);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function generateTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext('2d');
  const image = context.getImageData(0, 0, 256, 256);

  let x = 0,
    y = 0;

  for (let i = 0, j = 0, l = image.data.length; i < l; i += 4, j++) {
    x = j % 256;
    y = x === 0 ? y + 1 : y;

    image.data[i] = 255;
    image.data[i + 1] = 255;
    image.data[i + 2] = 255;
    image.data[i + 3] = Math.floor(x ^ y);
  }

  context.putImageData(image, 0, 0);

  return canvas;
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
  stats.update();
}

function render() {
  const timer = 0.0001 * Date.now();

  camera.position.x = Math.cos(timer) * 1000;
  camera.position.z = Math.sin(timer) * 1000;

  camera.lookAt(scene.position);

  for (let i = 0, l = objects.length; i < l; i++) {
    const object = objects[i];

    object.rotation.x += 0.01;
    object.rotation.y += 0.005;
  }

  materials[materials.length - 2].emissive.setHSL(
    0.54,
    1,
    0.35 * (0.5 + 0.5 * Math.sin(35 * timer)),
  );
  materials[materials.length - 3].emissive.setHSL(
    0.04,
    1,
    0.35 * (0.5 + 0.5 * Math.cos(35 * timer)),
  );

  pointLight.position.x = Math.sin(timer * 7) * 300;
  pointLight.position.y = Math.cos(timer * 5) * 400;
  pointLight.position.z = Math.cos(timer * 3) * 300;

  renderer.render(scene, camera);
}
