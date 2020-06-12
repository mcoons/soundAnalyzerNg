
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';

export class EquationManager {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private objects1;
    private objects2;
    private objects3;
    private objects4;
    private objects5;
    private objects6;
    private objects7;
    private objects8;

    private wheel1Master;

    private cameraMoveDir;
    private thetaDelta;

    mat;
    mat2;
    mat3;
    mat4;
    mat5;
    mat6;
    mat7;
    mat8;


    constructor(scene, audioService, optionsService, messageService, engineService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        this.objects1 = [];
        this.objects2 = [];
        this.objects3 = [];
        this.objects4 = [];
        this.objects5 = [];
        this.objects6 = [];
        this.objects7 = [];
        this.objects8 = [];

        this.wheel1Master = new BABYLON.TransformNode('root');
        this.wheel1Master.position = new BABYLON.Vector3(0, 0, 0);
        this.thetaDelta = 0;

        this.cameraMoveDir = .002;


        this.setDefaults();
    }

    setDefaults() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .01;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;
    }

    create() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .01;

        const PI = Math.PI;
        const TwoPI = PI * 2;
        const PId2 = PI / 2;
        const PId32 = PI / 32;

        const loopMax = TwoPI - PId32;
        const radius = 200;

        const master = BABYLON.MeshBuilder.CreateBox(('box'), {
            height: 20,
            width: 20,
            depth: 20
        }, this.scene);

        for (let theta = 0; theta < loopMax; theta += PId32) { // 512 items ---  256*2    128*4    64*8

            const thing = master.clone('cloned');

            thing.position.x = radius * Math.cos(theta + this.thetaDelta);
            thing.position.z = radius * Math.sin(theta + this.thetaDelta);
            thing.position.y = radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta);

            this.mat = new BABYLON.StandardMaterial('matSpiral', this.scene);
            this.mat.specularColor = new BABYLON.Color3(0, 0, 0);
            // this.mat.backFaceCulling = true;
            thing.material = this.mat;

            thing.parent = this.wheel1Master;
            this.objects1.push(thing);

            const thing2 = master.clone('cloned');

            thing2.position.x = radius * Math.cos(theta + this.thetaDelta);
            thing2.position.z = radius * Math.sin(theta + this.thetaDelta);
            thing2.position.y = radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta);

            this.mat2 = new BABYLON.StandardMaterial('matSpiral', this.scene);
            this.mat2.specularColor = new BABYLON.Color3(0, 0, 0);
            // this.mat2.backFaceCulling = true;
            thing2.material = this.mat2;

            thing2.parent = this.wheel1Master;
            this.objects2.push(thing2);



            const thing3 = master.clone('cloned');

            thing3.position.x = radius * Math.cos(theta + this.thetaDelta);
            thing3.position.z = radius * Math.sin(theta + this.thetaDelta);
            thing3.position.y = radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta);

            this.mat3 = new BABYLON.StandardMaterial('matSpiral', this.scene);
            this.mat3.specularColor = new BABYLON.Color3(0, 0, 0);
            // this.mat3.backFaceCulling = true;
            thing3.material = this.mat3;

            thing3.parent = this.wheel1Master;
            this.objects3.push(thing3);



            const thing4 = master.clone('cloned');

            thing4.position.x = radius * Math.cos(theta + this.thetaDelta);
            thing4.position.z = radius * Math.sin(theta + this.thetaDelta);
            thing4.position.y = radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta);

            this.mat4 = new BABYLON.StandardMaterial('matSpiral', this.scene);
            this.mat4.specularColor = new BABYLON.Color3(0, 0, 0);
            // this.mat4.backFaceCulling = true;
            thing4.material = this.mat4;

            thing4.parent = this.wheel1Master;
            this.objects4.push(thing4);



            const thing5 = master.clone('cloned');

            thing5.position.x = radius * Math.cos(theta + this.thetaDelta);
            thing5.position.z = radius * Math.sin(theta + this.thetaDelta);
            thing5.position.y = radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta);

            this.mat5 = new BABYLON.StandardMaterial('matSpiral', this.scene);
            this.mat5.specularColor = new BABYLON.Color3(0, 0, 0);
            // this.mat5.backFaceCulling = true;
            thing5.material = this.mat5;

            thing5.parent = this.wheel1Master;
            this.objects5.push(thing5);



            const thing6 = master.clone('cloned');

            thing6.position.x = radius * Math.cos(theta + this.thetaDelta);
            thing6.position.z = radius * Math.sin(theta + this.thetaDelta);
            thing6.position.y = radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta);

            this.mat6 = new BABYLON.StandardMaterial('matSpiral', this.scene);
            this.mat6.specularColor = new BABYLON.Color3(0, 0, 0);
            // this.mat6.backFaceCulling = true;
            thing6.material = this.mat6;

            thing6.parent = this.wheel1Master;
            this.objects6.push(thing6);



            const thing7 = master.clone('cloned');

            thing7.position.x = radius * Math.cos(theta + this.thetaDelta);
            thing7.position.z = radius * Math.sin(theta + this.thetaDelta);
            thing7.position.y = radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta);

            this.mat7 = new BABYLON.StandardMaterial('matSpiral', this.scene);
            this.mat7.specularColor = new BABYLON.Color3(0, 0, 0);
            // this.mat7.backFaceCulling = true;
            thing7.material = this.mat7;

            thing7.parent = this.wheel1Master;
            this.objects7.push(thing7);



            const thing8 = master.clone('cloned');

            thing8.position.x = radius * Math.cos(theta + this.thetaDelta);
            thing8.position.z = radius * Math.sin(theta + this.thetaDelta);
            thing8.position.y = radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta);

            this.mat8 = new BABYLON.StandardMaterial('matSpiral', this.scene);
            this.mat8.specularColor = new BABYLON.Color3(0, 0, 0);
            // this.mat8.backFaceCulling = true;
            thing8.material = this.mat8;

            thing8.parent = this.wheel1Master;
            this.objects8.push(thing8);
        }

        master.dispose();
        this.wheel1Master.scaling.x = .8;
        this.wheel1Master.scaling.y = .8;
        this.wheel1Master.scaling.z = .8;
    }

    update() {
        const PI = Math.PI;
        const TwoPI = PI * 2;
        const PId2 = PI / 2;
        const PId32 = PI / 32;
        const loopMax = TwoPI - PId32;

        if (this.optionsService.animateCamera) {
            (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta += this.cameraMoveDir;

            if (this.cameraMoveDir > 0 && (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta >= 3.13) {
                this.cameraMoveDir *= -1;
            } else {
                if (this.cameraMoveDir < 0 && (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta <= .01) {
                    this.cameraMoveDir *= -1;
                }
            }
        }

        const radius = 200;
        let index = 0;

        const scalingDenom = 20;

        for (let theta = 0; theta < loopMax; theta += PId32) { // 512 items ---  256*2    128*4    64*8

            this.objects1[index].position.x = radius * Math.cos(theta + this.thetaDelta);
            this.objects1[index].position.z = radius * Math.sin(theta + this.thetaDelta);
            this.objects1[index].position.y = radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);
            let y = (this.audioService.sample1[index]);
            y = (y / 255 * y / 255) * 255;

            this.objects1[index].material.diffuseColor.r  = this.optionsService.colors(y).r / 255;
            this.objects1[index].material.diffuseColor.g = this.optionsService.colors(y).g / 255;
            this.objects1[index].material.diffuseColor.b  = this.optionsService.colors(y).b / 255;

            this.objects1[index].scaling.y = 1 + y / scalingDenom;


            this.objects2[index].position.x = 1.1 * radius * Math.cos(theta + this.thetaDelta);
            this.objects2[index].position.z = 1.1 * radius * Math.sin(theta + this.thetaDelta);
            this.objects2[index].position.y = 0.9 * radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);
            y = (this.audioService.sample1[index + 64]);
            y = (y / 255 * y / 255) * 255;

            this.objects2[index].material.diffuseColor.r  = this.optionsService.colors(y).r / 255;
            this.objects2[index].material.diffuseColor.g = this.optionsService.colors(y).g / 255;
            this.objects2[index].material.diffuseColor.b  = this.optionsService.colors(y).b / 255;
            this.objects2[index].scaling.y = 1 + y / scalingDenom;


            this.objects3[index].position.x = 1.2 * radius * Math.cos(theta + this.thetaDelta);
            this.objects3[index].position.z = 1.2 * radius * Math.sin(theta + this.thetaDelta);
            this.objects3[index].position.y = 0.8 * radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);
            y = (this.audioService.sample1[index + 128]);
            y = (y / 255 * y / 255) * 255;

            this.objects3[index].material.diffuseColor.r  = this.optionsService.colors(y).r / 255;
            this.objects3[index].material.diffuseColor.g = this.optionsService.colors(y).g / 255;
            this.objects3[index].material.diffuseColor.b  = this.optionsService.colors(y).b / 255;
            this.objects3[index].scaling.y = 1 + y / scalingDenom;


            this.objects4[index].position.x = 1.3 * radius * Math.cos(theta + this.thetaDelta);
            this.objects4[index].position.z = 1.3 * radius * Math.sin(theta + this.thetaDelta);
            this.objects4[index].position.y = 0.7 * radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);
            y = (this.audioService.sample1[index + 192]);
            y = (y / 255 * y / 255) * 255;

            this.objects4[index].material.diffuseColor.r  = this.optionsService.colors(y).r / 255;
            this.objects4[index].material.diffuseColor.g = this.optionsService.colors(y).g / 255;
            this.objects4[index].material.diffuseColor.b  = this.optionsService.colors(y).b / 255;
            this.objects4[index].scaling.y = 1 + y / scalingDenom;


            this.objects5[index].position.x = 1.4 * radius * Math.cos(theta + this.thetaDelta);
            this.objects5[index].position.z = 1.4 * radius * Math.sin(theta + this.thetaDelta);
            this.objects5[index].position.y = 0.6 * radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);
            y = (this.audioService.sample1[index + 256]);
            y = (y / 255 * y / 255) * 255;

            this.objects5[index].material.diffuseColor.r  = this.optionsService.colors(y).r / 255;
            this.objects5[index].material.diffuseColor.g = this.optionsService.colors(y).g / 255;
            this.objects5[index].material.diffuseColor.b  = this.optionsService.colors(y).b / 255;
            this.objects5[index].scaling.y = 1 + y / scalingDenom;


            this.objects6[index].position.x = 1.5 * radius * Math.cos(theta + this.thetaDelta);
            this.objects6[index].position.z = 1.5 * radius * Math.sin(theta + this.thetaDelta);
            this.objects6[index].position.y = 0.5 * radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);
            y = (this.audioService.sample1[index + 320]);
            y = (y / 255 * y / 255) * 255;

            this.objects6[index].material.diffuseColor.r  = this.optionsService.colors(y).r / 255;
            this.objects6[index].material.diffuseColor.g = this.optionsService.colors(y).g / 255;
            this.objects6[index].material.diffuseColor.b  = this.optionsService.colors(y).b / 255;
            this.objects6[index].scaling.y = 1 + y / scalingDenom;


            this.objects7[index].position.x = 1.6 * radius * Math.cos(theta + this.thetaDelta);
            this.objects7[index].position.z = 1.6 * radius * Math.sin(theta + this.thetaDelta);
            this.objects7[index].position.y = 0.4 * radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);
            y = (this.audioService.sample1[index + 384]);
            y = (y / 255 * y / 255) * 255;

            this.objects7[index].material.diffuseColor.r  = this.optionsService.colors(y).r / 255;
            this.objects7[index].material.diffuseColor.g = this.optionsService.colors(y).g / 255;
            this.objects7[index].material.diffuseColor.b  = this.optionsService.colors(y).b / 255;
            this.objects7[index].scaling.y = 1 + y / scalingDenom;


            this.objects8[index].position.x = 1.7 * radius * Math.cos(theta + this.thetaDelta);
            this.objects8[index].position.z = 1.7 * radius * Math.sin(theta + this.thetaDelta);
            this.objects8[index].position.y = 0.3 * radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);
            y = (this.audioService.sample1[index + 448]);
            y = (y / 255 * y / 255) * 255;

            this.objects8[index].material.diffuseColor.r  = this.optionsService.colors(y).r / 255;
            this.objects8[index].material.diffuseColor.g = this.optionsService.colors(y).g / 255;
            this.objects8[index].material.diffuseColor.b  = this.optionsService.colors(y).b / 255;
            this.objects8[index].scaling.y = 1 + y / scalingDenom;

            index++;
        }

        this.wheel1Master.rotation.y += .01;

        this.thetaDelta += .011;
        if (this.thetaDelta > TwoPI) {
            this.thetaDelta -= TwoPI;
        }

    }

    remove() {

        this.objects1.forEach(o => o.dispose());
        this.objects1 = null;

        this.objects2.forEach(o => o.dispose());
        this.objects2 = null;

        this.objects3.forEach(o => o.dispose());
        this.objects3 = null;

        this.objects4.forEach(o => o.dispose());
        this.objects4 = null;

        this.objects5.forEach(o => o.dispose());
        this.objects5 = null;

        this.objects6.forEach(o => o.dispose());
        this.objects6 = null;

        this.objects7.forEach(o => o.dispose());
        this.objects7 = null;

        this.objects8.forEach(o => o.dispose());
        this.objects8 = null;

        this.wheel1Master.dispose();

    }

}
