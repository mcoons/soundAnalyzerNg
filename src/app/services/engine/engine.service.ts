
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
import { DancingRainbow } from '../../visualization-classes/DancingRainbow';
import { Morph } from '../../visualization-classes/Morph';
import { Lights } from '../../visualization-classes/Lights';
import { Mirror } from '../../visualization-classes/Mirror';
import { SingleSPSCube } from '../../visualization-classes/SingleSPSCube';
import { SingleSPSTriangle } from '../../visualization-classes/SingleSPSTriangle';
// import { SingleSPSRibbon } from '../../visualization-classes/SingleSPSRibbon';


@Injectable({ providedIn: 'root' })
export class EngineService {

  private canvas: HTMLCanvasElement;
  private effectsCanvas: HTMLCanvasElement;
  private tmpCanvas: HTMLCanvasElement;

  private tmpCtx;
  private effectsCtx;
  // private canvasCtx;

  public engine: BABYLON.Engine;
  public camera1: BABYLON.ArcRotateCamera;
  public camera2: BABYLON.ArcRotateCamera;
  public renderTargetTexture;
  public camera2Material;

  public hLight1;
  public hLight2;
  public hLight3;
  public hLight4;
  public hLight5;
  public hLight6;
  public hLight7;
  public hLight8;
  public hLight1Mimic;
  public hLight2Mimic;
  public hLight3Mimic;
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
  private groundMatCover;
  private tubeMat;

  public showAxis = true;

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
  yyMax = 0;
  yyMin = 1000000;

