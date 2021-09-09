import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

import { OnDestroy } from '@angular/core';
import { OptionsService } from '../services/options/options.service';

import { MessageService } from '../services/message/message.service';

export class Lights implements OnDestroy {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private colorsService: ColorsService;
    private optionsService: OptionsService;

    masterParent = new BABYLON.TransformNode('mainParent');


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

        // ADD PARTICLES

        for (let count = 0; count < 7 * 32; count++) {

            this.columnGroup = Math.trunc(count / 32);
            this.row = count % 32;

            this.mat = new BABYLON.StandardMaterial('ballMat', this.scene);
            this.mat.maxSimultaneousLights = 8;
            this.mat.diffuseColor = BABYLON.Color3.FromHexString('#555577');
            this.mat.emissiveColor = BABYLON.Color3.FromHexString('##000000');

            const tmpMesh = BABYLON.Mesh.CreateSphere("torusLight-" + count, 32, .5, this.scene);
            tmpMesh.material = this.mat;

            tmpMesh.position.x = 10 * this.columnGroup - 30;
            tmpMesh.position.y = 10 * this.row - 155;
            tmpMesh.position.z = -10;

            tmpMesh.scaling.x = 10;
            tmpMesh.scaling.y = 10;
            tmpMesh.scaling.z = 10;

            tmpMesh.setParent(this.masterParent);
            this.engineService.renderTargetTexture.renderList.push(tmpMesh);
            this.particles.push(tmpMesh);

        }

        // GROUND

        const groundMaterial = new BABYLON.StandardMaterial('groundMat', this.scene);
        groundMaterial.maxSimultaneousLights = 8;
        groundMaterial.diffuseColor = new BABYLON.Color3(.1, 0, .45);

        this.tmpMesh = BABYLON.MeshBuilder.CreatePlane('GROUND', { height: 140, width: 640 }, this.scene);
        this.tmpMesh.material = groundMaterial;

        this.tmpMesh.position.z = -7.5;
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


        this.particles.forEach((p, i) => {

            this.columnGroup = Math.trunc(i * 0.03125);

            this.y = this.audioService.sample2[i];
            this.y = (this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255 * this.y / 255) * 255 * 4 * (this.columnGroup + 1);

            p.material.emissiveColor.r = this.y * .004;
            p.material.emissiveColor.g = this.y * .004;
            p.material.emissiveColor.b = this.y * .004;
        });

    }

    remove(): void {
        this.engineService.glowLayer.isEnabled = false;

        this.tmpMesh.dispose();

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
