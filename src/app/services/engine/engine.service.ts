
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


@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;

  glowLayer;
  highlightLayer;

  private showAxis = false;

  private managerClasses;
  private managerClassIndex;
  private currentManager;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  subscription;

  hexMesh;
  hexSPS;
  finalHexGround;
  hexMat;
  groundMat;

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

        this.selectScene(this.optionsService.getOptions().currentVisual.value);
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
      Hex
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

  selectScene(index) {
    if (this.managerClassIndex === index) {
      return;
    }

    if (this.currentManager) {
      this.currentManager.remove();
    }

    this.currentManager = null;
    this.scene.materials.forEach(m => {
      m.dispose(true, true, true);
    });

    this.managerClassIndex = index;
    this.currentManager = new this.managerClasses[index](this.scene, this.audioService, this.optionsService, this.messageService, this);
    this.currentManager.create();

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
    let makeTextPlane = (text: string, color: string, textSize: number) => {
      let dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 50, this.scene, true);
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true);
      // @todo fix <any> - actual a hack for @types Error...
      let plane = BABYLON.Mesh.CreatePlane('TextPlane', textSize, this.scene, true);
      let material = new BABYLON.StandardMaterial('TextPlaneMaterial', this.scene);
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

    const groundBox = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 750, tessellation: 88, height: 48 }, this.scene);
    groundBox.position.y = -24;
    groundBox.scaling.x = 1.13;
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

    this.hexMesh = this.hexSPS.buildMesh();
    this.hexMesh.material = this.hexMat;
    this.hexMesh.scaling.x = .8;
    this.hexMesh.scaling.y = .8;
    this.hexMesh.scaling.z = .8;

    const spsCSG = BABYLON.CSG.FromMesh(this.hexMesh);
    const holyGroundCSG = groundCSG.subtract(spsCSG);
    this.finalHexGround = holyGroundCSG.toMesh('ground', this.groundMat, this.scene);
    this.finalHexGround.position.y = -19;
    // this.finalHexGround.convertToFlatShadedMesh();



    // this.finalHexGround.material = this.groundMat;

    this.finalHexGround.setEnabled(false);
    this.hexMesh.setEnabled(false);

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

  }
}
