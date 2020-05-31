
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';

import {
    map
} from './utilities.js';

export class Rings {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private ring1SPS;

    private mat;
    private mesh1;

    constructor(scene, audioService, optionsService, messageService, engineService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72; // 4.72
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .81; // 1
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1400;

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.4;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 0.2;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 0.2;

        this.scene.registerBeforeRender(this.beforeRender);

        this.optionsService.smoothingConstant = 5;
        this.optionsService.sampleGain = 15;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');
    }

    beforeRender = () => {

        this.ring1SPS.setParticles();

        // this.ring1SPS.mesh.scaling.x = .5;
        // this.ring1SPS.mesh.scaling.y = .5;
        // this.ring1SPS.mesh.scaling.z = .5;

        this.mat.wireframe = this.optionsService.showWireframe;
    }

    create() {

        const radius1 = 300;
        const width1 = 150;
        const depth1 = 4;
        const height1 = 10;

        let gtheta;
        this.mat = new BABYLON.MultiMaterial('mm', this.scene);

        // BUILD RING1 SPS ////////////////////////////////

        const ring1PositionFunction = (particle, i, s) => {
            let myMaterial = new BABYLON.StandardMaterial(`material${i}`, this.scene);
            myMaterial.diffuseTexture = new BABYLON.Texture('../../assets/mats/glow2.png', this.scene);
            myMaterial.backFaceCulling = false;
            myMaterial.opacityTexture = new BABYLON.Texture('../../assets/mats/glow2.png', this.scene);
            myMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
            myMaterial.ambientColor = new BABYLON.Color3(1, 1, 1);
            myMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);

            myMaterial.diffuseTexture.hasAlpha = true;
            (myMaterial.diffuseTexture as BABYLON.Texture).vScale = 1/5;
            (myMaterial.opacityTexture as BABYLON.Texture).vScale = 1/5;

            this.mat.subMaterials.push(myMaterial);
            particle.materialIndex = i;

            particle.position.x = radius1 * Math.cos(gtheta);
            particle.position.z = radius1 * Math.sin(gtheta);
            particle.position.y = 100;
            particle.rotation.y = Math.PI/2-gtheta;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.ring1SPS = new BABYLON.SolidParticleSystem('ring1SPS', this.scene, { updatable: true, enableMultiMaterial: true });

        const box = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 30, height: 200}, this.scene);

        for (let theta = Math.PI / 2; theta < 2 * Math.PI + Math.PI / 2 - Math.PI / 50; theta += Math.PI / 50) {
            gtheta = theta;
            this.ring1SPS.addShape(box, 1, { positionFunction: ring1PositionFunction });
        }

        this.mesh1 = this.ring1SPS.buildMesh();
        this.mesh1.material = this.mat;

        // dispose the model
        box.dispose();

        this.ring1SPS.updateParticle = (particle) => {
            const myTheta = particle.idx * Math.PI / 50 + Math.PI / 2;
            let yy = this.audioService.fr64DataArray[particle.idx < 50 ? particle.idx : 50 - (particle.idx - 50)] ;

            yy = (yy / 255 * yy / 255) * 255;
            // console.log(yy);

            particle.color.r = this.optionsService.colors(yy).r / 255;
            particle.color.g = this.optionsService.colors(yy).g / 255;
            particle.color.b = this.optionsService.colors(yy).b / 255;

            this.mat.subMaterials[particle.idx].ambientColor.r = this.optionsService.colors(yy).r / 255;
            this.mat.subMaterials[particle.idx].ambientColor.g = this.optionsService.colors(yy).g / 255;
            this.mat.subMaterials[particle.idx].ambientColor.b = this.optionsService.colors(yy).b / 255;
            
            this.mat.subMaterials[particle.idx].emissiveColor.r = this.optionsService.colors(yy).r / 255;
            this.mat.subMaterials[particle.idx].emissiveColor.g = this.optionsService.colors(yy).g / 255;
            this.mat.subMaterials[particle.idx].emissiveColor.b = this.optionsService.colors(yy).b / 255;
            
            // 0 = full     .2 = none
            let yo = map(yy,0,255,.2,0);
            (this.mat.subMaterials[particle.idx].diffuseTexture as BABYLON.Texture).vOffset = yo;
            (this.mat.subMaterials[particle.idx].opacityTexture as BABYLON.Texture).vOffset = yo;
        };

    }

    update() { }

    remove() {
        this.ring1SPS.mesh.dispose();

        this.mesh1.dispose();

        this.scene.unregisterBeforeRender(this.beforeRender);

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.8;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 1.0;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 1.0;
    }

}
