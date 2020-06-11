
import { WindowRefService } from '../window-ref/window-ref.service';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import * as BABYLON from 'babylonjs';
import 'babylonjs-materials';

import { MessageService } from '../message/message.service';
import { AudioService } from '../audio/audio.service';
import { OptionsService } from '../options/options.service';

import { BlockPlaneManager } from '../../visualization-classes/BlockPlaneManager';
import { SpherePlaneManagerSPS } from '../../visualization-classes/SpherePlaneManagerSPS';
import { EquationManager } from '../../visualization-classes/EquationManager';
import { CubeManager } from '../../visualization-classes/CubeManager';
import { BlockSpiralManager } from '../../visualization-classes/BlockSpiralManager';
import { StarManager } from '../../visualization-classes/StarManager';
import { Spectrograph } from '../../visualization-classes/Spectrograph';
import { Rings } from '../../visualization-classes/Rings';
import { Hills } from '../../visualization-classes/Hills';
import { Hex } from '../../visualization-classes/Hex';
import { WaveRibbon } from '../../visualization-classes/WaveRibbon';


@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;
  private managerClasses;
  private managerClassIndex;
  private currentManager;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  private showAxis = false;

  glowLayer;
  highlightLayer;
  subscription;
  hexMesh;
  hexSPS;
  finalHexGround;
  hexMat;
  groundMat;
  hexParent;
  groundCover;
  // groundParent;
  tube1;
  tube2;
  matGroundCover;
  tubeMat;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    public messageService: MessageService,
    public audioService: AudioService,
    public optionsService: OptionsService
  ) {

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.engine.resize();

    });

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        // console.log('Engine: Message received from service is :  ' + message);

        this.selectScene(this.optionsService.currentVisual);
      });

    // this.managerClassIndex = this.optionsService.getOptions().currentVisual.value;
    this.managerClassIndex = this.optionsService.currentVisual;
    this.managerClasses = [
      BlockPlaneManager,
      BlockSpiralManager,
      EquationManager,
      CubeManager,
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
    // this.engine = new BABYLON.Engine(this.canvas, true);
    this.engine = new BABYLON.Engine(this.canvas, true, { stencil: true });

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    this.scene.ambientColor = new BABYLON.Color3(.5, .5, .5);

    this.highlightLayer = new BABYLON.HighlightLayer('hl1', this.scene);

    this.glowLayer = new BABYLON.GlowLayer('glow', this.scene);
    this.glowLayer.intensity = 1;

    if (this.showAxis) {
      this.showWorldAxis(150);
    }

    this.createHexObj();

    this.camera = new BABYLON.ArcRotateCamera('camera1', 4.7, 1.1, 1600, new BABYLON.Vector3(0, 0, 0), this.scene);
    this.camera.upperRadiusLimit = 9400;
    this.camera.lowerRadiusLimit = 10;
    this.camera.attachControl(this.canvas, true);
    this.camera.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;

    const pointLight1 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(500, 500, -600), this.scene);
    // pointLight1.intensity = .8;

    const pointLight2 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(-500, -500, 600), this.scene);
    pointLight2.intensity = 1.3;

    const pointLight3 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 500, 0), this.scene);
    // pointLight3.intensity = 1.8;

    const pointLight4 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(800, 480, -280), this.scene);
    pointLight4.intensity = .75;

    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, -1, 0), this.scene);
    // light.intensity = 1.5;
    // tslint:disable-next-line: max-line-length
    this.currentManager = new this.managerClasses[this.managerClassIndex](this.scene, this.audioService, this.optionsService, this.messageService);
    this.currentManager.create();
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {

        this.optionsService.colorTime += this.optionsService.colorTimeInc;

        if (this.optionsService.colorTime >= 1) {
          this.optionsService.colorTime = 1;
          this.optionsService.colorTimeInc *= -1;
          this.optionsService.startingColorSet = Math.floor(Math.random() * 11);
        }

        if (this.optionsService.colorTime <= 0) {
          this.optionsService.colorTime = 0;
          this.optionsService.colorTimeInc *= -1;
          this.optionsService.endingColorSet = Math.floor(Math.random() * 11);
        }

        this.resizeCanvas();
        this.currentManager.update();
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

  resizeCanvas = () => {
    this.canvas.width = +window.getComputedStyle(this.canvas).width.slice(0, -2);
  }

  saveCamera() {

    this.optionsService.options[this.optionsService.visuals[this.managerClassIndex]].calpha
    = (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha;

    this.optionsService.options[this.optionsService.visuals[this.managerClassIndex]].cbeta
    = (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta;

    this.optionsService.options[this.optionsService.visuals[this.managerClassIndex]].cradius
    = (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius;

  }

  selectScene(index) {
    if (this.managerClassIndex === index) {
      return;
    }

    this.saveCamera();

    if (this.currentManager) {
      this.currentManager.remove();
    }


    this.currentManager = null;
    // this.scene.materials.forEach(m => {
    //   m.dispose(true, true, true);
    // });

    this.managerClassIndex = index;
    this.currentManager = new this.managerClasses[index](this.scene, this.audioService, this.optionsService, this.messageService, this);
    this.currentManager.create();

    (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha =
    this.optionsService.options[this.optionsService.visuals[index]].calpha;

    (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta =
    this.optionsService.options[this.optionsService.visuals[index]].cbeta;

    (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius =
    this.optionsService.options[this.optionsService.visuals[index]].cradius;
    // console.log((this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha);
    // console.log(this.optionsService.options[this.optionsService.visuals[index]].calpha);
  }

  fixDpi = () => {
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

    // this.groundMat = new BABYLON.StandardMaterial("mat1", this.scene);
    // this.groundMat.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse1.tga', this.scene);
    // this.groundMat.bumpTexture = new BABYLON.Texture('../../assets/mats/normal1.tga', this.scene);
    // this.groundMat.diffuseTexture.vScale = 2;
    // this.groundMat.bumpTexture.vScale = 2;
    // this.groundMat.diffuseTexture.uScale = 100;
    // this.groundMat.bumpTexture.uScale = 100;

    // this.groundMat = new BABYLON.StandardMaterial(`groundMat`, this.scene);

    this.hexMat = new BABYLON.StandardMaterial(`material`, this.scene);
    this.hexMat.bumpTexture = new BABYLON.Texture('../../assets/images/normal8.jpg', this.scene);
    this.hexMat.bumpTexture.uScale = 5;
    this.hexMat.bumpTexture.vScale = 5;

    // const groundBox = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 750, tessellation: 88, height: 48 }, this.scene);
    const groundBox = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 880, tessellation: 6, height: 48 }, this.scene);
    groundBox.position.y = -24;
    // groundBox.scaling.x = 1.13;
    const groundCSG = BABYLON.CSG.FromMesh(groundBox);
    // groundBox.dispose();

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
    // this.engineService.highlightLayer.addMesh(hex, BABYLON.Color3.Green());

    for (z = -15; z < 15; z++) {
      for (x = -15; x < 15; x++) {
        x2 = x;
        if (Math.abs(z) % 2 === 1) {
          x2 = x - .5;
          // console.log(i);
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
    // this.finalHexGround.convertToFlatShadedMesh();

    // this.finalHexGround.material = this.groundMat;

    // this.finalHexGround.setEnabled(false);
    // this.hexMesh.setEnabled(false);

    hex.dispose();

    this.hexSPS.updateParticle = (particle) => {
      let yy = this.audioService.getSample()[555 - particle.idx];
      yy = (yy / 255 * yy / 255) * 255;

      particle.color.r = this.optionsService.colors(yy).r / 255;
      particle.color.g = this.optionsService.colors(yy).g / 255;
      particle.color.b = this.optionsService.colors(yy).b / 255;

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
    // matGround.diffuseTexture.vScale = 2;
    // matGround.bumpTexture.vScale = 2;
    (matGround.diffuseTexture as BABYLON.Texture).uScale = 10;
    (matGround.diffuseTexture as BABYLON.Texture).vScale = 10;
    (matGround.bumpTexture as BABYLON.Texture).uScale = 10;
    (matGround.bumpTexture as BABYLON.Texture).vScale = 10;

    this.finalHexGround.material = matGround;
    this.finalHexGround.parent = this.hexParent;

    const path = [];
    const segLength = 100;
    // const numSides = 44;
    const numSides = 6;

    const mat = new BABYLON.StandardMaterial('mat1', this.scene);
    mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    mat.backFaceCulling = false;

    for (let i = -1; i <= 0; i++) {
        let xx = (i / 2) * segLength;
        const yy = 0;
        const zz = 0;
        path.push(new BABYLON.Vector3(xx, yy, zz));
    }

    // this.groundCover = BABYLON.Mesh.CreateTube('tube', path, 378, numSides, null, 0, this.scene);
    this.groundCover = BABYLON.Mesh.CreateTube('tube', path, 441, numSides, null, 0, this.scene);
    this.groundCover.rotation.z = Math.PI / 2;
    this.groundCover.rotation.y = Math.PI / 6;
    
    this.groundCover.material = this.matGroundCover;
    this.groundCover.convertToFlatShadedMesh();
    // this.groundCover.scaling.y = 1.13;
    this.groundCover.position.y = 6;

    this.groundCover.parent = this.hexParent;

    this.tubeMat = new BABYLON.StandardMaterial('mat1', this.scene);
    this.tubeMat.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse3.jpg', this.scene);
    this.tubeMat.bumpTexture = new BABYLON.Texture('../../assets/mats/normal3.jpg', this.scene);
    // this.tubeMat.diffuseTexture.vScale = 50;
    (this.tubeMat.diffuseTexture as BABYLON.Texture).uScale = 50;
    // this.tubeMat.bumpTexture.vScale = 2;
    // this.tubeMat.bumpTexture.uScale = 100;

    // this.tube1 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 750, thickness: 13, tessellation: 44 }, this.scene);
    this.tube1 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 880, thickness: 13, tessellation: 6 }, this.scene);
    this.tube1.material = mat;
    this.tube1.position.y = 7.5;
    this.tube1.parent = this.hexParent;
    // this.tube1.scaling.x = 1.13;
    this.tube1.scaling.y = .5;
    this.tube1.material = this.tubeMat;
    this.tube1.rotation.y = Math.PI / 6;


    // this.tube2 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 750, thickness: 13, tessellation: 44 }, this.scene);
    this.tube2 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 880, thickness: 13, tessellation: 6 }, this.scene);
    this.tube2.material = mat;
    this.tube2.position.y = -48;
    this.tube2.parent = this.hexParent;
    // this.tube2.scaling.x = 1.13;
    this.tube2.material = this.tubeMat;
    this.tube2.rotation.y = Math.PI/6;

    this.hexParent.setEnabled(false);


  }
}
