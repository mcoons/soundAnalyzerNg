
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';

export class WaveRibbon {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private ground;
    private groundVertices;
    private colorsBuffer;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        this.setDefaults();
    }

    setDefaults() {
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, -50, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.7124;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .85;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;
    }

    create() {
        // tslint:disable-next-line: max-line-length
        this.ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 2, height: 1, subdivisionsX: this.audioService.tdDataArray.length - 1, subdivisionsY: this.audioService.tdHistoryArraySize - 1, updatable: true }, this.scene); // 550
        this.ground.material = new BABYLON.StandardMaterial('gmat', this.scene);
        this.ground.material.backFaceCulling = false;
        this.ground.material.specularColor = new BABYLON.Color3(0, 0, 0); // black is no shine

        this.ground.scaling = new BABYLON.Vector3(350, .25, 350);

        this.groundVertices = this.ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);

    }

    update() {

        const h = this.audioService.tdBufferLength;  // dataset length + 1
        // const w = this.audioService.tdHistoryArraySize;  // history length + 1
        const w = 150;

        let yVertexDataIndex = 1;  // 0 for x, 1 for y
        this.colorsBuffer = [];

        for (let x = 0; x < w; x++) {
            const currentData = this.audioService.tdHistory[x];
            for (let y = 0; y < h; y++) {
                const yy = y;

                const r = currentData[yy] * 0.8;
                const g = (128 * yy / 576) * 0.8;
                const b = (255 - 128 * y / 350) * 0.8;

                // set color for 3D babylonjs canvas
                this.colorsBuffer.push(r / 255);
                this.colorsBuffer.push(g / 255);
                this.colorsBuffer.push(b / 255);
                this.colorsBuffer.push(1);

                // set y value of ground vertex data
                this.groundVertices[yVertexDataIndex] = currentData[y] * 3 - 350;

                yVertexDataIndex += 3;
            }
        }


        // update the 3D babylon ground plane
        this.ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.groundVertices);
        this.ground.setVerticesData(BABYLON.VertexBuffer.ColorKind, this.colorsBuffer);
    }

    remove() {
        this.ground.dispose();
    }
}
