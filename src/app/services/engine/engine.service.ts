
import { WindowRefService } from '../window-ref/window-ref.service';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import * as BABYLON from 'babylonjs';
import 'babylonjs-materials';
import * as MESHWRITER from 'meshwriter';

// import '@babylonjs/core/Debug/debugLayer';
// import '@babylonjs/inspector';



import { MessageService } from '../message/message.service';
import { AudioService } from '../audio/audio.service';
import { OptionsService } from '../options/options.service';
import { StorageService } from '../storage/storage.service';
import { ColorsService } from '../colors/colors.service';

import { SpherePlaneManagerSPS } from '../../visualization-classes/SpherePlaneManagerSPS';
import { StarManager } from '../../visualization-classes/StarManager';
import { Spectrograph } from '../../visualization-classes/Spectrograph';
import { Rings } from '../../visualization-classes/Rings';
import { Hex } from '../../visualization-classes/Hex';
import { WaveRibbon } from '../../visualization-classes/WaveRibbon';
import { SingleSPSCube } from '../../visualization-classes/SingleSPSCube';
import { SingleSPSRibbon } from '../../visualization-classes/SingleSPSRibbon';


@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas: HTMLCanvasElement;
  public engine: BABYLON.Engine;
  public camera1: BABYLON.ArcRotateCamera;
  public camera2: BABYLON.FollowCamera;
  public scene: BABYLON.Scene;
  private visualClasses;
  private visualClassIndex;
  private currentVisual;
  private showAxis = false;
  private hexMesh;
  private finalHexGround;
  private hexMat;
  private groundMat;
  private groundCover;
  private tube1;
  private tube2;
  private matGroundCover;
  private tubeMat;

  private resizeObservable$: Observable<Event>;
  private resizeSubscription$: Subscription;

  glowLayer;
  highlightLayer;
  subscription;
  hexSPS;
  hexParent;
  Writer;
  titleText;
  titleSPS;
  titleMat;
  skybox;
  skyboxMaterial;
  cameraTarget;


  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    public messageService: MessageService,
    public audioService: AudioService,
    public optionsService: OptionsService,
    public storageService: StorageService,
    public colorsService: ColorsService
  ) {

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.engine.resize();
    });


    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        if (message === 'scene change') {
          this.selectVisual(this.optionsService.currentVisual);
        }
      });

    this.visualClassIndex = this.optionsService.currentVisual;
    this.visualClasses = [
      SingleSPSCube,
      SingleSPSRibbon,
      StarManager,
      Spectrograph,
      SpherePlaneManagerSPS,
      Rings,
      Hex,
      WaveRibbon
    ];

  }


  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {

    this.canvas = canvas.nativeElement;
    this.engine = new BABYLON.Engine(this.canvas, true, { stencil: true });

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    this.scene.ambientColor = new BABYLON.Color3(.5, .5, .5);
    this.scene.registerBeforeRender(this.beforeRender);

    this.highlightLayer = new BABYLON.HighlightLayer('hl1', this.scene);

    this.glowLayer = new BABYLON.GlowLayer('glow', this.scene);
    this.glowLayer.intensity = 1;

    this.cameraTarget = new BABYLON.TransformNode('cameraTarget', this.scene);
    // this.cameraTarget = BABYLON.MeshBuilder.CreateSphere('cameraTarget', { diameter: 1, segments: 16, updatable: true }, this.scene);

    this.cameraTarget.position = new BABYLON.Vector3(0, 0, 0);

    this.camera1 = new BABYLON.ArcRotateCamera('ArcRotateCam', 4.7, 1.1, 1600, new BABYLON.Vector3(0, 0, 0), this.scene);
    this.camera1.upperRadiusLimit = 9400;
    this.camera1.lowerRadiusLimit = 10;
    this.camera1.attachControl(this.canvas, true);
    this.camera1.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;
    // this.camera1.fovMode = BABYLON.Camera.FOVMODE_VERTICAL_FIXED;


    let x = 500 * Math.cos(0);
    let z = 500 * Math.sin(0);
    let y = 100;

    // Parameters: name, position, scene
    this.camera2 = new BABYLON.FollowCamera('FollowCam', new BABYLON.Vector3(x, y, z), this.scene);

    // The goal distance of camera from target
    this.camera2.radius = 5; // 100;

    // The goal height of camera above local origin (centre) of target
    this.camera2.heightOffset = 0; // 80;

    // The goal rotation of camera around local origin (centre) of target in x y plane
    this.camera2.rotationOffset = 160;

    // Acceleration of camera in moving from current to goal position
    this.camera2.cameraAcceleration = 0.5; // .005

    // The speed at which acceleration is halted
    this.camera2.maxCameraSpeed = 5;

    // This attaches the camera to the canvas
    this.camera2.attachControl(this.canvas, true);


    // NOTE:: SET CAMERA TARGET AFTER THE TARGET'S CREATION AND NOTE CHANGE FROM BABYLONJS V 2.5
    // targetMesh created here.
    // this.camera2.target = this.cameraTarget;   // version 2.4 and earlier
    this.camera2.lockedTarget = this.cameraTarget; // version 2.5 onwards

    console.log('this.camera2');
    console.log(this.camera2);



    this.scene.activeCamera = this.camera1;

    const pointLight1 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(500, 500, -600), this.scene);

    const pointLight2 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(-500, -500, 600), this.scene);
    pointLight2.intensity = 1.3;

    const pointLight3 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 500, 0), this.scene);

    const pointLight4 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(800, 480, -280), this.scene);
    pointLight4.intensity = .75;

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, -1, 0), this.scene);

    // tslint:disable-next-line: max-line-length
    this.currentVisual = new this.visualClasses[this.visualClassIndex](this.scene, this.audioService, this.optionsService, this.messageService, this, this.colorsService);
    this.currentVisual.create();

    if (this.showAxis) {
      this.showWorldAxis(150);
    }

    this.createHexObj();

    this.Writer = new MESHWRITER(this.scene, { scale: 10 });

    console.log('in create scene');
    console.log('this.visualClassIndex');
    console.log(this.visualClassIndex);



    this.skybox = BABYLON.Mesh.CreateBox("skyBox", 10000.0, this.scene);
    this.skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    this.skyboxMaterial.backFaceCulling = false;
    this.skyboxMaterial.disableLighting = true;
    this.skybox.material = this.skyboxMaterial;

    this.skybox.infiniteDistance = true;
    this.skyboxMaterial.disableLighting = true;

    // this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../../assets/images/skybox/TropicalSunnyDay', this.scene);
    // this.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;





    /*
        this.titleMat = new BABYLON.StandardMaterial('titleMat', this.scene);
        this.titleMat.alpha = 1;
        this.titleMat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.titleMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
        this.titleMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    
        this.createTitleText('Have Yourself a Merry Little Christmas');
    */
    console.log(this.scene);
  }

  public animate(): void {
    console.log('starting animate');
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        if (this.audioService.audio != null) {
          this.audioService.analyzeData();
        }
        this.fixDpi();

        this.currentVisual.update();
        this.scene.render();
      };

      if (this.windowRef.document.readyState !== 'loading') {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        this.windowRef.window.addEventListener('DOMContentLoaded', () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }
    });
  }

  // resizeCanvas = () => {
  //   console.log('in resizeCanvas');
  //   this.canvas.width = +window.getComputedStyle(this.canvas).width.slice(0, -2);
  // }

  saveCamera() {
    console.log('in saveCamera');
    this.optionsService.options[this.optionsService.visuals[this.visualClassIndex]].calpha
      = (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha;

    this.optionsService.options[this.optionsService.visuals[this.visualClassIndex]].cbeta
      = (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta;

    this.optionsService.options[this.optionsService.visuals[this.visualClassIndex]].cradius
      = (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius;

    this.storageService.saveOptions(this.optionsService.options);

  }

  selectVisual(index) {
    console.log('in selectVisual');
    this.saveCamera();

    this.currentVisual.remove();

    this.currentVisual = null;

    this.visualClassIndex = index;
    // tslint:disable-next-line: max-line-length
    this.currentVisual = new this.visualClasses[index](this.scene, this.audioService, this.optionsService, this.messageService, this, this.colorsService);
    this.currentVisual.create();

  }

  fixDpi = () => {
    // console.log('in fixdpi');
    // create a style object that returns width and height
    const dpi = window.devicePixelRatio;
    const styles = window.getComputedStyle(this.canvas);
    const style = {
      height() {
        return +styles.height.slice(0, -2);
      },
      width() {
        return +styles.width.slice(0, -2);
      }
    };
    // set the correct canvas attributes for device dpi
    this.canvas.setAttribute('width', (style.width() * dpi).toString());
    this.canvas.setAttribute('height', (style.height() * dpi).toString());
  }

  showWorldAxis = (size) => {
    console.log('in showWorldAxis');
    const makeTextPlane = (text: string, color: string, textSize: number) => {
      const dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 50, this.scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
      // @todo fix <any> - actual a hack for @types Error...
      const plane = BABYLON.Mesh.CreatePlane('TextPlane', textSize, this.scene, true);
      const material = new BABYLON.StandardMaterial('TextPlaneMaterial', this.scene);
      plane.material = material;
      material.backFaceCulling = false;
      material.specularColor = new BABYLON.Color3(0, 0, 0);
      material.diffuseTexture = dynamicTexture;
      return plane;
    };
    const axisX = BABYLON.Mesh.CreateLines('axisX', [
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], this.scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    const axisY = BABYLON.Mesh.CreateLines('axisY', [
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
      new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], this.scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    const axisZ = BABYLON.Mesh.CreateLines('axisZ', [
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
      new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ], this.scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
  }

  createHexObj() {

    this.hexParent = new BABYLON.TransformNode('root');

    let x: number;
    let x2: number;
    let z: number;

    this.hexMat = new BABYLON.StandardMaterial(`material`, this.scene);
    this.hexMat.bumpTexture = new BABYLON.Texture('../../assets/images/normal8.jpg', this.scene);
    this.hexMat.bumpTexture.uScale = 5;
    this.hexMat.bumpTexture.vScale = 5;

    const groundBox = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 880, tessellation: 6, height: 48 }, this.scene);
    groundBox.position.y = -24;
    const groundCSG = BABYLON.CSG.FromMesh(groundBox);

    // BUILD SPS ////////////////////////////////

    const innerPositionFunction = (particle, i, s) => {

      particle.position.x = (x2) * 35.5;
      particle.position.y = -24.5;
      particle.position.z = (z) * 31;
      particle.color = new BABYLON.Color3(.5, .5, .5);
      particle.rotation.y = Math.PI / 6;

    };

    this.hexSPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });
    const hex = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 38, tessellation: 6, height: 50 }, this.scene);
    hex.convertToFlatShadedMesh();

    for (z = -15; z < 15; z++) {
      for (x = -15; x < 15; x++) {
        x2 = x;
        if (Math.abs(z) % 2 === 1) {
          x2 = x - .5;
        }
        const d = Math.sqrt((x2 * x2) + (z * z));
        if (d <= 13.3) {
          this.hexSPS.addShape(hex, 1, { positionFunction: innerPositionFunction });
        }
      }
    }

    groundBox.dispose();

    this.hexMesh = this.hexSPS.buildMesh();
    this.hexMesh.material = this.hexMat;
    this.hexMesh.scaling.x = .8;
    this.hexMesh.scaling.y = .8;
    this.hexMesh.scaling.z = .8;
    this.hexMesh.parent = this.hexParent;

    const spsCSG = BABYLON.CSG.FromMesh(this.hexMesh);
    const holyGroundCSG = groundCSG.subtract(spsCSG);
    this.finalHexGround = holyGroundCSG.toMesh('ground', this.groundMat, this.scene);
    this.finalHexGround.position.y = -19;

    hex.dispose();

    this.hexSPS.updateParticle = (particle) => {
      let yy = this.audioService.sample1[555 - particle.idx];
      yy = (yy / 255 * yy / 255) * 255;

      particle.color.r = this.colorsService.colors(yy).r / 255;
      particle.color.g = this.colorsService.colors(yy).g / 255;
      particle.color.b = this.colorsService.colors(yy).b / 255;

      particle.position.y = -24.5 + yy / 3;
      particle.scaling.x = .9;
      particle.scaling.z = .9;
    };

    this.matGroundCover = new BABYLON.StandardMaterial('mat1', this.scene);
    this.matGroundCover.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse1.jpg', this.scene);
    this.matGroundCover.bumpTexture = new BABYLON.Texture('../../assets/mats/normal1.jpg', this.scene);
    (this.matGroundCover.diffuseTexture as BABYLON.Texture).vScale = 2;
    (this.matGroundCover.bumpTexture as BABYLON.Texture).vScale = 2;
    (this.matGroundCover.diffuseTexture as BABYLON.Texture).uScale = 100;
    (this.matGroundCover.bumpTexture as BABYLON.Texture).uScale = 100;

    const matGround = new BABYLON.StandardMaterial('mat1', this.scene);
    matGround.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse2.jpg', this.scene);
    matGround.bumpTexture = new BABYLON.Texture('../../assets/mats/normal2.jpg', this.scene);

    (matGround.diffuseTexture as BABYLON.Texture).uScale = 10;
    (matGround.diffuseTexture as BABYLON.Texture).vScale = 10;
    (matGround.bumpTexture as BABYLON.Texture).uScale = 10;
    (matGround.bumpTexture as BABYLON.Texture).vScale = 10;

    this.finalHexGround.material = matGround;
    this.finalHexGround.parent = this.hexParent;

    const path = [];
    const segLength = 100;
    const numSides = 6;

    const mat = new BABYLON.StandardMaterial('mat1', this.scene);
    mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    mat.backFaceCulling = false;

    for (let i = -1; i <= 0; i++) {
      const xx = (i / 2) * segLength;
      const yy = 0;
      const zz = 0;
      path.push(new BABYLON.Vector3(xx, yy, zz));
    }

    this.groundCover = BABYLON.Mesh.CreateTube('tube', path, 441, numSides, null, 0, this.scene);
    this.groundCover.rotation.z = Math.PI / 2;
    this.groundCover.rotation.y = Math.PI / 6;

    this.groundCover.material = this.matGroundCover;
    this.groundCover.convertToFlatShadedMesh();
    this.groundCover.position.y = 6;

    this.groundCover.parent = this.hexParent;

    this.tubeMat = new BABYLON.StandardMaterial('mat1', this.scene);
    this.tubeMat.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse3.jpg', this.scene);
    this.tubeMat.bumpTexture = new BABYLON.Texture('../../assets/mats/normal3.jpg', this.scene);
    (this.tubeMat.diffuseTexture as BABYLON.Texture).uScale = 50;

    this.tube1 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 880, thickness: 13, tessellation: 6 }, this.scene);
    this.tube1.material = mat;
    this.tube1.position.y = 7.5;
    this.tube1.parent = this.hexParent;
    this.tube1.scaling.y = .5;
    this.tube1.material = this.tubeMat;
    this.tube1.rotation.y = Math.PI / 6;

    this.tube2 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 880, thickness: 13, tessellation: 6 }, this.scene);
    this.tube2.material = mat;
    this.tube2.position.y = -48;
    this.tube2.parent = this.hexParent;
    this.tube2.material = this.tubeMat;
    this.tube2.rotation.y = Math.PI / 6;

    // this.Writer = MeshWriter(this.scene, { scale: 1 });
    // this.Writer = new MESHWRITER(this.scene, { scale: 1 });
    // this.text1 = this.Writer(
    // 'ABC',
    // {
    //   'anchor': 'center',
    //   'letter - height': 50,
    //   'color': '#1C3870',
    //   'position': {
    //     'z': -2
    //   }
    // }
    // )

    this.hexParent.setEnabled(false);

  }


  createTitleText(text) {
    const scale = 10;
    const depth = .75;

    // this.titleSPS.mesh.dispose();
    // this.titleSPS.dispose();
    // this.titleText.dispose();
    // this.titleSPS = null;
    // this.titleText = null;

    this.titleText = new this.Writer(
      text,
      {
        anchor: 'center',
        'letter-height': scale,
        'letter-thickness': depth,
        color: '#ff0000',
        position: {
          x: 0,
          y: 90, // 90,
          z: 300, // 300
        }
      }
    );

    this.titleText.getMesh().setPivotPoint(this.titleText.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);

    this.titleText.getMesh().rotation.x = -Math.PI / 2;
    this.titleText.getMesh().material = this.titleMat;

    // this.titleSPS = this.titleText.getSPS() as BABYLON.SolidParticleSystem;
    this.titleSPS = this.titleText.getSPS();

    this.titleSPS.updateParticle = (particle) => {
      const py = this.audioService.sample1[(particle.idx + 1) * 5 + 192];
      particle.position.z = py / 5;
      const pc = this.colorsService.colors(py);
      particle.color.r = pc.r / 255;
      particle.color.g = pc.g / 255;
      particle.color.b = pc.b / 255;
    };


    console.log('this.titleSPS');
    console.log(this.titleSPS);
    console.log('this.titleText');
    console.log(this.titleText);

    this.titleText.getMesh().parent = this.camera1;
    // this.titleSPS.parent = this.camera1;

  }

  beforeRender = () => {
    // this.titleSPS.setParticles();
  }

  // create3DText(displayText, scale, depth, xPos, yPos, zPos, color) {
  //   // var  MeshWriter, text1, text2, C1, C2;

  //   const Writer = new MESHWRITER(this.scene, { scale });
  //   const text1 = new Writer(
  //     displayText,
  //     {
  //       anchor: 'center',
  //       'letter-height': scale,
  //       'letter-thickness': depth,
  //       color: '#ff0000',
  //       position: {
  //         x: xPos,
  //         y: yPos,
  //         z: zPos
  //       }
  //     }
  //   );

  //   text1.getMesh().setPivotPoint(text1.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);

  //   text1.getMesh().rotation.x = -Math.PI / 2;
  //   text1.getMesh().material = color;

  //   let textSPS = text1.getSPS();
  //   console.log('textSPS');
  //   console.log(textSPS);
  //   textSPS.particles[1].position.y = 500;

  //   console.log('text1');
  //   console.log(text1);

  //   return text1;
  // }

}
