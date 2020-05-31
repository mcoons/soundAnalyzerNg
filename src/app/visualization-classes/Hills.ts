
import * as BABYLON from 'babylonjs';
import * as BMaterials from 'babylonjs-materials';

import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';

import { MaterialHelper } from 'babylonjs';

export class Hills {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private SPS;
    private mesh;
    private mat;

    gtheta: number;
    x = 0;
    y = 0;
    z = 0;

    objects = [];

    constructor(scene, audioService, optionsService, messageService, engineService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = -Math.PI / 2;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = Math.PI / 4;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;

        this.optionsService.smoothingConstant = 1;
        this.optionsService.sampleGain = 1;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');

    }



    create() {

        const w = this.audioService.getSample().length;  // dataset length + 1
        const h = 151;  // history length + 1

        for (this.x = Math.round(-w / 2); this.x <= w / 2; this.x++) {

            var paths = [];
            var paths2 = [];

            let x2 = this.x;
            let y2 = 0;
            let z2 = this.z;

            for (this.z = -250; this.z < 250; this.z++) {
                z2 = this.z;

                if (this.x <= -125) {
                    x2 = 1 * (this.x);
                    y2 = 15 * Math.sin(x2 / 50) * Math.sin(z2 / 50);

                } else

                    if (this.x <= 0) {
                        //         x2 = 1 * (this.x - this.z * this.z / 500 );
                        //         y2 = 15 * Math.sin(x2 / 30) * Math.sin(z2 / 100);
                    } else

                        if (this.x <= 125) {
                            //         x2 = 1 * (this.x + this.x * this.z / 500 );
                            //         y2 = 15 * Math.sin(x2 / 50) * Math.sin(z2 / 50);
                        } else {

                            //         x2 = 1 * (this.x - this.z*this.z/500 + 80);
                            //         y2 = 15*Math.sin(x2/30)*Math.sin(z2/100);
                        }

                paths.push(new BABYLON.Vector3(x2, y2, z2));
                paths2.push(new BABYLON.Vector3(x2 + .9, y2, z2));

            }

            var ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", { pathArray: [paths, paths2] }, this.scene);
            let mat = new BABYLON.StandardMaterial("myMaterial", this.scene);
            mat.backFaceCulling = false;
            ribbon.material = mat;
            this.objects.push(ribbon);

        }


    }

    update() {
        this.objects.forEach((o, i) => {
            let yy = this.audioService.sample1[i] * 1.05;
            yy = (yy / 155 * yy / 155) * 255;

            const r = (128 - yy) / 255;
            const b = yy / 255;
            const g = (128 - yy) / 255;

            o.material.diffuseColor.r = r;
            o.material.diffuseColor.g = g;
            o.material.diffuseColor.b = b;
        });
    }

    remove() {

        this.objects.forEach(o => {
            o.dispose();
        });

    }
}