  axisParent;


  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    public messageService: MessageService,
    public audioService: AudioService,
    public optionsService: OptionsService,
    public storageService: StorageService,
    public colorsService: ColorsService
  ) {
    console.log('Engine Service Constructor');

    // this.showAxis = false;

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.engine.resize();
    });


    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        if (message === 'scene change') {
          this.selectVisual(this.optionsService.newBaseOptions.currentVisual);
        }

        if (message === 'set lights') {
          this.setLights();
        }

        if (message === 'set camera') {
          this.setCamera();
        }
      });

    this.visualClassIndex = this.optionsService.newBaseOptions.currentVisual;
    // console.log(this.optionsService.newBaseOptions.visual.map(element => element.label));

    this.visualClasses = [
      SingleSPSCube,
      // SingleSPSRibbon,
      StarManager,
      Spectrograph,
      SpherePlaneManagerSPS,
      SpherePlaneManager2SPS,
      Rings,
      DancingRainbow,
      Morph,
      Hex,
      Notes,
      SingleSPSTriangle,
      Lights,
      Mirror
    ];

  }

  public setCamera(): void {
    this.camera1.alpha = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].calpha;
    this.camera1.beta = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].cbeta;
    this.camera1.radius = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].cradius;
  }


  public setGlowLayer = (intensity: number): void => {

    // var gl = new BABYLON.GlowLayer("glow", this.scene, {
    //   mainTextureFixedSize: 1024,
    //   blurKernelSize: 64
    // });

    if (this.glowLayer) {
      this.glowLayer.intensity = intensity;
    } else {
      this.glowLayer = new BABYLON.GlowLayer('glow', this.scene
        , {
          // mainTextureFixedSize: 128,
          mainTextureRatio: 1,
          blurKernelSize: 360
        }
      );
      this.glowLayer.intensity = intensity;

      this.glowLayer.customEmissiveColorSelector = (mesh, subMesh, material, result) => {

        const data = mesh.name.split('-');
        const series = data[0];
        const index = Number(data[1]);

        let yy = this.audioService.sample2[index];

        const columnGroup = Math.trunc(index / 32);
        // const row = index % 32;

        switch (series) {

          case 'torusLight':
            yy = this.audioService.sample2[index];

            yy = (yy / 255 * yy / 255 * yy / 255 * yy / 255 * yy / 255) * 245 * (columnGroup + 1);
            result.set(yy, yy, yy, 1);
            break;

          default:
            result.set(0, 0, 0, 0);
            break;
        }

      }
    }

  }


  public createScene(canvas: ElementRef<HTMLCanvasElement>, effects: ElementRef<HTMLCanvasElement>, tmp: ElementRef<HTMLCanvasElement>): void {

    this.canvas = canvas.nativeElement;
    this.effectsCanvas = effects.nativeElement;
    this.tmpCanvas = tmp.nativeElement;

    this.effectsCtx = this.effectsCanvas.getContext("2d", { alpha: true });
    this.tmpCtx = this.tmpCanvas.getContext("2d", { alpha: true });

    this.engine = new BABYLON.Engine(this.canvas, true, { stencil: true });

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.registerBeforeRender(this.beforeRender);

    this.setGlowLayer(1.0);
    this.glowLayer.isEnabled = false;

    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    this.highlightLayer = new BABYLON.HighlightLayer('hl1', this.scene);

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
    this.scene.activeCamera = this.camera1;

    this.camera1.speed = 1;

    ////// CAMERA 2 is rendered to a target texture 
    //// this.camera2Material;
    //// this.renderTargetTexture

    this.camera2 = new BABYLON.ArcRotateCamera('ArcRotateCam2', Math.PI / 2, Math.PI / 2, 1000, new BABYLON.Vector3(0, 0, 0), this.scene);

    this.renderTargetTexture = new BABYLON.RenderTargetTexture(
      'render to texture', // name 
      4096, // texture size
      this.scene // the scene
    );
    this.renderTargetTexture.activeCamera = this.camera2;
    this.renderTargetTexture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);

    this.scene.customRenderTargets.push(this.renderTargetTexture); // add RTT to the scene

    this.camera2Material = new BABYLON.StandardMaterial('mat', this.scene);
    this.camera2Material.diffuseTexture = this.renderTargetTexture;

    // var txplane = BABYLON.Mesh.CreatePlane("txplane", 1, this.scene);
    // txplane.position.z = 3;
    // txplane.position.y = -0.7;
    // txplane.parent = this.camera1;
    // txplane.material = this.camera2Material;


    // var parameters = {
    //   chromatic_aberration: 0.0,  //1.0,
    //   edge_blur: 0, // 1.0,
    //   distortion: .5, // 1.0,
    //   grain_amount: 0.5,
    //   dof_focus_distance: 100,  // 2000,
    //   dof_aperture: 10, // 1,
    //   dof_darken: .1, // 0,
    //   dof_pentagon: true,
    //   dof_gain: 1,
    //   dof_threshold: 1,
    //   blur_noise: true
    //   // etc.
    // };

    // var lensEffect = new BABYLON.LensRenderingPipeline('lensEffects', parameters, this.scene, 1.0, this.scene.cameras);


    //////   LIGHTING   //////

    this.lightParent = new BABYLON.TransformNode('lightParent', this.scene);


    // right
    this.hLight1Mimic = new BABYLON.TransformNode('light1Mimic', this.scene);
    this.hLight1Mimic.setParent(this.lightParent);
    this.hLight1Mimic.position = new BABYLON.Vector3(1, 0, 0);

    this.hLight1 = new BABYLON.HemisphericLight('hLight1', new BABYLON.Vector3(1, 0, 0), this.scene);
    this.hLight1.intensity = 0;
    this.hLight1.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight1.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight1.groundColor = new BABYLON.Color3(0, 0, 0);


    // down
    this.hLight2Mimic = new BABYLON.TransformNode('light5Mimic', this.scene);
    this.hLight2Mimic.setParent(this.lightParent);
    this.hLight2Mimic.position = new BABYLON.Vector3(0, 1, 0);

    this.hLight2 = new BABYLON.HemisphericLight('hLight2', new BABYLON.Vector3(0, 1, 0), this.scene);
    this.hLight2.intensity = 0;
    this.hLight2.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight2.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight2.groundColor = new BABYLON.Color3(0, 0, 0);

    // front
    this.hLight3Mimic = new BABYLON.TransformNode('light3Mimic', this.scene);
    this.hLight3Mimic.setParent(this.lightParent);
    this.hLight3Mimic.position = new BABYLON.Vector3(0, 0, -1);

    this.hLight3 = new BABYLON.HemisphericLight('hLight3', new BABYLON.Vector3(0, 0, -1), this.scene);
    this.hLight3.intensity = 0;
    this.hLight3.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight3.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight3.groundColor = new BABYLON.Color3(0, 0, 0);

    // camera
    this.hLight4 = new BABYLON.HemisphericLight('hLight4', new BABYLON.Vector3(0, 0, -1), this.scene);
    this.hLight4.intensity = 0;
    this.hLight4.diffuse = new BABYLON.Color3(0, 0, 0);
    this.hLight4.specular = new BABYLON.Color3(0, 0, 0);
    this.hLight4.groundColor = new BABYLON.Color3(0, 0, 0);

    // left


    this.hLight5 = new BABYLON.HemisphericLight('hLight5', new BABYLON.Vector3(-1, 0, 0), this.scene);
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

    // back
    this.hLight7 = new BABYLON.HemisphericLight('hLight7', new BABYLON.Vector3(0, 0, 1), this.scene);
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

    this.axisParent = new BABYLON.TransformNode('axisParent', this.scene);

    this.buildWorldAxis(600);

    if (this.optionsService.newBaseOptions.general.showAxis === true) {
      this.showWorldAxis();
    } else {
      this.hideWorldAxis();
    }



    //////    SCENE INITIALIZATIONS    //////

    // this.scene.createDefaultEnvironment();


    // tslint:disable-next-line: max-line-length
    this.currentVisual = new this.visualClasses[this.visualClassIndex](this.scene, this.audioService, this.optionsService, this.messageService, this, this.colorsService);
    this.currentVisual.create();

    this.createHexObj();

    this.Writer = new MESHWRITER(this.scene, { scale: 10 });

    // console.log('in create scene');
    // console.log('this.visualClassIndex');
    // console.log(this.visualClassIndex);


    // const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 100}, this.scene);
    // sphere.position.y = 50;

    // let testMat = new BABYLON.StandardMaterial("test",this.scene);
    // testMat.maxSimultaneousLights = 8;

    // sphere.material = testMat;


    // this.titleMat = new BABYLON.StandardMaterial('titleMat', this.scene);
    // this.titleMat.alpha = 1;
    // this.titleMat.specularColor = new BABYLON.Color3(0, 0, 0);
    // this.titleMat.emissiveColor = new BABYLON.Color3(0, 0, 0);
    // this.titleMat.diffuseColor = new BABYLON.Color3(1, 1, 1);

    // this.createTitleText('Have Yourself a Merry Little Christmas');

    // console.log(this.scene.cameras[0].alpha);

    // this.effectsCtx = this.effectsCanvas.getContext("2d");
    // this.tmpCtx = this.tmpCanvas.getContext("2d");
    // this.tmpCtx.globalAlpha = .99;
    // this.effectsCtx.globalAlpha = .99;

    // this.effectsCtx.translate(-this.effectsCanvas.width * .11/2, -this.effectsCanvas.height *.11/2);
    // this.effectsCtx.scale(1.11, 1.11);

    //  this.effectsCtx.fillStyle = "red";
    //  this.effectsCtx.fillRect(10, 10, 500, 500);

  }

  public setCameraLightVectors(): void {

    // TO DO: only set normal light vectors if rotation has changed
    const l1Position = BABYLON.Vector3.TransformCoordinates(this.hLight1Mimic.position, this.hLight1Mimic.getWorldMatrix());
    const l2Position = BABYLON.Vector3.TransformCoordinates(this.hLight2Mimic.position, this.hLight2Mimic.getWorldMatrix());
    const l3Position = BABYLON.Vector3.TransformCoordinates(this.hLight3Mimic.position, this.hLight3Mimic.getWorldMatrix());


    (this.scene.lights[0] as BABYLON.HemisphericLight).direction.x = l1Position.x;
    (this.scene.lights[0] as BABYLON.HemisphericLight).direction.y = l1Position.y;
    (this.scene.lights[0] as BABYLON.HemisphericLight).direction.z = l1Position.z;

    (this.scene.lights[4] as BABYLON.HemisphericLight).direction.x = -l1Position.x;
    (this.scene.lights[4] as BABYLON.HemisphericLight).direction.y = -l1Position.y;
    (this.scene.lights[4] as BABYLON.HemisphericLight).direction.z = -l1Position.z;


    (this.scene.lights[1] as BABYLON.HemisphericLight).direction.x = l2Position.x;
    (this.scene.lights[1] as BABYLON.HemisphericLight).direction.y = l2Position.y;
    (this.scene.lights[1] as BABYLON.HemisphericLight).direction.z = l2Position.z;

    (this.scene.lights[5] as BABYLON.HemisphericLight).direction.x = -l2Position.x;
    (this.scene.lights[5] as BABYLON.HemisphericLight).direction.y = -l2Position.y;
    (this.scene.lights[5] as BABYLON.HemisphericLight).direction.z = -l2Position.z;


    (this.scene.lights[2] as BABYLON.HemisphericLight).direction.x = l3Position.x;
    (this.scene.lights[2] as BABYLON.HemisphericLight).direction.y = l3Position.y;
    (this.scene.lights[2] as BABYLON.HemisphericLight).direction.z = l3Position.z;

    (this.scene.lights[6] as BABYLON.HemisphericLight).direction.x = -l3Position.x;
    (this.scene.lights[6] as BABYLON.HemisphericLight).direction.y = -l3Position.y;
    (this.scene.lights[6] as BABYLON.HemisphericLight).direction.z = -l3Position.z;



    (this.scene.lights[3] as BABYLON.HemisphericLight).direction.x = this.camera1.position.x;
    (this.scene.lights[3] as BABYLON.HemisphericLight).direction.y = this.camera1.position.y;
    (this.scene.lights[3] as BABYLON.HemisphericLight).direction.z = this.camera1.position.z;

    (this.scene.lights[7] as BABYLON.HemisphericLight).direction.x = -this.camera1.position.x;
    (this.scene.lights[7] as BABYLON.HemisphericLight).direction.y = -this.camera1.position.y;
    (this.scene.lights[7] as BABYLON.HemisphericLight).direction.z = -this.camera1.position.z;
  }

  public setLights(): void {

    for (let index = 0; index < 8; index++) {
      this.scene.lights[index].intensity = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].light[index].intensity.value / 100;
      this.scene.lights[index].diffuse = BABYLON.Color3.FromHexString(this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].light[index].color.value);
      this.scene.lights[index].specular = BABYLON.Color3.FromHexString(this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].light[index].specular.value);
      (this.scene.lights[index] as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].light[index].groundColor.value);

    }

  }

  public animate(): void {
    // console.log('starting animate');
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


        // var effectsCtx = this.effectsCanvas.getContext("2d");
        // var tmpCtx = this.tmpCanvas.getContext("2d");

        // tmpCtx.save();
        // effectsCtx.save();

        // // clear Tmp
        // tmpCtx.clearRect(0,0,5000,5000);

        // // Effects to Tmp
        // tmpCtx.drawImage(this.effectsCanvas, 0, 0);

        // // clear effects
        // effectsCtx.clearRect(0,0,5000,5000);

        // effectsCtx.translate(-this.effectsCanvas.width * .1/2, -this.effectsCanvas.height *.1/2);
        // effectsCtx.scale(1.1, 1.1);

        // //  tmp to effects
        // effectsCtx.drawImage(this.tmpCanvas, 0, 0);

        // effectsCtx.drawImage(this.canvas, 0, 0);
        // effectsCtx.restore();

        // tmpCtx.restore();

        // this.effectsCtx.fillStyle = "red";
        // this.effectsCtx.fillRect(10, 10, 500, 500);




        /////////////////

        // let imageData = this.effectsCtx.getImageData(0, 0, this.effectsCanvas.width, this.effectsCanvas.height);

        // // this.tmpCtx.save();
        // // this.effectsCtx.save();
        // // this.effectsCtx.clearRect(0,0,5000,5000);
        // this.effectsCtx.translate(-this.effectsCanvas.width * .1/2, -this.effectsCanvas.height *.1/2);
        // // this.effectsCtx.scale(1.2, 1.2);
        // // clear Tmp
        // // this.tmpCtx.clearRect(0,0,5000,5000);
        // // this.tmpCtx.globalAlpha = .98;
        // // Effects to Tmp
        // // this.effectsCtx.putImageData(imageData, 0, 0);
        // this.effectsCtx.scale(1.1, 1.1);

        // // clear effects
        // // this.effectsCtx.rotate(.05);  // increasing lowers termination point and adds more loops
        // // this.effectsCtx.translate(0, -80);   // increasing y lowers termination point 
        // //  tmp to effects
        // // this.effectsCtx.drawImage(this.tmpCanvas, 0, 0);
        // this.effectsCtx.drawImage(this.canvas, 0, 0);
        // // this.effectsCtx.restore();
        // // this.effectsCtx.translate(this.effectsCanvas.width / 2, -this.effectsCanvas.height / 2);
        // // this.tmpCtx.restore();

        // this.effectsCtx.translate(-this.effectsCanvas.width * .2/2, -this.effectsCanvas.height *.2/2);

        // this.effectsCtx.scale(1.2, 1.2);
        // this.effectsCtx.drawImage(this.canvas, 0, 0);


        ////////////////////




        // // this.tmpCtx.save();
        // this.effectsCtx.save();

        // this.tmpCtx.clearRect(0,0,5000,5000);
        // this.tmpCtx.globalAlpha = .98;
        // this.tmpCtx.drawImage(this.effectsCanvas, 0, 0);

        // this.effectsCtx.clearRect(0,0,5000,5000);
        // this.effectsCtx.translate(-this.effectsCanvas.width / 2, this.effectsCanvas.height / 2);
        // this.effectsCtx.rotate(.05);  // increasing lowers termination point and adds more loops
        // this.effectsCtx.translate(this.effectsCanvas.width / 2, -this.effectsCanvas.height / 2);
        // this.effectsCtx.scale(.95, .95);
        // this.effectsCtx.translate(10, -80);   // increasing y lowers termination point 

        // this.effectsCtx.drawImage(this.tmpCanvas, 0, 0);
        // this.effectsCtx.restore();
        // this.effectsCtx.drawImage(this.canvas, 0, 0);
        // // this.tmpCtx.restore();




        // this.tmpCtx.globalAlpha = .99;
        // this.effectsCtx.globalAlpha = .99;
        // this.effectsCtx.translate(-this.effectsCanvas.width * .11/2, -this.effectsCanvas.height *.11/2);
        // this.effectsCtx.scale(1.11, 1.11);

        // this.tmpCtx.save();
        // this.effectsCtx.save();


        // clear Tmp
        // this.tmpCtx.clearRect(0,0,5000,5000);

        // let data;
        // // Set translation and scale
        // this.tmpCtx.translate(-this.effectsCanvas.width * .11/2, -this.effectsCanvas.height *.11/2);
        // this.tmpCtx.scale(1.11, 1.11);

        // // Old historical Effects to Tmp w/ a scaling
        // this.tmpCtx.drawImage(this.effectsCanvas, 0, 0);        
        // this.effectsCtx.drawImage(this.tmpCanvas, 0, 0);
        // this.effectsCtx.drawImage(this.canvas, 0, 0);


        // 3d Canvas image to Tmp

        // effectsCtx.clearRect(0,0,5000,5000);



        // this.tmpCtx.globalAlpha = .98;
        // clear effects
        // effectsCtx.rotate(.05);  // increasing lowers termination point and adds more loops
        // effectsCtx.translate(10, -80);   // increasing y lowers termination point 
        //  tmp to effects
        // effectsCtx.drawImage(this.canvas, 0, 0);
        // effectsCtx.restore();
        // effectsCtx.translate(this.effectsCanvas.width / 2, -this.effectsCanvas.height / 2);
        // this.tmpCtx.restore();



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

  selectVisual(index: number): void {
    // console.log('in selectVisual');
    // this.saveCamera();

    this.currentVisual.remove();

    this.currentVisual = null;

    this.visualClassIndex = index;
    // tslint:disable-next-line: max-line-length
    this.currentVisual = new this.visualClasses[index](this.scene, this.audioService, this.optionsService, this.messageService, this, this.colorsService);
    this.currentVisual.create();
    this.setLights();



  }

  fixDpi = ():void => {
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


    const styles2 = window.getComputedStyle(this.effectsCanvas);
    const style2 = {
      height() {
        return +styles2.height.slice(0, -2);
      },
      width() {
        return +styles2.width.slice(0, -2);
      }
    };

    this.effectsCanvas.setAttribute('width', (style2.width() * dpi).toString());
    this.effectsCanvas.setAttribute('height', (style2.height() * dpi).toString());


    const styles3 = window.getComputedStyle(this.tmpCanvas);
    const style3 = {
      height() {
        return +styles3.height.slice(0, -2);
      },
      width() {
        return +styles3.width.slice(0, -2);
      }
    };

    this.tmpCanvas.setAttribute('width', (style3.width() * dpi).toString());
    this.tmpCanvas.setAttribute('height', (style3.height() * dpi).toString());
  }

  makeTextPlane = (text: string, color: string, textSize: number): BABYLON.Mesh => {
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

  buildWorldAxis = (size: number): void => {

    const axisX = BABYLON.Mesh.CreateLines('axisX', [
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
    ], this.scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    const xChar = this.makeTextPlane('X', 'red', size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    axisX.parent = this.axisParent;
    xChar.parent = this.axisParent;

    const axisY = BABYLON.Mesh.CreateLines('axisY', [
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
      new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
    ], this.scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    const yChar = this.makeTextPlane('Y', 'green', size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    axisY.parent = this.axisParent;
    yChar.parent = this.axisParent;

    const axisZ = BABYLON.Mesh.CreateLines('axisZ', [
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
      new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
    ], this.scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    const zChar = this.makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    axisZ.parent = this.axisParent;
    zChar.parent = this.axisParent;


    for (let index = -1000; index <= 1000; index += 100) {
      const hexX100 = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 1, tessellation: 6, height: 100 }, this.scene);
      hexX100.position = new BABYLON.Vector3(index, 0, 0);
      hexX100.parent = this.axisParent;

      const hexZ100 = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 1, tessellation: 6, height: 100 }, this.scene);
      hexZ100.position = new BABYLON.Vector3(0, 0, index);
      hexZ100.parent = this.axisParent;

    }
  }

  showWorldAxis = (): void => {
    this.axisParent.setEnabled(true);
  }

  hideWorldAxis = (): void => {
    this.axisParent.setEnabled(false);
  }

  createHexObj():void {

    this.hexParent = new BABYLON.TransformNode('root');

    let x: number;
    let x2: number;
    let z: number;

    this.hexMat = new BABYLON.StandardMaterial(`material`, this.scene);
    this.hexMat.bumpTexture = new BABYLON.Texture('../../assets/mats/normal2.jpg', this.scene);
    this.hexMat.bumpTexture.uScale = 4;
    this.hexMat.bumpTexture.vScale = 4;
    this.hexMat.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse2.jpg', this.scene);
    this.hexMat.diffuseTexture.uScale = 4;
    this.hexMat.diffuseTexture.vScale = 4;
    this.hexMat.maxSimultaneousLights = 8;

    const groundMat = new BABYLON.StandardMaterial('mat1', this.scene);
    groundMat.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse2.jpg', this.scene);
    groundMat.bumpTexture = new BABYLON.Texture('../../assets/mats/normal2.jpg', this.scene);
    groundMat.backFaceCulling = false;

    (groundMat.diffuseTexture as BABYLON.Texture).uScale = 10;
    (groundMat.diffuseTexture as BABYLON.Texture).vScale = 10;
    (groundMat.bumpTexture as BABYLON.Texture).uScale = 10;
    (groundMat.bumpTexture as BABYLON.Texture).vScale = 10;

    groundMat.freeze();

    // BUILD SPS ////////////////////////////////

    const hex = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 38, tessellation: 6, height: 50 }, this.scene);
    hex.convertToFlatShadedMesh();

    const innerPositionFunction = (particle) => {
      particle.position.x = (x2) * 35.5;
      particle.position.y = -24.5;
      particle.position.z = (z) * 31;
      particle.color = new BABYLON.Color3(.5, .5, .5);
      particle.rotation.y = Math.PI / 6;
    };

    this.hexSPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });
    this.hexSPS.updateParticle = (particle) => {
      // let yy = this.audioService.sample1[555 - particle.idx];
      let yy = this.audioService.sample2[228 - particle.idx];
      yy = (yy / 255 * yy / 255) * 255;

      particle.color.r = this.colorsService.colors(yy).r / 255;
      particle.color.g = this.colorsService.colors(yy).g / 255;
      particle.color.b = this.colorsService.colors(yy).b / 255;

      particle.position.y = -24.5 + yy / 3;
      particle.scaling.x = .9;
      particle.scaling.z = .9;
    };

    // add hex shapes

    for (z = -15; z < 15; z++) {
      for (x = -15; x < 15; x++) {
        x2 = x;
        if (Math.abs(z) % 2 === 1) {
          x2 = x - .5;
        }
        const d = Math.sqrt((x2 * x2) + (z * z));
        // if (d <= 13.3) {
          if (d <= 8.5) {
            this.hexSPS.addShape(hex, 1, { positionFunction: innerPositionFunction });
        }
      }
    }

    hex.dispose();

    this.hexMesh = this.hexSPS.buildMesh();
    
    this.hexMesh.material = this.hexMat;

    this.hexMesh.scaling.x = .8;
    this.hexMesh.scaling.y = .8;
    this.hexMesh.scaling.z = .8;

    this.hexMesh.parent = this.hexParent;
    
    // console.log('SPS.nbParticles', this.hexSPS.nbParticles);
    
    // create honeycomb ground mesh

    const spsCSG = BABYLON.CSG.FromMesh(this.hexMesh);

    const groundBox = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 600, tessellation: 6, height: 48 }, this.scene);
    groundBox.position.y = -24;

    const groundCSG = BABYLON.CSG.FromMesh(groundBox);
    groundBox.dispose();

    const holyGroundCSG = groundCSG.subtract(spsCSG);

    this.finalHexGround = holyGroundCSG.toMesh('ground', this.groundMat, this.scene, true);
    this.finalHexGround.position.y = -19;

    this.finalHexGround.material = groundMat;
    this.finalHexGround.parent = this.hexParent;



    //  Create a sheath cover for easier material mapping 

    (() => {

      this.groundMatCover = new BABYLON.StandardMaterial('mat1', this.scene);
      this.groundMatCover.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse1.jpg', this.scene);
      this.groundMatCover.bumpTexture = new BABYLON.Texture('../../assets/mats/normal1.jpg', this.scene);
      this.groundMatCover.backFaceCulling = false;

      (this.groundMatCover.diffuseTexture as BABYLON.Texture).vScale = 2;
      (this.groundMatCover.bumpTexture as BABYLON.Texture).vScale = 2;
      (this.groundMatCover.diffuseTexture as BABYLON.Texture).uScale = 100;
      (this.groundMatCover.bumpTexture as BABYLON.Texture).uScale = 100;

      this.groundMatCover.freeze();

      const path = [];
      const segLength = 100;
      const numSides = 6;

      for (let i = -1; i <= 0; i++) {
        const xx = (i / 2) * segLength;
        const yy = 0;
        const zz = 0;
        path.push(new BABYLON.Vector3(xx, yy, zz));
      }

      this.groundCover = BABYLON.Mesh.CreateTube('tube', path, 301, numSides, null, 0, this.scene);
      this.groundCover.rotation.z = Math.PI / 2;
      this.groundCover.rotation.y = Math.PI / 6;

      this.groundCover.material = this.groundMatCover;
      this.groundCover.convertToFlatShadedMesh();
      this.groundCover.position.y = 6;

      this.groundCover.parent = this.hexParent;

    })();


    // Draw gold tubes around seams

    (() => {

      this.tubeMat = new BABYLON.StandardMaterial('mat1', this.scene);
      this.tubeMat.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse3.jpg', this.scene);
      this.tubeMat.bumpTexture = new BABYLON.Texture('../../assets/mats/normal3.jpg', this.scene);
      (this.tubeMat.diffuseTexture as BABYLON.Texture).uScale = 50;

      this.tubeMat.freeze();

      this.tube1 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 600, thickness: 13, tessellation: 6 }, this.scene);
      this.tube1.position.y = 7.5;
      this.tube1.parent = this.hexParent;
      this.tube1.scaling.y = .5;
      this.tube1.material = this.tubeMat;
      this.tube1.rotation.y = Math.PI / 6;

      this.tube2 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 600, thickness: 13, tessellation: 6 }, this.scene);
      this.tube2.position.y = -48;
      this.tube2.parent = this.hexParent;
      this.tube2.material = this.tubeMat;
      this.tube2.rotation.y = Math.PI / 6;

      this.hexParent.rotation.y = Math.PI;
      
    })();
    
    this.hexParent.setEnabled(false);



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

  }

  createTitleText(text: string): void {
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


    // console.log('this.titleSPS');
    // console.log(this.titleSPS);
    // console.log('this.titleText');
    // console.log(this.titleText);

    this.titleText.getMesh().parent = this.camera1;
    // this.titleSPS.parent = this.camera1;

  }

  beforeRender = (): void => {
    // this.titleSPS.setParticles();
  }

  create3DText(displayText: string, scale: number, depth: number, xPos: number, yPos: number, zPos: number, color: BABYLON.Color3): BABYLON.Mesh {
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

    const textSPS = text1.getSPS();
    // console.log('textSPS');
    // console.log(textSPS);
    textSPS.particles[1].position.y = 500;

    // console.log('text1');
    // console.log(text1);

    return text1;
  }

}
