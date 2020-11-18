
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

import { SpherePlaneManager2SPS } from '../../visualization-classes/SpherePlaneManager2SPS';
import { SpherePlaneManagerSPS } from '../../visualization-classes/SpherePlaneManagerSPS';

import { StarManager } from '../../visualization-classes/StarManager';
import { Spectrograph } from '../../visualization-classes/Spectrograph';
import { Rings } from '../../visualization-classes/Rings';
import { Hex } from '../../visualization-classes/Hex';
import { Notes } from '../../visualization-classes/Notes';
import { SingleSPSCube } from '../../visualization-classes/SingleSPSCube';
// import { SingleSPSRibbon } from '../../visualization-classes/SingleSPSRibbon';


@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas: HTMLCanvasElement;
  public engine: BABYLON.Engine;
  public camera1: BABYLON.ArcRotateCamera;
  public camera2: BABYLON.FollowCamera;
  public hLight1;
  public hLight2;
  public hLight3;
  public hLight4;
  public hLight5;
  public hLight6;
  public hLight7;
  public hLight8;
  public hLight1Mimic;
  public hLight3Mimic;
  public hLight5Mimic;
  public scene: BABYLON.Scene;
  private visualClasses;
  private visualClassIndex;
  private currentVisual;
  private hexMesh;
  private finalHexGround;
  private hexMat;
  private groundMat;
  private groundCover;
  private tube1;
  private tube2;
  private matGroundCover;
  private tubeMat;

  private showAxis;

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
  lightParent;


  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    public messageService: MessageService,
    public audioService: AudioService,
    public optionsService: OptionsService,
    public storageService: StorageService,
    public colorsService: ColorsService
  ) {

    this.showAxis = false;

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.engine.resize();
    });


    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        if (message === 'scene change') {
          this.selectVisual(this.optionsService.currentVisual);
        }

        if (message === 'set lights') {
          this.setLights();
        }
      });

    this.visualClassIndex = this.optionsService.currentVisual;
    this.visualClasses = [
      SingleSPSCube,
      // SingleSPSRibbon,
      StarManager,
      Spectrograph,
      SpherePlaneManagerSPS,
      SpherePlaneManager2SPS,
      Rings,
      Hex,
      Notes
    ];

  }


  public setGlowLayer(intensity) {

    // var gl = new BABYLON.GlowLayer("glow", this.scene, {
    //   mainTextureFixedSize: 1024,
    //   blurKernelSize: 64
    // });

    if (this.glowLayer) {
      this.glowLayer.intensity = intensity;
    } else {
      this.glowLayer = new BABYLON.GlowLayer('glow', this.scene);
      this.glowLayer.intensity = intensity;
    }

  }


  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {

    this.canvas = canvas.nativeElement;
    this.engine = new BABYLON.Engine(this.canvas, true, { stencil: true });

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.registerBeforeRender(this.beforeRender);

    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    this.highlightLayer = new BABYLON.HighlightLayer('hl1', this.scene);

    this.setGlowLayer(1);

    this.skyboxMaterial = new BABYLON.StandardMaterial('skyBox', this.scene);
    this.skyboxMaterial.backFaceCulling = false;
    this.skyboxMaterial.disableLighting = true;

    this.skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('../../assets/images/skybox/TropicalSunnyDay', this.scene);
    this.skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    this.skybox = BABYLON.Mesh.CreateBox('skyBox', 10000.0, this.scene);
    this.skybox.infiniteDistance = true;
    this.skybox.material = this.skyboxMaterial;

    this.skybox.setEnabled(false);



    //////    CAMERAS    //////

    this.cameraTarget = new BABYLON.TransformNode('cameraTarget', this.scene);
    // this.cameraTarget = BABYLON.MeshBuilder.CreateSphere('cameraTarget', { diameter: 1, segments: 16, updatable: true }, this.scene);

    this.cameraTarget.position = new BABYLON.Vector3(0, 0, 0);

    this.camera1 = new BABYLON.ArcRotateCamera('ArcRotateCam', Math.PI / 2, Math.PI / 2, 1600, new BABYLON.Vector3(0, 0, 0), this.scene);
    this.camera1.upperRadiusLimit = 9400;
    this.camera1.lowerRadiusLimit = 10;
    this.camera1.attachControl(this.canvas, true);
    this.camera1.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;
    // this.camera1.fovMode = BABYLON.Camera.FOVMODE_VERTICAL_FIXED;


    const x = 500 * Math.cos(0);
    const z = 500 * Math.sin(0);
    const y = 100;

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

    // console.log('this.camera2');
    // console.log(this.camera2);

    this.scene.activeCamera = this.camera1;


    //////   LIGHTING   //////

    this.lightParent = new BABYLON.TransformNode('lightParent', this.scene);

    // front
    this.hLight1Mimic = new BABYLON.TransformNode('light1Mimic', this.scene);
    this.hLight1Mimic.setParent(this.lightParent);
    this.hLight1Mimic.position = new BABYLON.Vector3(0, 0, -1);

    this.hLight1 = new BABYLON.HemisphericLight('hLight1', new BABYLON.Vector3(0, 0, -1), this.scene);
    this.hLight1.intensity = 0;
    this.hLight1.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight1.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight1.groundColor = new BABYLON.Color3(0, 0, 0);

    // back
    this.hLight2 = new BABYLON.HemisphericLight('hLight2', new BABYLON.Vector3(0, 0, 1), this.scene);
    this.hLight2.intensity = 0;
    this.hLight2.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight2.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight2.groundColor = new BABYLON.Color3(0, 0, 0);

    // left
    this.hLight3Mimic = new BABYLON.TransformNode('light3Mimic', this.scene);
    this.hLight3Mimic.setParent(this.lightParent);
    this.hLight3Mimic.position = new BABYLON.Vector3(-1, 0, 0);

    this.hLight3 = new BABYLON.HemisphericLight('hLight3', new BABYLON.Vector3(-1, 0, 0), this.scene);
    this.hLight3.intensity = 0;
    this.hLight3.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight3.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight3.groundColor = new BABYLON.Color3(0, 0, 0);

    // right
    this.hLight4 = new BABYLON.HemisphericLight('hLight4', new BABYLON.Vector3(1, 0, 0), this.scene);
    this.hLight4.intensity = 0;
    this.hLight4.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight4.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight4.groundColor = new BABYLON.Color3(0, 0, 0);

    // down
    this.hLight5Mimic = new BABYLON.TransformNode('light5Mimic', this.scene);
    this.hLight5Mimic.setParent(this.lightParent);
    this.hLight5Mimic.position = new BABYLON.Vector3(0, 1, 0);

    this.hLight5 = new BABYLON.HemisphericLight('hLight5', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.hLight5.intensity = 0;
    this.hLight5.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight5.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight5.groundColor = new BABYLON.Color3(0, 0, 0);

    // up
    this.hLight6 = new BABYLON.HemisphericLight('hLight6', new BABYLON.Vector3(0, -1, 0), this.scene);
    this.hLight6.intensity = 0;
    this.hLight6.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight6.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight6.groundColor = new BABYLON.Color3(0, 0, 0);

    // camera
    this.hLight7 = new BABYLON.HemisphericLight('hLight7', new BABYLON.Vector3(0, 0, -1), this.scene);
    this.hLight7.intensity = 0;
    this.hLight7.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight7.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight7.groundColor = new BABYLON.Color3(0, 0, 0);

    // camera backlight
    this.hLight8 = new BABYLON.HemisphericLight('hLight8', new BABYLON.Vector3(0, 0, 1), this.scene);
    this.hLight8.intensity = 0;
    this.hLight8.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight8.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight8.groundColor = new BABYLON.Color3(0, 0, 0);

    this.setCameraLightVectors();

    //////    AXIS FOR DEBUGGING    //////


    if (this.showAxis) {
      this.showWorldAxis(600);

      for (let index = -1000; index <= 1000; index += 100) {
        const hexX100 = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 1, tessellation: 6, height: 100 }, this.scene);
        hexX100.position = new BABYLON.Vector3(index, 0, 0);

        const hexZ100 = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 1, tessellation: 6, height: 100 }, this.scene);
        hexZ100.position = new BABYLON.Vector3(0, 0, index);
      }
    }



    //////    SCENE INITIALIZATIONS    //////

    // tslint:disable-next-line: max-line-length
    this.currentVisual = new this.visualClasses[this.visualClassIndex](this.scene, this.audioService, this.optionsService, this.messageService, this, this.colorsService);
    this.currentVisual.create();

    this.createHexObj();

    this.Writer = new MESHWRITER(this.scene, { scale: 10 });

    // console.log('in create scene');
    // console.log('this.visualClassIndex');
    // console.log(this.visualClassIndex);



    // this.titleMat = new BABYLON.StandardMaterial('titleMat', this.scene);
    // this.titleMat.alpha = 1;
    // this.titleMat.specularColor = new BABYLON.Color3(0, 0, 0);
    // this.titleMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
    // this.titleMat.diffuseColor = new BABYLON.Color3(1, 1, 1);

    // this.createTitleText('Have Yourself a Merry Little Christmas');

    console.log(this.scene);

  }

  public setCameraLightVectors() {

    // TO DO: only set normal light vectors if rotation has changed
    const l1Position = BABYLON.Vector3.TransformCoordinates(this.hLight1Mimic.position, this.hLight1Mimic.getWorldMatrix());
    const l3Position = BABYLON.Vector3.TransformCoordinates(this.hLight3Mimic.position, this.hLight3Mimic.getWorldMatrix());
    const l5Position = BABYLON.Vector3.TransformCoordinates(this.hLight5Mimic.position, this.hLight5Mimic.getWorldMatrix());


    (this.scene.lights[0] as BABYLON.HemisphericLight).direction.x = l1Position.x;
    (this.scene.lights[0] as BABYLON.HemisphericLight).direction.y = l1Position.y;
    (this.scene.lights[0] as BABYLON.HemisphericLight).direction.z = l1Position.z;

    (this.scene.lights[1] as BABYLON.HemisphericLight).direction.x = -l1Position.x;
    (this.scene.lights[1] as BABYLON.HemisphericLight).direction.y = -l1Position.y;
    (this.scene.lights[1] as BABYLON.HemisphericLight).direction.z = -l1Position.z;


    (this.scene.lights[2] as BABYLON.HemisphericLight).direction.x = l3Position.x;
    (this.scene.lights[2] as BABYLON.HemisphericLight).direction.y = l3Position.y;
    (this.scene.lights[2] as BABYLON.HemisphericLight).direction.z = l3Position.z;

    (this.scene.lights[3] as BABYLON.HemisphericLight).direction.x = -l3Position.x;
    (this.scene.lights[3] as BABYLON.HemisphericLight).direction.y = -l3Position.y;
    (this.scene.lights[3] as BABYLON.HemisphericLight).direction.z = -l3Position.z;


    (this.scene.lights[4] as BABYLON.HemisphericLight).direction.x = l5Position.x;
    (this.scene.lights[4] as BABYLON.HemisphericLight).direction.y = l5Position.y;
    (this.scene.lights[4] as BABYLON.HemisphericLight).direction.z = l5Position.z;

    (this.scene.lights[5] as BABYLON.HemisphericLight).direction.x = -l5Position.x;
    (this.scene.lights[5] as BABYLON.HemisphericLight).direction.y = -l5Position.y;
    (this.scene.lights[5] as BABYLON.HemisphericLight).direction.z = -l5Position.z;



    (this.scene.lights[6] as BABYLON.HemisphericLight).direction.x = this.camera1.position.x;
    (this.scene.lights[6] as BABYLON.HemisphericLight).direction.y = this.camera1.position.y;
    (this.scene.lights[6] as BABYLON.HemisphericLight).direction.z = this.camera1.position.z;

    (this.scene.lights[7] as BABYLON.HemisphericLight).direction.x = -this.camera1.position.x;
    (this.scene.lights[7] as BABYLON.HemisphericLight).direction.y = -this.camera1.position.y;
    (this.scene.lights[7] as BABYLON.HemisphericLight).direction.z = -this.camera1.position.z;
  }

  public setLights() {

    // console.log('light0');
    // console.log(this.scene.lights[0]);

    // // front
    // this.scene.lights[0].intensity = this.optionsService.options.light0Intensity.value / 100;
    // this.scene.lights[0].diffuse = BABYLON.Color3.FromHexString(this.optionsService.options.light0Color.value);
    // this.scene.lights[0].specular = BABYLON.Color3.FromHexString(this.optionsService.options.light0Specular.value);
    // (this.scene.lights[0] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.options.light0GroundColor.value);

    // // back
    // this.scene.lights[1].intensity = this.optionsService.options.light1Intensity.value / 100;
    // this.scene.lights[1].diffuse = BABYLON.Color3.FromHexString(this.optionsService.options.light1Color.value);
    // this.scene.lights[1].specular = BABYLON.Color3.FromHexString(this.optionsService.options.light1Specular.value);
    // (this.scene.lights[1] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.options.light1GroundColor.value);

    // // left
    // this.scene.lights[2].intensity = this.optionsService.options.light2Intensity.value / 100;
    // this.scene.lights[2].diffuse = BABYLON.Color3.FromHexString(this.optionsService.options.light2Color.value);
    // this.scene.lights[2].specular = BABYLON.Color3.FromHexString(this.optionsService.options.light2Specular.value);
    // (this.scene.lights[2] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.options.light2GroundColor.value);

    // // right
    // this.scene.lights[3].intensity = this.optionsService.options.light3Intensity.value / 100;
    // this.scene.lights[3].diffuse = BABYLON.Color3.FromHexString(this.optionsService.options.light3Color.value);
    // this.scene.lights[3].specular = BABYLON.Color3.FromHexString(this.optionsService.options.light3Specular.value);
    // (this.scene.lights[3] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.options.light3GroundColor.value);

    // // top
    // this.scene.lights[4].intensity = this.optionsService.options.light4Intensity.value / 100;
    // this.scene.lights[4].diffuse = BABYLON.Color3.FromHexString(this.optionsService.options.light4Color.value);
    // this.scene.lights[4].specular = BABYLON.Color3.FromHexString(this.optionsService.options.light4Specular.value);
    // (this.scene.lights[4] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.options.light4GroundColor.value);

    // // bottom
    // this.scene.lights[5].intensity = this.optionsService.options.light5Intensity.value / 100;
    // this.scene.lights[5].diffuse = BABYLON.Color3.FromHexString(this.optionsService.options.light5Color.value);
    // this.scene.lights[5].specular = BABYLON.Color3.FromHexString(this.optionsService.options.light5Specular.value);
    // (this.scene.lights[5] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.options.light5GroundColor.value);

    // // camera
    // this.scene.lights[6].intensity = this.optionsService.options.light6Intensity.value / 100;
    // this.scene.lights[6].diffuse = BABYLON.Color3.FromHexString(this.optionsService.options.light6Color.value);
    // this.scene.lights[6].specular = BABYLON.Color3.FromHexString(this.optionsService.options.light6Specular.value);
    // (this.scene.lights[6] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.options.light6GroundColor.value);

    // // rim
    // this.scene.lights[7].intensity = this.optionsService.options.light7Intensity.value / 100;
    // this.scene.lights[7].diffuse = BABYLON.Color3.FromHexString(this.optionsService.options.light7Color.value);
    // this.scene.lights[7].specular = BABYLON.Color3.FromHexString(this.optionsService.options.light7Specular.value);
    // (this.scene.lights[7] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.options.light7GroundColor.value);







    // front
    this.scene.lights[0].intensity = this.optionsService.light0Intensity / 100;
    this.scene.lights[0].diffuse = BABYLON.Color3.FromHexString(this.optionsService.light0Color);
    this.scene.lights[0].specular = BABYLON.Color3.FromHexString(this.optionsService.light0Specular);
    (this.scene.lights[0] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.light0GroundColor);

    // back
    this.scene.lights[1].intensity = this.optionsService.light1Intensity / 100;
    this.scene.lights[1].diffuse = BABYLON.Color3.FromHexString(this.optionsService.light1Color);
    this.scene.lights[1].specular = BABYLON.Color3.FromHexString(this.optionsService.light1Specular);
    (this.scene.lights[1] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.light1GroundColor);

    // left
    this.scene.lights[2].intensity = this.optionsService.light2Intensity / 100;
    this.scene.lights[2].diffuse = BABYLON.Color3.FromHexString(this.optionsService.light2Color);
    this.scene.lights[2].specular = BABYLON.Color3.FromHexString(this.optionsService.light2Specular);
    (this.scene.lights[2] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.light2GroundColor);

    // right
    this.scene.lights[3].intensity = this.optionsService.light3Intensity / 100;
    this.scene.lights[3].diffuse = BABYLON.Color3.FromHexString(this.optionsService.light3Color);
    this.scene.lights[3].specular = BABYLON.Color3.FromHexString(this.optionsService.light3Specular);
    (this.scene.lights[3] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.light3GroundColor);

    // top
    this.scene.lights[4].intensity = this.optionsService.light4Intensity / 100;
    this.scene.lights[4].diffuse = BABYLON.Color3.FromHexString(this.optionsService.light4Color);
    this.scene.lights[4].specular = BABYLON.Color3.FromHexString(this.optionsService.light4Specular);
    (this.scene.lights[4] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.light4GroundColor);

    // bottom
    this.scene.lights[5].intensity = this.optionsService.light5Intensity / 100;
    this.scene.lights[5].diffuse = BABYLON.Color3.FromHexString(this.optionsService.light5Color);
    this.scene.lights[5].specular = BABYLON.Color3.FromHexString(this.optionsService.light5Specular);
    (this.scene.lights[5] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.light5GroundColor);

    // camera
    this.scene.lights[6].intensity = this.optionsService.light6Intensity / 100;
    this.scene.lights[6].diffuse = BABYLON.Color3.FromHexString(this.optionsService.light6Color);
    this.scene.lights[6].specular = BABYLON.Color3.FromHexString(this.optionsService.light6Specular);
    (this.scene.lights[6] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.light6GroundColor);

    // rim
    this.scene.lights[7].intensity = this.optionsService.light7Intensity / 100;
    this.scene.lights[7].diffuse = BABYLON.Color3.FromHexString(this.optionsService.light7Color);
    this.scene.lights[7].specular = BABYLON.Color3.FromHexString(this.optionsService.light7Specular);
    (this.scene.lights[7] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.light7GroundColor);













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
        // this.lightParent.rotation.y += .03;
        this.setCameraLightVectors();

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
    // console.log('in saveCamera');
    this.optionsService.options[this.optionsService.visuals[this.visualClassIndex]].calpha
      = (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha;

    this.optionsService.options[this.optionsService.visuals[this.visualClassIndex]].cbeta
      = (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta;

    this.optionsService.options[this.optionsService.visuals[this.visualClassIndex]].cradius
      = (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius;

    this.storageService.saveOptions(this.optionsService.options);

  }

  selectVisual(index) {
    // console.log('in selectVisual');
    this.saveCamera();

    this.currentVisual.remove();

    this.currentVisual = null;

    this.visualClassIndex = index;
    // tslint:disable-next-line: max-line-length
    this.currentVisual = new this.visualClasses[index](this.scene, this.audioService, this.optionsService, this.messageService, this, this.colorsService);
    this.currentVisual.create();
    this.setLights();


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
    // this.hexMat.bumpTexture = new BABYLON.Texture('../../assets/mats/normal2.jpg', this.scene);
    // this.hexMat.bumpTexture.uScale = 4;
    // this.hexMat.bumpTexture.vScale = 4;
    // this.hexMat.emmisiveColor =

    this.hexMat.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse2.jpg', this.scene);
    this.hexMat.diffuseTexture.uScale = 4;
    this.hexMat.diffuseTexture.vScale = 4;


    const groundBox = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 880, tessellation: 6, height: 48 }, this.scene);
    groundBox.position.y = -24;
    const groundCSG = BABYLON.CSG.FromMesh(groundBox);
    groundBox.dispose();

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


    this.hexMesh = this.hexSPS.buildMesh();
    this.hexMesh.material = this.hexMat;
    this.hexMesh.scaling.x = .8;
    this.hexMesh.scaling.y = .8;
    this.hexMesh.scaling.z = .8;
    this.hexMesh.parent = this.hexParent;

    // this.highlightLayer.addMesh(this.hexMesh,
    //       new BABYLON.Color3(0, .75, .75));

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

    this.hexParent.rotation.y = Math.PI;
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

  create3DText(displayText, scale, depth, xPos, yPos, zPos, color) {
    // var  MeshWriter, text1, text2, C1, C2;

    const Writer = new MESHWRITER(this.scene, { scale });
    const text1 = new Writer(
      displayText,
      {
        anchor: 'center',
        'letter-height': scale,
        'letter-thickness': depth,
        color: '#ff0000',
        position: {
          x: xPos,
          y: yPos,
          z: zPos
        }
      }
    );

    text1.getMesh().setPivotPoint(text1.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);

    text1.getMesh().rotation.x = -Math.PI / 2;
    text1.getMesh().material = color;

    let textSPS = text1.getSPS();
    console.log('textSPS');
    console.log(textSPS);
    textSPS.particles[1].position.y = 500;

    console.log('text1');
    console.log(text1);

    return text1;
  }

}
