
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';

export class CubeManager {

    private objects;
    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private master;
    private thetaDelta;
    private cameraMoveDir;

    constructor(scene, audioService, optionsService, messageService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        this.objects = [];
        this.thetaDelta = 0;
        this.cameraMoveDir = .002;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, -40, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = Math.PI / 2;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = Math.PI / 2;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 800;

        this.optionsService.smoothingConstant = 7;
        this.optionsService.sampleGain = 1;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');

    }

    create() {

        const master = BABYLON.MeshBuilder.CreateBox(('box'), {
            width: 30,
            depth: 30,
            height: 30
        }, this.scene);

        for (let y = 0; y <= 6; y++) { // 9 * 64 = 576
            for (let x = 0; x <= 9; x++) { // 9 * 64 = 576
                for (let z = 0; z <= 7; z++) {
                    const thing = master.clone('clone');

                    thing.position.x = (x - 4.5) * 80;  // 80
                    thing.position.y = (y - 3) * 80;  // 80
                    thing.position.z = (z - 3.5) * 80;  // 80

                    thing.doNotSyncBoundingInfo = true;
                    thing.convertToUnIndexedMesh();

                    const r = 1;
                    const g = 1;
                    const b = 1;
                    const color = new BABYLON.Color3(r, g, b);

                    const mat = new BABYLON.StandardMaterial('mat', this.scene);
                    mat.diffuseColor = color;
                    mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
                    mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
                    mat.backFaceCulling = true;
                    mat.alpha = 1;
                    thing.material = mat;

                    this.objects.push(thing);
                }
            }
        }
        master.dispose();
    }

    update() {
        if ((this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha >= Math.PI * 2) {
            (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha -= Math.PI * 2;
        }

        this.objects.forEach((o, i) => {
            const yy = this.audioService.sample1[i] * 1.05;

            o.scaling.x = yy / 160;
            o.scaling.y = yy / 160;
            o.scaling.z = yy / 160;

            const r = 128 - yy;
            const b = yy;
            const g = 128 - yy;

            o.material.diffuseColor.r = r / 255;
            o.material.diffuseColor.g = g / 255;
            o.material.diffuseColor.b = b / 255;
            o.material.alpha = ((yy / 255) * (yy / 255));
        });
    }

    remove() {
        this.objects.forEach(o => o.dispose());
        this.objects = null;
    }

}
