
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
    private ring2SPS;
    private ring3SPS;
    private ring4SPS;
    private ring5SPS;
    private mat;
    private mesh1;
    private mesh2;
    private mesh3;
    private mesh4;
    private mesh5;

    private rotation = 0;

    constructor(scene, audioService, optionsService, messageService, engineService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72; // 4.72
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .81; // 1
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.4;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 0.2;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 0.2;

        this.scene.registerBeforeRender(this.beforeRender);

        this.optionsService.smoothingConstant = 5;
        this.optionsService.sampleGain = 4;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');
    }

    beforeRender = () => {

        this.ring1SPS.setParticles();
        // this.ring2SPS.setParticles();
        // this.ring3SPS.setParticles();
        // this.ring4SPS.setParticles();
        // this.ring5SPS.setParticles();

        this.ring1SPS.mesh.scaling.x = .5;
        this.ring1SPS.mesh.scaling.y = .5;
        this.ring1SPS.mesh.scaling.z = .5;

        // this.ring2SPS.mesh.scaling.x = .5;
        // this.ring2SPS.mesh.scaling.y = .5;
        // this.ring2SPS.mesh.scaling.z = .5;

        // this.ring3SPS.mesh.scaling.x = .5;
        // this.ring3SPS.mesh.scaling.y = .5;
        // this.ring3SPS.mesh.scaling.z = .5;

        // this.ring4SPS.mesh.scaling.x = .5;
        // this.ring4SPS.mesh.scaling.y = .5;
        // this.ring4SPS.mesh.scaling.z = .5;

        // this.ring5SPS.mesh.scaling.x = .5;
        // this.ring5SPS.mesh.scaling.y = .5;
        // this.ring5SPS.mesh.scaling.z = .5;

        this.mat.wireframe = this.optionsService.showWireframe;


        // this.rotation += Math.PI / 500;
        // if (this.rotation >= Math.PI * 2) {
        //     this.rotation = 0;
        // }
        // this.ring1SPS.mesh.rotation.z = this.rotation;
        // this.ring1SPS.mesh.rotation.y = this.rotation;
        // this.ring1SPS.mesh.rotation.x = this.rotation;

        // this.ring2SPS.mesh.rotation.z = -this.rotation;
        // this.ring2SPS.mesh.rotation.y = -this.rotation;
        // this.ring2SPS.mesh.rotation.x = -this.rotation;
    }

    create() {

        // let x: number;
        // let z: number;

        const radius1 = 300;
        const width1 = 150;
        const depth1 = 4;
        const height1 = 10;

        // const radius2 = 180;
        // const width2 = 100;
        // const depth2 = 6;
        // const height2 = 20;

        // const radius3 = 340;
        // const width3 = 100;
        // const depth3 = 5;
        // const height3 = 20;


        // const radius4 = 500;
        // const width4 = 100;
        // const depth4 = 1;
        // const height4 = 20;

        // const radius5 = 680;
        // const width5 = 100;
        // const depth5 = 2;
        // const height5 = 20;

        let gtheta;
        this.mat = new BABYLON.MultiMaterial('mm', this.scene);


        // this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        // this.mat.diffuseTexture = new BABYLON.Texture('../../assets/mats/glow.png', this.scene);
        // this.mat.backFaceCulling = false;
        // this.mat.opacityTexture = new BABYLON.Texture('../../assets/mats/glow.png', this.scene);

        // this.mat.diffuseTexture.hasAlpha = true;


        // BUILD RING1 SPS ////////////////////////////////

        const ring1PositionFunction = (particle, i, s) => {
            let myMaterial = new BABYLON.StandardMaterial(`material${i}`, this.scene);
            myMaterial.diffuseTexture = new BABYLON.Texture('../../assets/mats/glow2.png', this.scene);
            myMaterial.backFaceCulling = false;
            myMaterial.opacityTexture = new BABYLON.Texture('../../assets/mats/glow2.png', this.scene);

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

        this.ring1SPS = new BABYLON.SolidParticleSystem('ring1SPS', this.scene, { updatable: true });
        // const box = BABYLON.MeshBuilder.CreateBox(('box'), {
        //     width: width1,
        //     depth: depth1,
        //     height: height1
        // }, this.scene);

        const box = BABYLON.MeshBuilder.CreatePlane("myPlane", {width: 20, height: 200}, this.scene);

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
            // let yy = this.audioService.fr64DataArray[particle.idx];

            // let yy = this.audioService.getSample()[555 - particle.idx];
            yy = (yy / 255 * yy / 255) * 255;
            console.log(yy);

            particle.color.r = this.optionsService.colors(yy).r / 255;
            particle.color.g = this.optionsService.colors(yy).g / 255;
            particle.color.b = this.optionsService.colors(yy).b / 255;

            // this.mat.subMaterials[particle.idx].alpha = yy / 255;


            // 0 = full     .2 = none
            let yo = map(yy,0,255,0,.2);
            (this.mat.subMaterials[particle.idx].diffuseTexture as BABYLON.Texture).vOffset = yo;
            (this.mat.subMaterials[particle.idx].opacityTexture as BABYLON.Texture).vOffset = yo;


            // particle.material.alpha = yy / 255;

            // particle.scaling.x = .05 + yy * 2;
            // particle.position.x = (radius1 + yy * width1) * Math.cos(myTheta);
            // particle.position.z = (radius1 + yy * width1) * Math.sin(myTheta);
            // particle.rotation.y = -myTheta;
        };


        // // BUILD RING2 SPS ////////////////////////////////

        // const ring2PositionFunction = (particle, i, s) => {
        //     particle.position.x = radius2 * Math.cos(gtheta);
        //     particle.position.z = radius2 * Math.sin(gtheta);
        //     particle.position.y = 0;
        //     particle.rotation.y = -gtheta;
        //     particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        // };

        // this.ring2SPS = new BABYLON.SolidParticleSystem('ring2SPS', this.scene, { updatable: true });
        // const box2 = BABYLON.MeshBuilder.CreateBox(('box'), {
        //     width: width2,
        //     depth: depth2,
        //     height: height2
        // }, this.scene);

        // for (let theta = Math.PI / 2; theta < 2 * Math.PI + Math.PI / 2 - Math.PI / 100; theta += Math.PI / 100) {
        //     gtheta = theta;
        //     this.ring2SPS.addShape(box2, 1, { positionFunction: ring2PositionFunction });
        // }

        // this.mesh2 = this.ring2SPS.buildMesh();
        // this.mesh2.material = this.mat;

        // // dispose the model
        // box2.dispose();

        // this.ring2SPS.updateParticle = (particle) => {
        //     const myTheta = particle.idx * Math.PI / 100 + Math.PI / 2;
        //     const yy = this.audioService.fr128DataArray[particle.idx < 100 ? particle.idx : 100 - (particle.idx - 100)] / 350;

        //     // particle.scaling.x = .05 + yy * 2;
        //     // particle.position.x = (radius2 + yy * width2) * Math.cos(myTheta);
        //     // particle.position.z = (radius2 + yy * width2) * Math.sin(myTheta);
        //     // particle.rotation.y = -myTheta;
        // };


        // // BUILD RING3 SPS ////////////////////////////////

        // const ring3PositionFunction = (particle, i, s) => {
        //     particle.position.x = radius3 * Math.cos(gtheta);
        //     particle.position.z = radius3 * Math.sin(gtheta);
        //     particle.position.y = 0;
        //     particle.rotation.y = -gtheta;
        //     particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        // };

        // this.ring3SPS = new BABYLON.SolidParticleSystem('ring3SPS', this.scene, { updatable: true });
        // const box3 = BABYLON.MeshBuilder.CreateBox(('box'), {
        //     width: width3,
        //     depth: depth3,
        //     height: height3
        // }, this.scene);

        // for (let theta = Math.PI / 2; theta < 2 * Math.PI + Math.PI / 2 - Math.PI / 200; theta += Math.PI / 200) {
        //     gtheta = theta;
        //     this.ring3SPS.addShape(box3, 1, { positionFunction: ring3PositionFunction });
        // }

        // this.mesh3 = this.ring3SPS.buildMesh();
        // this.mesh3.material = this.mat;

        // // dispose the model
        // box3.dispose();

        // this.ring3SPS.updateParticle = (particle) => {
        //     const myTheta = particle.idx * Math.PI / 200 + Math.PI / 2;
        //     const yy = this.audioService.fr256DataArray[particle.idx < 200 ? particle.idx : 200 - (particle.idx - 200)] / 350;

        //     // particle.scaling.x = .05 + yy * 2;
        //     // particle.position.x = (radius3 + yy * width3) * Math.cos(myTheta);
        //     // particle.position.z = (radius3 + yy * width3) * Math.sin(myTheta);
        //     // particle.rotation.y = -myTheta;
        // };


        // // BUILD RING4 SPS ////////////////////////////////

        // const ring4PositionFunction = (particle, i, s) => {
        //     particle.position.x = radius4 * Math.cos(gtheta);
        //     particle.position.z = radius4 * Math.sin(gtheta);
        //     particle.position.y = 0;
        //     particle.rotation.y = -gtheta;
        //     particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        // };

        // this.ring4SPS = new BABYLON.SolidParticleSystem('ring4SPS', this.scene, { updatable: true });
        // const box4 = BABYLON.MeshBuilder.CreateBox(('box'), {
        //     width: width4,
        //     depth: depth4,
        //     height: height4
        // }, this.scene);

        // for (let theta = Math.PI / 2; theta < 2 * Math.PI + Math.PI / 2 - Math.PI / 800; theta += Math.PI / 800) {
        //     gtheta = theta;
        //     this.ring4SPS.addShape(box4, 1, { positionFunction: ring4PositionFunction });
        // }

        // this.mesh4 = this.ring4SPS.buildMesh();
        // this.mesh4.material = this.mat;

        // // dispose the model
        // box4.dispose();

        // this.ring4SPS.updateParticle = (particle) => {
        //     const myTheta = particle.idx * Math.PI / 800 + Math.PI / 2;
        //     const yy = this.audioService.fr1024DataArray[particle.idx < 800 ? particle.idx : 800 - (particle.idx - 800)] / 350;

        //     // particle.scaling.x = .05 + yy * 2;
        //     // particle.position.x = (radius4 + yy * width4) * Math.cos(myTheta);
        //     // particle.position.z = (radius4 + yy * width4) * Math.sin(myTheta);
        //     // particle.rotation.y = -myTheta;
        // };

        // // BUILD RING5 SPS ////////////////////////////////

        // const ring5PositionFunction = (particle, i, s) => {
        //     particle.position.x = radius5 * Math.cos(gtheta);
        //     particle.position.z = radius5 * Math.sin(gtheta);
        //     particle.position.y = 0;
        //     particle.rotation.y = -gtheta;
        //     particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        // };

        // this.ring5SPS = new BABYLON.SolidParticleSystem('ring5SPS', this.scene, { updatable: true });
        // const box5 = BABYLON.MeshBuilder.CreateBox(('box'), {
        //     width: width5,
        //     depth: depth5,
        //     height: height5
        // }, this.scene);

        // for (let theta = Math.PI / 2; theta < 2 * Math.PI + Math.PI / 2 - Math.PI / 560; theta += Math.PI / 560) {
        //     gtheta = theta;
        //     this.ring5SPS.addShape(box5, 1, { positionFunction: ring5PositionFunction });
        // }

        // this.mesh5 = this.ring5SPS.buildMesh();
        // this.mesh5.material = this.mat;

        // // dispose the model
        // box5.dispose();

        // this.ring5SPS.updateParticle = (particle) => {
        //     const myTheta = particle.idx * Math.PI / 560 + Math.PI / 2;
        //     const yy = this.audioService.sample1[particle.idx < 560 ? particle.idx : 560 - (particle.idx - 560)] / 350;

        //     particle.scaling.x = .05 + yy * 2;
        //     particle.position.x = (radius5 + yy * width5) * Math.cos(myTheta);
        //     particle.position.z = (radius5 + yy * width5) * Math.sin(myTheta);
        //     particle.rotation.y = -myTheta;
        // };






    }

    update() { }

    remove() {
        this.ring1SPS.mesh.dispose();
        // this.ring2SPS.mesh.dispose();
        // this.ring3SPS.mesh.dispose();
        // this.ring4SPS.mesh.dispose();
        // this.ring5SPS.mesh.dispose();
        this.mesh1.dispose();
        // this.mesh2.dispose();
        // this.mesh3.dispose();
        // this.mesh4.dispose();
        // this.mesh5.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.8;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 1.0;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 1.0;
    }

}
