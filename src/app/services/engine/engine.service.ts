import { WindowRefService } from '../window-ref/window-ref.service';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { MessageService } from '../message/message.service';

import {
  Engine,
  FreeCamera,
  Scene,
  Light,
  Mesh,
  Color3,
  Color4,
  Vector3,
  HemisphericLight,
  StandardMaterial,
  Texture,
  DynamicTexture
} from 'babylonjs';
import 'babylonjs-materials';

@Injectable({ providedIn: 'root' })
export class EngineService {
  private canvas: HTMLCanvasElement;
  private engine: Engine;
  private camera: FreeCamera;
  private scene: Scene;
  private light: Light;

  private sphere: Mesh;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    public messageService: MessageService
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
    this.engine = new Engine(this.canvas, true);

    // create a basic BJS Scene object
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0, 0, 0, 0);

    // create a FreeCamera, and set its position to (x:5, y:10, z:-20 )
    this.camera = new FreeCamera('camera1', new Vector3(5, 10, -20), this.scene);

    // target the camera to scene origin
    this.camera.setTarget(Vector3.Zero());

    // attach the camera to the canvas
    this.camera.attachControl(this.canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);

    // create a built-in "sphere" shape; its constructor takes 4 params: name, subdivisions, radius, scene
    this.sphere = Mesh.CreateSphere('sphere1', 16, 2, this.scene);

    // create the material with its texture for the sphere and assign it to the sphere
    const spherMaterial = new StandardMaterial('sun_surface', this.scene);
    spherMaterial.diffuseTexture = new Texture('assets/textures/sun.jpg', this.scene);
    this.sphere.material = spherMaterial;

    // move the sphere upward 1/2 of its height
    this.sphere.position.y = 1;

    // simple rotation along the y axis
    this.scene.registerAfterRender(() => {
      this.sphere.rotate(
        new Vector3(0, 1, 0),
        0.02,
        BABYLON.Space.LOCAL
      );
    });

  }


  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {

        // fix for canvas stretching
        this.canvas.width = +window.getComputedStyle(this.canvas).width.slice(0, -2);

        this.scene.render();
      };

      if (this.windowRef.document.readyState !== 'loading') {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        this.windowRef.window.addEventListener('DOMContentLoaded', () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }

      // this.windowRef.window.addEventListener('resize', () => {
      //   this.engine.resize();
      // });
    });
  }



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
