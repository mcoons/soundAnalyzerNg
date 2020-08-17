
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

export class WaveRibbon {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private ground;

    private myColorArray = [];
    private myVertexArray = [];

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;

        this.setDefaults();

        for (let x = 0; x < 64; x++) {
            const xColorArray = [];
            const xVertexArray = [];
            for (let y = 0; y < 64; y++) {
                xColorArray.push([1, 1, 1, 1]);
                xVertexArray.push([x - 32, 0, y - 32]);
            }
            this.myColorArray.push(xColorArray);
            this.myVertexArray.push(xVertexArray);
        }
    }

    setDefaults() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.7124;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .85;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;
    }

    create() {
        this.ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 1, height: 1, subdivisionsX: 63, subdivisionsY: 63, updatable: true }, this.scene); // 550
        this.ground.material = new BABYLON.StandardMaterial('gmat', this.scene);
        this.ground.material.backFaceCulling = false;
        this.ground.material.specularColor = new BABYLON.Color3(0, 0, 0); // black is no shine
        this.ground.material.diffuseColor = new BABYLON.Color3(.8, .8, .8); // black is no shine

        this.ground.scaling = new BABYLON.Vector3(10, 1, 10);
    }

    update() {

        const currentData = this.audioService.fr64DataArray;

        for (let x = 0; x < 32; x++) {
            for (let y = 0; y < 32; y++) {

                const r = (currentData[y] * 0.8 + currentData[x] * 0.8) / 2;
                const g = ((128 * y / 576) * 0.8 + (128 * x / 576) * 0.8) / 2;
                const b = ((255 - 128 * y / 350) * 0.8 + (255 - 128 * y / 350) * 0.8) / 2;

                this.myColorArray[x][y][0] = r / 255;
                this.myColorArray[x][y][1] = g / 255;
                this.myColorArray[x][y][2] = b / 255;

                this.myColorArray[63 - x][63 - y][0] = r / 255;
                this.myColorArray[63 - x][63 - y][1] = g / 255;
                this.myColorArray[63 - x][63 - y][2] = b / 255;

                this.myColorArray[63 - x][y][0] = r / 255;
                this.myColorArray[63 - x][y][1] = g / 255;
                this.myColorArray[63 - x][y][2] = b / 255;

                this.myColorArray[x][63 - y][0] = r / 255;
                this.myColorArray[x][63 - y][1] = g / 255;
                this.myColorArray[x][63 - y][2] = b / 255;

                this.myVertexArray[x][y][1] = -((currentData[y] * 0.8 + currentData[x] * 0.8) / 2) / 1;
                this.myVertexArray[63 - x][63 - y][1] = -((currentData[y] * 0.8 + currentData[x] * 0.8) / 2) / 1;
                this.myVertexArray[63 - x][y][1] = -((currentData[y] * 0.8 + currentData[x] * 0.8) / 2) / 1;
                this.myVertexArray[x][63 - y][1] = -((currentData[y] * 0.8 + currentData[x] * 0.8) / 2) / 1;

            }
        }

        this.ground.setVerticesData(BABYLON.VertexBuffer.ColorKind, this.myColorArray.flat(2));
        this.ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.myVertexArray.flat(2));
    }

    remove() {
        this.ground.dispose();

        this.audioService = null;
        this.scene = null;
    }
}
