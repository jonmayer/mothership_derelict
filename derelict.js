import * as THREE from "https://cdn.skypack.dev/three@0.133.1/build/three.module";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/controls/OrbitControls";

import { EffectComposer} from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/EffectComposer";
import { CopyShader } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/shaders/CopyShader";
import { RenderPass } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/ShaderPass";
import { DigitalGlitch } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/shaders/DigitalGlitch";
import { GlitchPass } from "https://cdn.skypack.dev/three@0.133.1/examples/jsm/postprocessing/GlitchPass";
// why doesn't this work? import { GlitchPass } from "./GlitchPass.js";
import makeShip from "./ship.js";
let scene, camera, renderer, composer, raycaster, root;
let blocks = [];
let controls;
let ship;
const pointer = new THREE.Vector2();
let INTERSECTED;
let info = false;
let info_text = [];
let info_pos = 0;
let color_destroyed = 0x991111;
let line_material;


init();
animate();


function makeTile(mod) {
  let canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  let context = canvas.getContext('2d');
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, 1024, 1024);

  // context.font = "30px Arial";
  context.font = "30px VT323";
  context.fillStyle = '#000000';
  function MakeText(text, x1, y1, x2, y2) {
    let g1 = context.measureText(text);
    let actualHeight = g1.actualBoundingBoxAscent + g1.actualBoundingBoxDescent;
    context.setTransform((x2-x1) / g1.width, 0, 0, (y2-y1)/actualHeight, x1, y2);
    context.fillText(text, 0, 0);
  }

  MakeText(mod.type, 12, 12, 1012, 600);
  MakeText(mod.flavor, 12, 624, 1012, 1012);

  var texture = new THREE.Texture(canvas); // now make texture
  texture.minFilter = THREE.LinearFilter;     // eliminate console message
  texture.repeat.set(1,1);
  texture.needsUpdate = true;         

  var geo = new THREE.PlaneGeometry(1, 1);
  var material = new THREE.MeshBasicMaterial( 
        { side:THREE.DoubleSide, map:texture, transparent:false, opacity:1.0 } );
  var mesh = new THREE.Mesh(geo, material);
  mesh.part_index = mod.index;
  return mesh;
}

function animateText() {
  if (info && info_text.length > 0) {
    let html = "";
    for (let i = 0; i < info_pos; i++) {
      if (info_text[i] === "\n") {
        html += "<br/>";
      } else {
        html += info_text[i];
      }
    }
    if (info_pos < info_text.length - 1) {
      html += "&#x2589;<br/>";
      info_pos += 0.5;
    } else {
      info_text = "";  // stop redrawing
    }
    info.innerHTML = html;
  }
}

