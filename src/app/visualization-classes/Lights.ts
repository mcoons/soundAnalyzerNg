import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

import { OnDestroy } from '@angular/core';
import { OptionsService } from '../services/options/options.service';

// import { map } from './utilities.js';
import { MessageService } from '../services/message/message.service';

export class Lights implements OnDestroy {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private colorsService: ColorsService;
    private optionsService: OptionsService;

    masterParent = new BABYLON.TransformNode('mainParent');

    // nbPoints = 3;                     // the number of points between each Vector3 control points
    // closed = false;                     // closes the curve when true
    // index = 0;
    // yy = 0;
    // theta = 0;
    // mesh1;

    tmpMesh;
    mat;
    mat2;
    y;
    c;


    particles = [];
    staticMeshes = [];
    columnGroup;
    row;
    audioSource;

    // private SPS;

    constructor(scene: BABYLON.Scene, audioService: AudioService, optionsService: OptionsService, messageService: MessageService, engineService: EngineService, colorsService: ColorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;
        this.colorsService = colorsService;
        this.optionsService = optionsService;

        this.scene.registerBeforeRender(this.beforeRender);
    }

    beforeRender = (): void => {
        // this.SPS.setParticles();
    }

    ngOnDestroy = (): void => {
        this.remove();
    }

    create(): void {


        this.mat = new BABYLON.StandardMaterial('ballMat', this.scene);
        this.mat.maxSimultaneousLights = 8;
        this.mat.diffuseColor = BABYLON.Color3.FromHexString('#777777');
        this.mat.emissiveColor = BABYLON.Color3.FromHexString('##000000');

        this.mat2 = new BABYLON.StandardMaterial('envMat', this.scene);
        this.mat2.diffuseColor = BABYLON.Color3.FromHexString('#999999');

        // this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

        // const innerPositionFunction = (particle, i, s) => {
        //     columnGroup = Math.trunc(particle.idx / 32);
        //     row = particle.idx % 32;

        //     this.tmpMesh = BABYLON.MeshBuilder.CreateCylinder('Box-' + columnGroup + '-' + row, { height: 3, diameter: 35, tessellation: 8 }, this.scene);
        //     this.tmpMesh.position.x = 100 * columnGroup - 300;
        //     this.tmpMesh.position.y = 20 * row - 320 - 10;
        //     this.tmpMesh.material = this.mat;
        //     this.tmpMesh.convertToFlatShadedMesh();

        //     this.staticMeshes.push(this.tmpMesh);
        // };






        //  UPDATE

        // this.SPS.updateParticle = (particle) => { // 224 particles

        //     columnGroup = Math.trunc(particle.idx / 32);
        //     row = particle.idx % 32;
        //     //  5 = 5 ,  20 = 20

        //     let i = columnGroup;
        //     // console.log(particle.idx, columnGroup, row) 
        //     this.y = this.audioService.sample2[particle.idx];
        //     // if (columnGroup > 5) {
        //     //     this.y = this.audioService.sample2[particle.idx - 16];
        //     // }

        //     switch (columnGroup) {
        //         case 0:
        //             this.y = (this.y / 220 * this.y / 220 * this.y / 220 * this.y / 220 * this.y / 220) * 255 * 5;
        //             // this.y = 255;
        //             break;
        //         case 1:
        //             this.y = (this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255) * 255 * 7 * columnGroup;
        //             break;
        //         case 2:
        //             this.y = (this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255) * 255 * 7 * columnGroup;
        //             break;
        //         case 3:
        //             this.y = (this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255) * 255 * 7 * columnGroup;
        //             break;
        //         case 4:
        //             this.y = (this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255) * 255 * 7 * columnGroup;
        //             break;
        //         case 5:
        //             this.y = (this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255) * 255 * 7 * columnGroup;
        //             break;
        //         case 6:
        //             this.y = (this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255) * 255 * 7 * columnGroup;
        //             break;

        //         // case 7:
        //         //     // this.y = (this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255) * 255 * 7 * columnGroup;
        //         //     break;


        //         default:
        //             break;
        //     }

        //     // this.y = Math.pow(this.y / (columnGroup === 6 ? 190 : 210), (8 - columnGroup / 2)) * (800 - (columnGroup === 6 ? 170 : 180) * columnGroup);
        //     // console.log(this.audioService);
        //     // console.log(this.y);
        //     // this.y = (this.y / 200 * this.y / 200 * this.y / 200 * this.y / 200) * (255 - 10 * columnGroup ) * 10 * columnGroup;
        //     // this.y = Math.pow(this.y / (210 - 4 * i), (8 - i / 2)) * (800 - 180 * i);

        //     this.c = this.colorsService.colors(this.y);

        //     // this.c = 100;

        //     // console.log(this.c); 

        //     particle.color.r = this.c.r / 240;
        //     particle.color.g = this.c.g / 240;
        //     particle.color.b = this.c.b / 240;


        //     // particle.emissiveColor.r = this.c.r / 240;
        //     // particle.emissiveColor.g = this.c.g / 240;
        //     // particle.emissiveColor.b = this.c.b / 240;

        //     // this.s = this.y / 40 + .5;
        //     particle.position.x = 100 * columnGroup - 300;
        //     // particle.position.z = (z - 9) * 80;
        //     particle.position.y = 20 * row - 320

        //     particle.scale.x = 10;
        //     particle.scale.y = 10;
        //     particle.scale.z = 10;

        //     if (particle.idx === 0) {
        //         particle.color = BABYLON.Color3.Red;
        //     }
        // };



        // ADD PARTICLES

        for (let count = 0; count < 7 * 32; count++) {

            this.columnGroup = Math.trunc(count / 32);
            this.row = count % 32;

            this.mat = new BABYLON.StandardMaterial('ballMat', this.scene);
            this.mat.maxSimultaneousLights = 8;
            this.mat.diffuseColor = BABYLON.Color3.FromHexString('#555577');
            this.mat.emissiveColor = BABYLON.Color3.FromHexString('##000000');

            // this.tmpMesh = BABYLON.MeshBuilder.CreateTarus('balls1-' + count, { diameter: 5, segments: 16, updatable: true }, this.scene);

            // let tmpMesh = BABYLON.Mesh.CreateTorus("torusLight-" + count, 4, 1, 32, this.scene);
            const tmpMesh = BABYLON.Mesh.CreateSphere("torusLight-" + count, 32, .5, this.scene);
            tmpMesh.material = this.mat;

            // this.s = this.y / 40 + .5;
            tmpMesh.position.x = 10 * this.columnGroup - 30;
            // tmpMesh.position.z = (z - 9) * 80;
            tmpMesh.position.y = 10 * this.row - 155;
            tmpMesh.position.z = -10;

            tmpMesh.scaling.x = 10;
            tmpMesh.scaling.y = 10;
            tmpMesh.scaling.z = 10;

            tmpMesh.setParent(this.masterParent);
            this.engineService.renderTargetTexture.renderList.push(tmpMesh);
            this.particles.push(tmpMesh);

        }


        // this.SPS.buildMesh();

        // this.SPS.mesh.material = this.mat;
        // this.SPS.material = this.mat;

        // this.engineService.renderTargetTexture.renderList.push(this.SPS.mesh);


        // BABYLON.Mesh.CreateTorus("torusLight-", 4, 1, 32, this.scene);



        // ENVIRONNMENT
        // LOOP 7

        // for (let x = -150; x <= 150; x += 50) {

        //     this.tmpMesh = BABYLON.MeshBuilder.CreateCylinder('cyl', { height: 320, diameter: 4 })
        //     // this.tmpMesh = BABYLON.MeshBuilder.CreateBox('Box-' + columnGroup + '-' +row, { height: 320, width: 4, depth: 4 }, this.scene);
        //     this.tmpMesh.position.x = x - 10;
        //     this.tmpMesh.position.z = 10;
        //     this.tmpMesh.position.y = -10;
        //     this.tmpMesh.material = this.mat2;
        //     this.tmpMesh.convertToFlatShadedMesh();
        //     this.tmpMesh.rotation.y = Math.PI / 4;
        //     this.staticMeshes.push(this.tmpMesh);

        //     // this.tmpMesh = BABYLON.MeshBuilder.CreateBox('Box-' + columnGroup + '-' +row, { height: 320, width: 4, depth: 4 }, this.scene);
        //     this.tmpMesh = BABYLON.MeshBuilder.CreateCylinder('cyl', { height: 320, diameter: 4 })
        //     this.tmpMesh.position.x = x + 10;
        //     this.tmpMesh.position.z = 10;
        //     this.tmpMesh.position.y = -10;
        //     this.tmpMesh.material = this.mat2;
        //     this.tmpMesh.convertToFlatShadedMesh();
        //     this.tmpMesh.rotation.y = Math.PI / 4;
        //     this.staticMeshes.push(this.tmpMesh);

        //     // this.tmpMesh = BABYLON.MeshBuilder.CreateBox('Box-' + columnGroup + '-' +row, { height: 320, width: 4, depth: 4 }, this.scene);
        //     this.tmpMesh = BABYLON.MeshBuilder.CreateCylinder('cyl', { height: 320, diameter: 4 })
        //     this.tmpMesh.position.x = x + 10;
        //     this.tmpMesh.position.z = -10;
        //     this.tmpMesh.position.y = -10;
        //     this.tmpMesh.material = this.mat2;
        //     this.tmpMesh.convertToFlatShadedMesh();
        //     this.tmpMesh.rotation.y = Math.PI / 4;
        //     this.staticMeshes.push(this.tmpMesh);

        //     // this.tmpMesh = BABYLON.MeshBuilder.CreateBox('Box-' + columnGroup + '-' +row, { height: 320, width: 4, depth: 4 }, this.scene);
        //     this.tmpMesh = BABYLON.MeshBuilder.CreateCylinder('cyl', { height: 320, diameter: 4 })
        //     this.tmpMesh.position.x = x - 10;
        //     this.tmpMesh.position.z = -10;
        //     this.tmpMesh.position.y = -10;
        //     this.tmpMesh.material = this.mat2;
        //     this.tmpMesh.convertToFlatShadedMesh();
        //     this.tmpMesh.rotation.y = Math.PI / 4;
        //     this.staticMeshes.push(this.tmpMesh);


        //     // this.tmpMesh = BABYLON.MeshBuilder.CreateBox('Box-' + x, { height: 320, width: 15, depth: 15 }, this.scene);
        //     // this.tmpMesh.position.x = x;
        //     // this.tmpMesh.position.z = 0;
        //     // this.tmpMesh.position.y = -10;
        //     // this.tmpMesh.material = this.mat2;
        //     // this.tmpMesh.convertToFlatShadedMesh();
        //     // this.tmpMesh.rotation.y = Math.PI / 4;
        //     // this.staticMeshes.push(this.tmpMesh);


        //     this.tmpMesh = BABYLON.MeshBuilder.CreateBox('Box-' + x, { height: 10.5, width: 50, depth: 50 }, this.scene);
        //     this.tmpMesh.position.x = x;
        //     this.tmpMesh.position.y = 155;
        //     this.tmpMesh.material = this.mat2;
        //     this.tmpMesh.convertToFlatShadedMesh();
        //     this.staticMeshes.push(this.tmpMesh);


        //     this.tmpMesh = BABYLON.MeshBuilder.CreateBox('Box-' + x, { height: 10.5, width: 50, depth: 50 }, this.scene);
        //     this.tmpMesh.position.x = x;
        //     this.tmpMesh.position.y = -175;
        //     this.tmpMesh.material = this.mat2;
        //     this.tmpMesh.convertToFlatShadedMesh();
        //     this.staticMeshes.push(this.tmpMesh);

        // }

        // GROUND

        const groundMaterial = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMaterial.maxSimultaneousLights = 8;
        groundMaterial.diffuseColor = new BABYLON.Color3(.1, 0, .45);
        // groundMaterial.bumpTexture = new BABYLON.Texture('../../assets/mats/normal2.jpg', this.scene);
        // groundMaterial.bumpTexture.uScale = 20;
        // groundMaterial.bumpTexture.vScale = 20;   
        // groundMaterial.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse2.jpg', this.scene);
        // groundMaterial.diffuseTexture.uScale = 20;
        // groundMaterial.diffuseTexture.vScale = 20;   
        // groundMaterial.emissiveTexture = new BABYLON.Texture('../../assets/mats/normal.jpg', this.scene);
        // groundMaterial.emissiveTexture.uScale = i*2;
        // groundMaterial.emissiveTexture.vScale = i*2;   
        this.tmpMesh = BABYLON.MeshBuilder.CreatePlane('GROUND', { height: 140, width: 640 }, this.scene);
        this.tmpMesh.material = groundMaterial;
        // this.tmpMesh.rotation.x = Math.PI / 2;
        // this.tmpMesh.position.y = -344;
        this.tmpMesh.position.z = -7.5;
        // this.tmpMesh.convertToFlatShadedMesh();
        this.staticMeshes.push(this.tmpMesh);


        this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('SKY', { diameter: 10000 }, this.scene);
        const skyMaterial = new BABYLON.StandardMaterial('groundMat', this.scene);
        skyMaterial.diffuseColor = BABYLON.Color3.Black();
        skyMaterial.backFaceCulling = false;
        this.tmpMesh.material = skyMaterial;
        this.staticMeshes.push(this.tmpMesh);

        this.masterParent.rotation.z = Math.PI / 2;

        this.engineService.glowLayer.isEnabled = true;

    }

