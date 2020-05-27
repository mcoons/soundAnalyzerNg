
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';

export class Spectrograph {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;
    private ground;
    private groundVertices;
    private colorsBuffer;

    constructor(scene, audioService, optionsService, messageService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

    }

    create() {
        console.log(this.audioService.getSample().length);
        // tslint:disable-next-line: max-line-length
        this.ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 2, height: 1, subdivisionsX: this.audioService.getSample().length  - 1, subdivisionsY: 150, updatable: true }, this.scene); // 550
        this.ground.material = new BABYLON.StandardMaterial('gmat', this.scene);
        this.ground.material.backFaceCulling = false;
        this.ground.material.specularColor = new BABYLON.Color3(0, 0, 0); // black is no shine
        // this.ground.material.wireframe = true;

        this.ground.scaling = new BABYLON.Vector3(400, .25, 400);

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, -50, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.7124;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .85;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1155;

        this.optionsService.smoothingConstant = 1;
        this.optionsService.sampleGain = 1;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');

        this.groundVertices = this.ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);

    }

    update() {

        const h = this.audioService.getSample().length ;  // dataset length + 1
        const w = 151;  // history length + 1

        let yVertexDataIndex = 1;  // 0 for x, 1 for y
        this.colorsBuffer = [];

        for (let x = 0; x < w; x++) {
            const currentData = this.audioService.sample1BufferHistory[x];
            for (let y = 0; y < h; y++) {

                const r = currentData[y];
                const g = 128 * y / 576;
                const b = 255 - 128 * y / 350;

                // set color for 3D babylonjs canvas
                this.colorsBuffer.push(r / 255);
                this.colorsBuffer.push(g / 255);
                this.colorsBuffer.push(b / 255);
                this.colorsBuffer.push(1);

                // set y value of ground vertex data
                this.groundVertices[yVertexDataIndex] = currentData[y];

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
