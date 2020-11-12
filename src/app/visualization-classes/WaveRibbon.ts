
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { MaterialHelper } from 'babylonjs';


export class WaveRibbon {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private ground;
    theta = 0;
    path = [];
    tubes;
    material;

    // private myColorArray = [];
    // private myVertexArray = [];

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;

        this.setDefaults();

        for (let index = 0; index < 2 * Math.PI; index += Math.PI / 32) {

            const x = 500 * Math.cos(index);
            const z = 500 * Math.sin(index);
            const y = 160 + 50 * Math.sin(4 * index);

            const v = new BABYLON.Vector3(x, y, z);

            this.path.push(v);

        }
        this.path.push(this.path[0]);
        // for (let x = 0; x < 64; x++) {
        //     const xColorArray = [];
        //     const xVertexArray = [];
        //     for (let y = 0; y < 64; y++) {
        //         xColorArray.push([1, 1, 1, 1]);
        //         xVertexArray.push([x - 32, 0, y - 32]);
        //     }
        //     this.myColorArray.push(xColorArray);
        //     this.myVertexArray.push(xVertexArray);
        // }
    }

    setDefaults() {
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.7124;
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .85;
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 10;
    }

    create() {
        this.engineService.scene.activeCamera = this.engineService.camera2;


        // this.ground = BABYLON.MeshBuilder.CreateGround('ground1',
        //     { width: 1, height: 1, subdivisionsX: 63, subdivisionsY: 63, updatable: true },
        //     this.scene); // 550


        this.material = new BABYLON.StandardMaterial('gmat', this.scene);
        this.material.backFaceCulling = false;
        // this.material.specularColor = new BABYLON.Color3(0, 0, 0); // black is no shine
        // this.material.diffuseColor = new BABYLON.Color3(.8, .8, .8); // black is no shine

        const gtexture = new BABYLON.Texture('../assets/images/normal12.jpg', this.scene);

        this.material.bumpTexture = gtexture;
        this.material.bumpTexture.uScale = 5;
        this.material.bumpTexture.vScale = 15;
        this.material.useParallax = true;
        this.material.useParallaxOcclusion = true;
        this.material.parallaxScaleBias = 0.1;
        this.material.specularPower = 100.0;  // 1000
        this.material.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        this.material.diffuseTexture = gtexture;
        this.material.diffuseTexture.uScale = 5;
        this.material.diffuseTexture.vScale = 15;
        this.material.specularTexture = gtexture;
        this.material.specularTexture.uScale = 5;
        this.material.specularTexture.vScale = 15;
        this.material.emissiveTexture = gtexture;
        this.material.emissiveTexture.uScale = 5;
        this.material.emissiveTexture.vScale = 15;
        this.material.ambientTexture = gtexture;
        this.material.ambientTexture.uScale = 5;
        this.material.ambientTexture.vScale = 15;







        // this.ground.scaling = new BABYLON.Vector3(1000, 1, 1000);

        // let x = 1000 * Math.cos(this.theta);
        // let z = 1000 * Math.sin(this.theta);
        // let y = 0;


        console.log('Path:');
        console.log(this.path);

        // tslint:disable-next-line: max-line-length
        this.tubes = BABYLON.MeshBuilder.CreateTube('lns', {path: this.path, radius: 100, radiusFunction: (i) => (20 * (Math.sin(i) + 2)), tessellation: 16, sideOrientation: 10, updatable: true}, this.scene);

        this.tubes.material = this.material;


        // var lines = BABYLON.MeshBuilder.CreateLines("lines", {points: this.path, updatable: true}, this.scene);

    }

    update() {

        this.theta = (this.theta + .003) % (2 * Math.PI);

        const x = 500 * Math.cos(this.theta);
        const z = 500 * Math.sin(this.theta);
        const y = 160 + 50 * Math.sin(4 * this.theta);

        const x2 = 500 * Math.cos(this.theta + .03);
        const z2 = 500 * Math.sin(this.theta + .03);
        const y2 = 0;

        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = this.theta;
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new  BABYLON.Vector3(x2, y2, z2);

        this.engineService.cameraTarget.position.x = x;
        this.engineService.cameraTarget.position.y = y;
        this.engineService.cameraTarget.position.z = z;
        // this.engineService.cameraTarget.lookAt.x = x2;
        // this.engineService.cameraTarget.lookAt.y = y2;
        // this.engineService.cameraTarget.lookAt.z = z2;

        this.engineService.cameraTarget.rotation.y = -this.theta;

        //         const r = (currentData[y] * 0.8 + currentData[x] * 0.8) / 2;
        //         const g = ((128 * y / 576) * 0.8 + (128 * x / 576) * 0.8) / 2;
        //         const b = ((255 - 128 * y / 350) * 0.8 + (255 - 128 * y / 350) * 0.8) / 2;





        // const currentData = this.audioService.fr64DataArray;

        // for (let x = 0; x < 32; x++) {
        //     for (let y = 0; y < 32; y++) {

        //         const r = (currentData[y] * 0.8 + currentData[x] * 0.8) / 2;
        //         const g = ((128 * y / 576) * 0.8 + (128 * x / 576) * 0.8) / 2;
        //         const b = ((255 - 128 * y / 350) * 0.8 + (255 - 128 * y / 350) * 0.8) / 2;

        //         this.myColorArray[x][y][0] = r / 255;
        //         this.myColorArray[x][y][1] = g / 255;
        //         this.myColorArray[x][y][2] = b / 255;

        //         this.myColorArray[63 - x][63 - y][0] = r / 255;
        //         this.myColorArray[63 - x][63 - y][1] = g / 255;
        //         this.myColorArray[63 - x][63 - y][2] = b / 255;

        //         this.myColorArray[63 - x][y][0] = r / 255;
        //         this.myColorArray[63 - x][y][1] = g / 255;
        //         this.myColorArray[63 - x][y][2] = b / 255;

        //         this.myColorArray[x][63 - y][0] = r / 255;
        //         this.myColorArray[x][63 - y][1] = g / 255;
        //         this.myColorArray[x][63 - y][2] = b / 255;

        //         this.myVertexArray[x][y][1] = -((currentData[y] * 0.8 + currentData[x] * 0.8) / 2) / 1;
        //         this.myVertexArray[63 - x][63 - y][1] = -((currentData[y] * 0.8 + currentData[x] * 0.8) / 2) / 1;
        //         this.myVertexArray[63 - x][y][1] = -((currentData[y] * 0.8 + currentData[x] * 0.8) / 2) / 1;
        //         this.myVertexArray[x][63 - y][1] = -((currentData[y] * 0.8 + currentData[x] * 0.8) / 2) / 1;

        //     }
        // }

        // this.ground.setVerticesData(BABYLON.VertexBuffer.ColorKind, this.myColorArray.flat(2));
        // this.ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.myVertexArray.flat(2));
    }

    remove() {
        this.engineService.scene.activeCamera = this.engineService.camera1;

        this.tubes.dispose();

        this.audioService = null;
        this.engineService = null;

        this.scene = null;
    }
}
