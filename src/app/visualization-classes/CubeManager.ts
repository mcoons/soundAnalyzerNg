
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { map } from './utilities.js';

export class CubeManager {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private SPS;
    private mesh;
    private mat;

    private y;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        this.setDefaults();

        this.scene.registerBeforeRender(this.beforeRender);
    }

    setDefaults() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = -40;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = Math.PI / 2;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = Math.PI / 2;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;
    }

    beforeRender = () => {
        this.SPS.setParticles();
    }

    create() {
        let x: number;
        let y: number;
        let z: number;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = true;
        this.mat.forceDepthWrite = true;
        this.mat.specularColor = new BABYLON.Color3(.1, .1, .1);

        const myPositionFunction = (particle, i, s) => {
            particle.position.x = (x - 4.5) * 80;  // 80
            particle.position.y = (y - 3) * 80;  // 80
            particle.position.z = (z - 3.5) * 80;  // 80
            particle.color = new BABYLON.Color4(.5, .5, .5, .1);
            particle.hasVertexAlpha = true;
        };

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

        const box = BABYLON.MeshBuilder.CreateBox(('box'), {
            width: 30,
            depth: 30,
            height: 30
        }, this.scene);

        for (y = 0; y <= 8; y++) { // 9 * 64 = 576
            for (x = 0; x <= 9; x++) { // 9 * 64 = 576
                for (z = 0; z <= 7; z++) {
                    this.SPS.addShape(box, 1, { positionFunction: myPositionFunction });
                }
            }
        }
        box.dispose();

        this.mesh = this.SPS.buildMesh();
        this.mesh.material = this.mat;
        this.SPS.mesh.hasVertexAlpha = true;

        this.SPS.updateParticle = (particle) => {
            this.y = this.audioService.sample1[particle.idx] * 1.05;
            this.y = (this.y / 155 * this.y / 155) * 255;

            particle.scaling.x = this.y / 160;
            particle.scaling.y = this.y / 160;
            particle.scaling.z = this.y / 160;

            // const r = this.y * map(particle.position.x, -360, 360, .2, 1) / 255;
            // const g = this.y * map(particle.position.y, -240, 400, .2, 1) / 255;
            // const b = this.y * map(particle.position.z, -280, 280, .2, 1) / 255;

            // particle.color = new BABYLON.Color4(r, g, b, 1 - ((this.y / 255) * (this.y / 255)) / 255);
            // particle.color = new BABYLON.Color4(r, g, b, 1 - this.y / 255);
            particle.color.r = this.y * map(particle.position.x, -360, 360, .2, 1) / 255;
            particle.color.g = this.y * map(particle.position.y, -240, 400, .2, 1) / 255;
            particle.color.b = this.y * map(particle.position.z, -280, 280, .2, 1) / 255;
            particle.color.a =  1 - this.y / 255;
        };
    }

    update() { }

    remove() {
        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.SPS.dispose();
        this.SPS = null; // tells the GC the reference can be cleaned up also
        this.scene.unregisterBeforeRender(this.beforeRender);
    }
}
