
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';

export class BlockPlaneManager {

    private objects;
    private objects2;
    private objects3;
    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    constructor(scene, audioService, optionsService, messageService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.objects = [];
        this.objects2 = [];
        this.objects3 = [];

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = 1.00;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 2600;

        this.optionsService.smoothingConstant = 7;
        this.optionsService.sampleGain = 1;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');

    }

    create() {
        // const width = 30;
        // const depth = 60;

        for (let z = (this.audioService.getSample().length / 64); z >= 0; z--) {  // 8
            for (let x = 0; x < 64; x++) { // 9 * 64 = 576

                const thing = BABYLON.MeshBuilder.CreateBox(('box'), {
                    width: 30,
                    depth: 60
                }, this.scene);

                thing.position.x = (x - 31.5) * 30;
                thing.position.z = (z - 5) * 60;
                thing.position.y = 0;

                // thing.doNotSyncBoundingInfo = true;
                // thing.convertToUnIndexedMesh();

                const r = 0;
                const g = 0.1;
                const b = 0.0;

                const color = new BABYLON.Color3(r, g, b);

                const mat = new BABYLON.StandardMaterial('mat', this.scene);
                mat.diffuseColor = color;
                mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
                mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
                mat.backFaceCulling = true;
                mat.alpha = 1;
                // mat.wireframe = true;


                thing.material = mat;

                this.objects.push(thing);
            }
        }



        for (let z = (this.audioService.fr512DataArray.length / 64); z >= 0; z--) {  // 8
            for (let x = 0; x < 64; x++) { // 9 * 64 = 576

                const thing = BABYLON.MeshBuilder.CreateBox(('box'), {
                    width: 30,
                    depth: 60
                }, this.scene);

                thing.position.x = (x - 31.5) * 30;
                thing.position.z = (z + 15) * 60;
                thing.position.y = 0;

                // thing.doNotSyncBoundingInfo = true;
                // thing.convertToUnIndexedMesh();

                const r = 0;
                const g = 0.1;
                const b = 0.0;

                const color = new BABYLON.Color3(r, g, b);

                const mat = new BABYLON.StandardMaterial('mat', this.scene);
                mat.diffuseColor = color;
                mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
                mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
                mat.backFaceCulling = true;
                mat.alpha = 1;
                // mat.wireframe = true;

                thing.material = mat;

                this.objects2.push(thing);
            }
        }




        for (let z = (this.audioService.sampleAve.length / 64); z >= 0; z--) {  // 8
            for (let x = 0; x < 64; x++) { // 9 * 64 = 576

                const thing = BABYLON.MeshBuilder.CreateBox(('box'), {
                    width: 30,
                    depth: 60
                }, this.scene);

                thing.position.x = (x - 31.5) * 30;
                thing.position.z = (z + 5) * 60;
                thing.position.y = 0;

                // thing.doNotSyncBoundingInfo = true;
                // thing.convertToUnIndexedMesh();

                const r = 0;
                const g = 0.1;
                const b = 0.0;

                const color = new BABYLON.Color3(r, g, b);

                const mat = new BABYLON.StandardMaterial('mat', this.scene);
                mat.diffuseColor = color;
                mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
                mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
                mat.backFaceCulling = true;
                mat.alpha = 1;
                // mat.wireframe = true;

                thing.material = mat;

                this.objects3.push(thing);
            }
        }




    }

    update() {
        this.objects.forEach((o, i) => {
            let yy = this.audioService.getSample()[i];
            yy = (yy / 200 * yy / 200) * 255;

            o.scaling.y = yy * .5 + .01;
            o.position.y = o.scaling.y / 2;

            let r = 0;
            let b = 0;
            let g = 0;

            r = yy;
            b = 200 - yy * 2;
            g = 128 - yy / 2;


            o.material.diffuseColor.r = r / 255;
            o.material.diffuseColor.g = g / 255;
            o.material.diffuseColor.b = b / 255;
        });


        this.objects2.forEach((o, i) => {
            let yy = this.audioService.fr512DataArray[i];
            yy = (yy / 200 * yy / 200) * 255;

            o.scaling.y = yy * .5 + .01;
            o.position.y = o.scaling.y / 2;

            let r = 0;
            let b = 0;
            let g = 0;

            r = yy;
            b = 200 - yy * 2;
            g = 128 - yy / 2;


            o.material.diffuseColor.r = r / 255;
            o.material.diffuseColor.g = g / 255;
            o.material.diffuseColor.b = b / 255;
        });




        this.objects3.forEach((o, i) => {
            let yy = this.audioService.sampleAve[i];
            yy = (yy / 200 * yy / 200) * 255;

            o.scaling.y = yy * .5 + .01;
            o.position.y = o.scaling.y / 2;

            let r = 0;
            let b = 0;
            let g = 0;

            r = yy;
            b = 200 - yy * 2;
            g = 128 - yy / 2;


            o.material.diffuseColor.r = r / 255;
            o.material.diffuseColor.g = g / 255;
            o.material.diffuseColor.b = b / 255;
        });




    }

    remove() {
        this.objects.forEach(o => o.dispose());
        this.objects = null;

        this.objects2.forEach(o => o.dispose());
        this.objects2 = null;

        this.objects3.forEach(o => o.dispose());
        this.objects3 = null;
    }

}