function init() {
  ship = makeShip(window.location.search);
  info = document.getElementById("info");
  info_text = ship.InfoText().join("   \n");
  info_pos = 0;
  let bottom = document.getElementById("bottom");
  bottom.innerHTML = "<p>\n" +
    "<a>[ BOARD ]</a> " +
    "<a>[ SCAN ]</a> " + 
    "<a href=\"?" + ship.rand().toString(16) + "\">[ NOPE ]</a>\n" +
    "</p>\n";

  scene = new THREE.Scene();
  // const axesHelper = new THREE.AxesHelper( 2 );
  // scene.add( axesHelper );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.up.set(0, 0, 1);
  camera.position.set( 0, 6, 2.5 );
  camera.lookAt(new THREE.Vector3(0,0,0));

  renderer = new THREE.WebGLRenderer();

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  document.addEventListener( 'mousemove', onPointerMove );
  window.addEventListener( 'resize', onWindowResize );
  document.addEventListener( 'mouseup', onClick );

  controls = new OrbitControls( camera, renderer.domElement );
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
  controls.minDistance = 1.0;
  controls.maxDistance = 20.0;
  controls.enablePan = true;
  controls.minPolarAngle = 0;
  controls.maxPolarAngle = Math.PI * 0.45;
  controls.update();

  root = new THREE.Object3D({ name: "root"});

  const geometry = new THREE.BoxGeometry();
  var edges = new THREE.EdgesGeometry( geometry ); // or WireframeGeometry( geometry )
  var lines = new THREE.LineBasicMaterial( { color: 0x00DD00, linewidth: 9 } );
  var cube = new THREE.LineSegments( edges, lines);

  // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var material = new THREE.MeshLambertMaterial( { color: 0x005f00 } );
  var opaquecube = new THREE.Mesh( geometry.clone(), material.clone() );

  line_material = new THREE.LineBasicMaterial({ color: 0xffff33 });


  let offx = Math.floor(ship.max.x / 2);
  let offy = Math.floor(ship.max.y / 2);
  for (let i = 0; i < ship.parts.length; i++) {
    // hide with opaque cube until revealed
    var ocube = opaquecube.clone();
    ocube.material = opaquecube.material.clone();
    // var ocube = makeTile(ship.parts[i]);
    ocube.name = "ocube" + i;
    ocube.part_index = i;
    ocube.position.x = 1.17 * (ship.parts[i].x - offx);
    ocube.position.y = 1.17 * (ship.parts[i].y - offy);
    ocube.scale.z = 0.7 * 1.02;
    ocube.scale.x = 1.02;
    ocube.scale.y = 1.02;
    if (ship.parts[i].type === "") {
      console.log(i, ship.parts[i].type);
      ocube.material.color.setHex(color_destroyed);
    }
    root.add(ocube);
    blocks.push(ocube);
  }

  scene.add(root);

  const light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( -2, 2, 5 ).normalize();
  scene.add( light );

  // post processing
  // from: https://r105.threejsfundamentals.org/threejs/lessons/threejs-post-processing.html
  composer = new EffectComposer( renderer );
  const renderPass = new RenderPass( scene, camera );
  composer.addPass( renderPass );

  const glitchPass = new GlitchPass();
  composer.addPass( glitchPass );

  // Ref: https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
  raycaster = new THREE.Raycaster();

}

function animate() {
  requestAnimationFrame( animate );

  animateText();
  controls.update();
  raycaster.setFromCamera( pointer, camera );
  const intersects = raycaster.intersectObjects( blocks, false )

  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) {
        // INTERSECTED.material.emissive = 0x000000;
        // INTERSECTED.material.color = 0x005f00;
        INTERSECTED.material.color.setHex(0x005f00);
    if (ship.parts[INTERSECTED.part_index].type === "") {
      INTERSECTED.material.color.setHex(color_destroyed);
    }
        if (INTERSECTED.material.emissive) INTERSECTED.material.emissive.setHex(0x000000);
      }

      INTERSECTED = intersects[ 0 ].object;
      // INTERSECTED.currentHex = INTERSECTED.material.emissive;
      // INTERSECTED.material.emissive = 0xFF0000;
      INTERSECTED.material.color.setHex(0x999999);
      if (INTERSECTED.material.emissive) INTERSECTED.material.emissive.setHex(0xFF9900);
    }
  } else {
    if ( INTERSECTED ) {
      // INTERSECTED.material.emissive = 0x000000;
      INTERSECTED.material.color.setHex(0x005f00);
      if (ship.parts[INTERSECTED.part_index].type === "") {
        INTERSECTED.material.color.setHex(color_destroyed);
      }
      if (INTERSECTED.material.emissive) INTERSECTED.material.emissive.setHex(0x000000);
    }

    INTERSECTED = null;
  }

  // root.rotation.z += 0.001;
  // cube.rotation.y += 0.01;
  // cube.rotation.x += 0.01;
  // renderer.render( scene, camera );

  composer.render();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onPointerMove( event ) {
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onClick( event ) {
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  console.log("click",pointer);
  raycaster.setFromCamera( pointer, camera );
  const intersects = raycaster.intersectObjects( blocks, false )
  if ( intersects.length > 0 ) {
    let obj = intersects[ 0 ].object;
    if (obj.identified) return;

    var tile = makeTile(ship.parts[obj.part_index]);
    tile.position.x = obj.position.x * 1.0;
    tile.position.y = obj.position.y * 1.0;
    tile.position.z = obj.position.z + 0.5;
    tile.part_index = obj.part_index;
    tile.name = "i_" + obj.name;
    root.add(tile);

    var points = [];
    points.push(tile.position);
    points.push(obj.position);
    console.log(points);
    var line_geometry = new THREE.BufferGeometry().setFromPoints( points );
    var line = new THREE.Line( line_geometry, line_material );
    scene.add( line );
  }
}
