import { WindowRefService } from '../window-ref/window-ref.service';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { MessageService } from '../message/message.service';
import { AudioService } from '../audio/audio.service';

import * as BABYLON from 'babylonjs';
import 'babylonjs-materials';

import { BlockPlaneManager } from '../../visualization-classes/BlockPlaneManager';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: BABYLON.Engine;
  private camera: BABYLON.ArcRotateCamera;
  private scene: BABYLON.Scene;
  private light: BABYLON.Light;
  private objects = [];

  bpm;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    public messageService: MessageService,
    public audioService: AudioService,
  ) {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.engine.resize();
    });

  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);

    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    this.camera = new BABYLON.ArcRotateCamera('camera1', 4.7, 1.1, 1600, new BABYLON.Vector3(0, 0, 0), this.scene);
    this.camera.upperRadiusLimit = 9400;
    this.camera.lowerRadiusLimit = 10;
    this.camera.attachControl(this.canvas, true);

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

    this.bpm = new BlockPlaneManager(this.scene, this.audioService);
    this.bpm.create();

    // const width = 30;
    // const depth = 60;

    // for (let z = 8; z >= 0; z--) {
    //   for (let x = 0; x < 64; x++) { // 9 * 64 = 576

    //     const thing = BABYLON.MeshBuilder.CreateBox(('box'), {
    //       width: width,
    //       depth: depth
    //     }, this.scene);

    //     // let thing = master.clone("clone");

    //     thing.position.x = (x - 31.5) * 30;
    //     thing.position.z = (z - 5) * 60;
    //     thing.position.y = 0;

    //     thing.doNotSyncBoundingInfo = true;
    //     thing.convertToUnIndexedMesh();

    //     // thing.parent = this.master;

    //     const r = 0;
    //     const g = 0.1;
    //     const b = 0.0;

    //     const color = new BABYLON.Color3(r, g, b);

    //     const mat = new BABYLON.StandardMaterial("mat", this.scene);
    //     mat.diffuseColor = color;
    //     mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
    //     mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
    //     mat.backFaceCulling = true;
    //     mat.alpha = 1;

    //     thing.material = mat;

    //     this.objects.push(thing);
    //   }
    // }

    // master.dispose();

  }


  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {

        // fix for canvas stretching
        this.canvas.width = +window.getComputedStyle(this.canvas).width.slice(0, -2);
        this.bpm.update();
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

  // update() {
  //   this.objects.forEach((o, i) => {
  //     let yy = this.audioService.sample1[i];
  //     yy = (yy / 200 * yy / 200) * 255;
  //     o.scaling.y = yy * .5 + .01;

  //     const r = yy; // * .8;
  //     const b = 200 - yy * 2;
  //     const g = 128 - yy / 2;

  //     o.position.y = o.scaling.y / 2;

  //     o.material.diffuseColor.r = r / 255;
  //     o.material.diffuseColor.g = g / 255;
  //     o.material.diffuseColor.b = b / 255;

  //   });
  // }

  resizeCanvas = () => {
    this.canvas.width = +window.getComputedStyle(this.canvas).width.slice(0, -2);
  }

  public setupCamera = (camera) => {
    camera.orthoBottom = this.scene.getEngine().getRenderHeight();
    camera.orthoTop = 0;
    camera.orthoLeft = 0;
    camera.orthoRight = this.scene.getEngine().getRenderWidth();
  }
}
