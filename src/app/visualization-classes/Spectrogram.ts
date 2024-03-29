
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

export class Spectrogram {

    private scene: BABYLON.Scene;
    private audioService: AudioService;

    private ground;
    private groundVertices;
    private colorsBuffer;

    constructor(scene: BABYLON.Scene, audioService: AudioService, optionsService: OptionsService, messageService: MessageService, engineService: EngineService, colorsService: ColorsService) {

        this.scene = scene;
        this.audioService = audioService;

    }

    create(): void {
        // tslint:disable-next-line: max-line-length
        this.ground = BABYLON.MeshBuilder.CreateGround('ground1', { width: 2, height: 1, subdivisionsX: this.audioService.sample2.length - 1, subdivisionsY: 150, updatable: true }, this.scene); // 550
        this.ground.material = new BABYLON.StandardMaterial('gmat', this.scene);
        this.ground.material.backFaceCulling = false;
        this.ground.material.specularColor = new BABYLON.Color3(0, 0, 0); // black is no shine
        this.ground.position.z -= 250;
        this.ground.scaling = new BABYLON.Vector3(350, .25, 800);

        this.groundVertices = this.ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);

        this.setDefaults();
    }

    setDefaults(): void {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = -50;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.7124;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .85;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;
    }

    update(): void {

        const h = this.audioService.sample2.length;  // dataset length + 1
        const w = 151;  // history length + 1

        let yVertexDataIndex = 1;  // 0 for x, 1 for y
        let colorIndex = 0;
        this.colorsBuffer = [];

        for (let x = w-1; x >= 0; x--) {
            const currentData = this.audioService.sample2BufferHistory[x];
            for (let y = 0; y < h; y++) {

                // const r = currentData[y] * 1.25;
                // const g = 100 * y / 224;
                // const b = 255 - 128 * y / 160;

                const r = currentData[y] * 1.25;
                const g = .4464 * y;
                const b = 255 - .8 * y;

                // this.colorsBuffer[colorIndex] = r / 235;
                // this.colorsBuffer[colorIndex + 1] = g / 255;
                // this.colorsBuffer[colorIndex + 2] = b / 255;
                this.colorsBuffer[colorIndex] = r * .0042553;
                this.colorsBuffer[colorIndex + 1] = g * .00392;
                this.colorsBuffer[colorIndex + 2] = b * .00392;
                this.colorsBuffer[colorIndex + 3] = 1;

                // set y value of ground vertex data
                this.groundVertices[yVertexDataIndex] = currentData[y] * 1.25;

                colorIndex += 4;
                yVertexDataIndex += 3;
            }
        }

        // update the 3D babylon ground plane
        this.ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.groundVertices);
        this.ground.setVerticesData(BABYLON.VertexBuffer.ColorKind, this.colorsBuffer);
    }

    remove(): void {
        this.ground.dispose();
        this.audioService = null;
        this.scene = null;
    }
}
