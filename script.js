import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AnimationMixer } from 'three';

var model, mixer, clock, skybox;

//Create the scene
const scene = new THREE.Scene();

clock = new THREE.Clock();

//Create the camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 1000 );

//Add ambient light
const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

// Add directional light
const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
directionalLight.position.x = 0;
directionalLight.position.y = 1;
directionalLight.position.z = 50;
scene.add( directionalLight );

//Construct the renderer
const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//Add camera controls for the mouse
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;

/*
//Restrict the camera to certain angles if you don't want the artifacts of background to be seen
controls.minPolarAngle = Math.PI * 0.5;
controls.maxPolarAngle = Math.PI * 0.5;
controls.minAzimuthAngle = Math.PI;
controls.maxAzimuthAngle = Math.PI * 0.003;
*/

//Enable auto rotation of the model and disable zoom and pan
controls.autoRotate = true;
controls.enableZoom = false;
controls.enablePan = false;

controls.autoRotateSpeed = 1;

//Load the 3D fish model and enable animation
const Loader = new GLTFLoader();
Loader.load('./guppie_animated/scene.gltf', (gltf) => {    
    
    model = gltf.scene;
    scene.add( model );

    mixer = new THREE.AnimationMixer( gltf.scene );
        
    gltf.animations.forEach( ( clip ) => {
      
        mixer.clipAction( clip ).play();

    });
      
});


camera.position.z = 150;

//Load a video as background
const video = document.getElementById("video");
const bgTexture = new THREE.VideoTexture( video );
bgTexture.colorSpace = THREE.SRGBColorSpace;

//Create a sphere and map the video as a background
const geometry = new THREE.SphereGeometry( 300 );
const material = new THREE.MeshBasicMaterial({ map: bgTexture });
material.side = THREE.BackSide;
const bgSphere = new THREE.Mesh( geometry, material );
scene.add( bgSphere );

function animate() {

    var delta = clock.getDelta();
  
    if ( mixer ) mixer.update( delta );

    renderer.render( scene, camera );
    controls.update();

}

renderer.setAnimationLoop( animate );