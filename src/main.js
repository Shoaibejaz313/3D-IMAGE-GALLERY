import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Reflector } from "three/examples/jsm/Addons.js"
import { Easing, Tween, update } from "tween"





const images = [
  "pin.jpg",
  "pin3.jpg",
  "pin4.jpg",
  "pin6.jpg",
  "pin7.jpg"
]


const titles = [
  "Coding Ninjas",
  "Future Makers",
  "Landing Lands",
  "Los Angles",
  "Shaoib Rahi",
  "Iron Man"
]


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// camera.position.z = 5;
scene.add(camera);



const textureLoader = new THREE.TextureLoader();


const rootNode = new THREE.Object3D();
rootNode.castShadow = true;
rootNode.frustumCulled = false
scene.add(rootNode);

const left_btn = textureLoader.load("left.png");
const right_btn = textureLoader.load("right.png");

let count = 5;

for (let i = 0; i < count; i++) {
  const baseNode = new THREE.Object3D();
  let texture = textureLoader.load(images[i]);
  texture.outputColorSpace = THREE.SRGBColorSpace;
  const borderGeo = new THREE.BoxGeometry(3.2, 2.2, .09);
  const borderMat = new THREE.MeshStandardMaterial({ color: 0X202020 });
  const border = new THREE.Mesh(borderGeo, borderMat);
  border.position.z = -3.5
  border.name = `Border_${i}`
  baseNode.add(border)
  baseNode.rotation.y = i * (2 * Math.PI / count);
  rootNode.add(baseNode)
  const geometry = new THREE.BoxGeometry(3, 2, .1);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -3.5;
  mesh.name = `Art${i}`
  baseNode.add(mesh);

  const left = new THREE.Mesh(new THREE.BoxGeometry(.6, .6, .01), new THREE.MeshStandardMaterial({ map:left_btn,transparent:true }));
  const right = new THREE.Mesh(new THREE.BoxGeometry(.6, .6, .01), new THREE.MeshStandardMaterial({ map:right_btn,transparent:true }));
  left.position.set(2.8,0,-3);
  baseNode.add(left);
  right.position.set(-2.8,0,-3);
  baseNode.add(right)
  left.name = `leftArrow`;
  right.name = `rightArrow`
}





const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("canvas") });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.xr.enabled = true;




const mirror = new Reflector(
  new THREE.CircleGeometry(10),
  {
    color: 0x303030,
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight
  }
)

mirror.position.y = -1.1
mirror.rotateX(-Math.PI / 2)
scene.add(mirror)


function resizeCanvas() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  mirror.getRenderTarget().setSize(window.innerHeight, window.innerHeight, .5)
}


window.addEventListener("resize", resizeCanvas);


function rotateGallery(x){
  const deltY = x*(2* Math.PI/count);
  new Tween(rootNode.rotation)
  .to({y:rootNode.rotation.y + deltY})
  .easing(Easing.Quadratic.InOut)
  .start()
}

window.addEventListener("click",(e) => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  mouse.x = (e.clientX/window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY/window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse,camera);
  let intersections = raycaster.intersectObject(rootNode,true);
  if(intersections.length > 0){
    // console.log(intersections[0])
    if(intersections[0].object.name === "leftArrow"){
      rotateGallery(-1)
    }
    if(intersections[0].object.name === "rightArrow"){
      rotateGallery(1);
    }
  }


})

// Lights
// const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
// scene.add(ambientLight);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
// directionalLight.position.set(3, 5, 2);
// scene.add(directionalLight);


const spotLight = new THREE.SpotLight(0Xffffff, 100.0, 10.0, .65, .5);
spotLight.position.set(0, 5, 0);
spotLight.target.position.set(0, .5, -5)
spotLight.castShadow = true;
scene.add(spotLight.target)
scene.add(spotLight)

const controls = new OrbitControls(camera, renderer.domElement);


function animate(time) {
  update()
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}



animate();

