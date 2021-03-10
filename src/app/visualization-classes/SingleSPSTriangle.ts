
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

import { OnDestroy } from '@angular/core';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';

export class SingleSPSTriangle implements OnDestroy {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private colorsService: ColorsService;

    private ground;

    private SPS;

    theta = 0;
    material;
    pbr;

    constructor(scene: BABYLON.Scene, audioService: AudioService, optionsService: OptionsService, messageService: MessageService, engineService: EngineService, colorsService: ColorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;
        this.colorsService = colorsService;

        this.scene.registerBeforeRender(this.beforeRender);

        this.material = new BABYLON.StandardMaterial('ballMat', this.scene);
        this.material.maxSimultaneousLights = 8;
    }

    ngOnDestroy = (): void => {
        this.remove();
    }

    beforeRender = (): void => {
        this.scene.blockMaterialDirtyMechanism = true;

        this.SPS.setParticles();

        this.scene.blockMaterialDirtyMechanism = false;

    }

    create = (): void => {

        const myShape = [
            // new BABYLON.Vector3(-1, -1.732 / 2, 0),
            // new BABYLON.Vector3(1, -1.732 / 2, 0),
            // new BABYLON.Vector3(0, 1.732 / 2, 0),
            // new BABYLON.Vector3(-1, -1.732 / 2, 0)
            new BABYLON.Vector3(-1, -0.866, 0),
            new BABYLON.Vector3(1, -0.866, 0),
            new BABYLON.Vector3(0, 0.866, 0),
            new BABYLON.Vector3(-1, -0.866, 0)
        ];

        // myShape.push(myShape[0]);  // close profile

        const myPath = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 1)
        ];

        const extrusion = BABYLON.MeshBuilder.ExtrudeShape('star', { shape: myShape, path: myPath, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3 }, this.scene);

        extrusion.setPivotMatrix(BABYLON.Matrix.Identity());
        extrusion.convertToFlatShadedMesh();
        // extrusion.rotation.x = -Math.PI / 2;
        extrusion.rotation.x = -Math.PI * .5;

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

        const buildT = (): void => {
            // const radius = 500;
            // let theta;
            let x: number;
            let y: number;
            // let z;

            const innerPositionFunction = (particle, i) => {
                // console.log('In Build0 innerPosition for of notes.create', i);
                // const row = 10 - Math.floor(particle.idx / 10);
                // const column = particle.idx % 10;

                particle.scaling.x = .8;
                particle.scaling.y = .8;
                particle.scaling.z = .8;
                particle.position.x = x;
                particle.position.z = y;
                particle.position.y = 0;
                // particle.rotation.x = Math.PI / 2;
                particle.rotation.x = Math.PI * .5;
                particle.rotation.z = i % 2 ? Math.PI : 0;
            };

            // z = 0;
            for (let index = 0; index < 255; index++) {
                this.SPS.addShape(extrusion, 1, { positionFunction: innerPositionFunction });
                // z += 1 / 32;
            }
        };

        buildT();

        extrusion.dispose();

        this.SPS.updateParticle = (particle) => {

            const index = particle.idx + 1;

            const row = Math.ceil(Math.sqrt(index));
            const startingRowIndex = ((row - 1) * (row - 1) + 1);
            // const rowEndingIndex = row * row;
            const column = index - startingRowIndex;
            // items per row = (2 * row) - 1

            particle.color.r = ((index - startingRowIndex) % 2) ? 255 : 0;

            particle.position.x = (column - row) + 1;
            particle.position.z = -(row * 1.732) * .9;
            particle.position.z = particle.position.z + 1;

            particle.rotation.z = (index - startingRowIndex) % 2 ? Math.PI : 0;

            const y = this.audioService.sample2[particle.idx];

            // particle.scaling.z = -y / 180;
            particle.scaling.z = -y * .0055556;

            const c = this.colorsService.colors(y);

            // particle.color.r = c.r / 255;
            // particle.color.g = c.g / 255;
            // particle.color.b = c.b / 255;

            particle.color.r = c.r * .00392;
            particle.color.g = c.g * .00392;
            particle.color.b = c.b * .00392;

        }

        this.SPS.buildMesh();

        this.SPS.mesh.material = this.material;
        this.SPS.material = this.material;

        this.SPS.mesh.position.z = 300;

        this.SPS.mesh.scaling.x = 20;
        this.SPS.mesh.scaling.y = 20;
        this.SPS.mesh.scaling.z = 20;

    }

    update = (): void => {
        this.engineService.lightParent.rotation.x += .004;
        this.engineService.lightParent.rotation.y -= .006;
        this.engineService.lightParent.rotation.z += .008;
    }

    remove(): void {
        this.engineService.scene.activeCamera = this.engineService.camera1;

        this.engineService.lightParent.rotation.x = 0;
        this.engineService.lightParent.rotation.y = 0;
        this.engineService.lightParent.rotation.z = 0;

        this.SPS.mesh.dispose();
        this.SPS.dispose();
        this.SPS = null; // tells the GC the reference can be cleaned up also

        this.scene.unregisterBeforeRender(this.beforeRender);

        this.audioService = null;
        this.engineService = null;
        this.colorsService = null;
        this.scene = null;

    }
}
