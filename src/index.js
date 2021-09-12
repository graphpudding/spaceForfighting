import './styles/index.scss';
import './assets/fonts/Roboto-Regular.ttf';
import './component.js';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

var canvas = document.getElementById("babylon");
var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function() {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false
  });
};
function $_GET(key) {
    var p = window.location.search;
    p = p.match(new RegExp(key + '=([^&=]+)'));
    return p ? p[1] : false;
}
var createScene = async function() {
//load all SCENE!
const scene = await BABYLON.SceneLoader.LoadAsync(
    "scene/",
    "scene.glb",
    engine
);
//import meshes to loaded scene
let num = 0;
let meshes = ["boots.glb",]

function asyncLoadMeshes(){
  BABYLON.SceneLoader.ImportMeshAsync("", "scene/",meshes[num], scene, function(newMeshes, particleSystems, skeletons, animationGroups) {}).then(()=>{
    if(num < meshes.length-1){
      num++;
      asyncLoadMeshes();
    }else{
      afterLoad()
    }
  })
}
function afterLoad(){
  let planet  = scene.getMeshByName("Sphere001");
  planet.material.emissiveColor.set(0,0,0);
  planet.material.indexOfRefraction=1;

  //postProcess
  let postProcess = new BABYLON.ImageProcessingPostProcess("processing", 1.0, scene.cameras[0]);
  scene.imageProcessingConfiguration.exposure=.9;
  scene.imageProcessingConfiguration.contrast=1.9;
}

let camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3( 0.32161276833553787, -0.16917787249847976, -1.9667089450908692), scene);
camera.angularSensibilityY = 3000;
camera.angularSensibilityX = 3000;
camera.lowerRadiusLimit = .1;
camera.wheelPrecision = 30;
camera.setTarget(BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);

//let lighting = BABYLON.CubeTexture.CreateFromPrefilteredData("https://assets.babylonjs.com/environments/studio.env", scene);
let lighting = new BABYLON.HDRCubeTexture("scene/textures/rsH10x.hdr", scene, 128, false, true, false, true);
lighting.name = "runyonCanyon";
//lighting.level = 15;
lighting.gammaSpace = false;
scene.environmentTexture = lighting;
scene.createDefaultSkybox(scene.environmentTexture, true, 1000);
scene.getMeshByName("hdrSkyBox").visibility=0;
let sphere  = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: .25, segments: 32}, scene);
sphere.position.set(-100, 0, 0);


window.lensFlareSystem = new BABYLON.LensFlareSystem('lensFlareSystem', sphere, scene);
var flare00 = new BABYLON.LensFlare(0.2, .1, new BABYLON.Color3(1,1,1), 'scene/textures/flar/OpticalFlare11.png', window.lensFlareSystem);
flare00.alphaMode = 1;

//var flare02 = new BABYLON.LensFlare(0.22, 1, new BABYLON.Color3(0,0,1), 'lens5.png', lensFlareSystem);
//var flare03 = new BABYLON.LensFlare(0.12, 0.8, new BABYLON.Color3(.5,.7,1), 'lens1.png', lensFlareSystem);
//var flare04 = new BABYLON.LensFlare(0.1, 0.6, new BABYLON.Color3(.5,.5,1), 'lens3.png', lensFlareSystem);
//var flare05 = new BABYLON.LensFlare(0.2, 0.5, new BABYLON.Color3(.4,.6,.9), 'lens4.png', lensFlareSystem);
//var flare06 = new BABYLON.LensFlare(0.1, 0.35, new BABYLON.Color3(.5,.5,.9), 'lens6.png', lensFlareSystem);
//var flare07 = new BABYLON.LensFlare(0.12, -0.5, new BABYLON.Color3(.9,.75,.5), 'lens4.png', lensFlareSystem);
//var flare08 = new BABYLON.LensFlare(0.05, -0.25, new BABYLON.Color3(1,.85,.5), 'lens1.png', lensFlareSystem);


//let skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
//let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
//skyboxMaterial.backFaceCulling = false;
//skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("scene/textures/skybox/skybox", scene);
//skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
//skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
//skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
//skybox.material = skyboxMaterial;
//зашляпим сюда н авремя афтерлод

afterLoad();
  return scene;
};

var asyncEngineCreation = async function() {
  console.log(createDefaultEngine())
  try {
    return createDefaultEngine();
  } catch (e) {
    console.log("the available createEngine function failed. Creating the default engine instead");
    return createDefaultEngine();
  }
}
window.initFunction = async function() {

  engine = await asyncEngineCreation();
  if (!engine) throw 'engine should not be null.';
  scene = await createScene();
  window.scene = scene;
};
window.initFunction().then(() => {
  sceneToRender = scene
  engine.runRenderLoop(function() {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
});

// Resize
window.addEventListener("resize", function() {
  engine.resize();
});

window.flareShit = function(){
  let vec1 = scene.cameras[0].position.subtract(new BABYLON.Vector3(-100,0,0)).normalize();
  let vec2 = (new BABYLON.Vector3(1.9860802493366045,0.23272829795442437,0.035902136204444254)).subtract(new BABYLON.Vector3(-100,0,0)).normalize();
  let trueFw = Math.abs(BABYLON.Vector3.GetAngleBetweenVectors(vec1, vec2, vec2.add(vec1)));
  console.log(trueFw);
}