    update(): void {
        // this.engineService.lightParent.rotation.x += .004;
        // this.engineService.lightParent.rotation.y -= .006;
        // this.engineService.lightParent.rotation.z += .008;

        // if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].autoRotate.value) {
        //     // this.masterParent.rotation.x += .03;
        //     this.masterParent.rotation.y += .01;
        //     // this.masterParent.rotation.z += .01;
        // }
        // console.log(this.particles);

        this.particles.forEach((p, i) => {

            this.columnGroup = Math.trunc(i / 32);
            // this.row = i % 32;

            this.y = this.audioService.sample2[i];
            this.y = (this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255) * 255 * 4 * (this.columnGroup + 1);

            p.material.emissiveColor.r = this.y / 250;
            p.material.emissiveColor.g = this.y / 250;
            p.material.emissiveColor.b = this.y / 250;
        });

    }

    remove(): void {
        this.engineService.glowLayer.isEnabled = false;

        // this.SPS.mesh.dispose();
        this.tmpMesh.dispose();
        // this.SPS.dispose();
        // this.SPS = null; // tells the GC the reference can be cleaned up also

        this.engineService.scene.activeCamera = this.engineService.camera1;

        this.scene.unregisterBeforeRender(this.beforeRender);

        this.staticMeshes.forEach(m => m.dispose());
        this.particles.forEach(m => m.dispose());

        this.audioService = null;
        this.engineService = null;
        this.colorsService = null;
        this.optionsService = null;
        this.scene = null;
    }

}
