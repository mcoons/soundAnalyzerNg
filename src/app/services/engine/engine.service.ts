import { WindowRefService } from '../window-ref/window-ref.service';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { MessageService } from '../message/message.service';
import { AudioService } from '../audio/audio.service';
import { OptionsService } from '../options/options.service';

import * as BABYLON from 'babylonjs';
import 'babylonjs-materials';

import { BlockPlaneManager } from '../../visualization-classes/BlockPlaneManager';
import { EquationManager } from '../../visualization-classes/EquationManager';
import { CubeManager } from '../../visualization-classes/CubeManager';
import { BlockSpiralManager } from '../../visualization-classes/BlockSpiralManager';
import { StarManager } from '../../visualization-classes/StarManager';


@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;

  glowLayer;

  private bpm: BlockPlaneManager;
  private eqm: EquationManager;
  private cbm: CubeManager;
  private bsm: BlockSpiralManager;

  private managerClasses;
  private managerClassIndex;
  private currentManager;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  // options;
  subscription;

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

      // if (this.scene.getEngine().getRenderHeight() > this.scene.getEngine().getRenderWidth()) {
      //   this.camera.fovMode = BABYLON.Camera.FOVMODE_VERTICAL_FIXED;
      // } else {
      //   this.camera.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;
      // }
    });

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        // console.log('Engine: Message received from service is :  ' + message);
        // this.options = this.optionsService.getOptions();
        // this.managerClassIndex = this.options.currentScene.value;

        this.selectScene(this.optionsService.options.currentScene.value);
      });

    // this.options = this.optionsService.getOptions();

    this.managerClassIndex = this.optionsService.options.currentScene.value;
    this.managerClasses = [
      BlockPlaneManager,
      BlockSpiralManager,
      EquationManager,
      CubeManager,
      StarManager
    ];


  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);

    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    this.glowLayer = new BABYLON.GlowLayer('glow', this.scene);
    this.glowLayer.intensity = 1;

    this.camera = new BABYLON.ArcRotateCamera('camera1', 4.7, 1.1, 1600, new BABYLON.Vector3(0, 0, 0), this.scene);
    this.camera.upperRadiusLimit = 9400;
    this.camera.lowerRadiusLimit = 10;
    this.camera.attachControl(this.canvas, true);

    this.camera.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, -1, 0), this.scene);
    light.intensity = 1.5;

    const pointLight1 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(500, 500, -600), this.scene);
    pointLight1.intensity = .8;

    const pointLight2 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(-500, -500, 600), this.scene);
    // pointLight2.intensity = 1.3;

    const pointLight3 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 500, 0), this.scene);
    // pointLight3.intensity = 1.8;

    const pointLight4 = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(500, 480, -280), this.scene);
    pointLight4.intensity = .5;

    this.currentManager = new this.managerClasses[this.managerClassIndex](this.scene, this.audioService);
    this.currentManager.create();

  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {

        // fix for canvas stretching
        // this.canvas.width = +window.getComputedStyle(this.canvas).width.slice(0, -2);
        this.resizeCanvas();

        this.currentManager.update();
        this.fixDpi();
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

  // public setupCamera = (camera) => {
  //   camera.orthoBottom = this.scene.getEngine().getRenderHeight();
  //   camera.orthoTop = 0;
  //   camera.orthoLeft = 0;
  //   camera.orthoRight = this.scene.getEngine().getRenderWidth();
  // }



  // nextScene() {
  //   this.selectScene(this.managerClassIndex >= this.managerClasses.length - 1 ? 0 : this.managerClassIndex + 1);
  // }

  selectScene(index) {
    if (this.managerClassIndex === index) {
      return;
    }

    // $("#cameraTarget").addClass("hidden");

    // this.scene.freezeActiveMeshes();

    if (this.currentManager) {
      this.currentManager.remove();
    }

    this.currentManager = null;
    this.scene.materials.forEach(m => {
      m.dispose(true, true, true);
    });

    this.managerClassIndex = index;
    this.currentManager = new this.managerClasses[this.managerClassIndex](this.scene, this.audioService);
    this.currentManager.create();
    // this.scene.freezeActiveMeshes();

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
}
