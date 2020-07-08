
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

export class BlockPlaneManager {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;
    private colorsService: ColorsService;

    private SPS;
    private mesh;
    private mat;

    private y;
    private c;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {
        console.log('Block Plane Class Constructor');
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.colorsService = colorsService;

        this.setDefaults();

        this.scene.registerBeforeRender(this.beforeRender);
    }

    setDefaults() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = 1.00;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;
    }

    beforeRender = () => {
        this.SPS.setParticles();
    }

    create() {
        console.log('in Block Plane Create');
        let z: number;
        let x: number;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = false;
        this.mat.specularColor = new BABYLON.Color3(.1, .1, .1);
        this.mat.ambientColor = new BABYLON.Color3(.25, .25, .25);


        const myPositionFunction = (particle, i, s) => {
            particle.position.x = (x - 31.5) * 30;
            particle.position.z = (z - 5) * 60;
            particle.position.y = 0;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

        for (z = (this.audioService.sample1.length / 64); z >= 0; z--) {  // 8
            for (x = 0; x < 64; x++) { // 9 * 64 = 576
                const box = BABYLON.MeshBuilder.CreateBox(('box'), {
                    width: 25,
                    depth: 50
                }, this.scene);

                this.SPS.addShape(box, 1, { positionFunction: myPositionFunction });
                box.dispose();
            }
        }

        this.mesh = this.SPS.buildMesh();
        this.mesh.material = this.mat;
        this.mesh.scaling.x = .4;
        this.mesh.scaling.z = .4;

        this.SPS.updateParticle = (particle) => {

            this.y = this.audioService.sample1[particle.idx];
            this.y = (this.y / 200 * this.y / 200) * 255;

            particle.scaling.y = this.y * .1 + .4;
            particle.position.y = particle.scaling.y / 2;

            this.c = this.colorsService.colors(this.y);

            particle.color.r = this.c.r / 255;
            particle.color.g = this.c.g / 255;
            particle.color.b = this.c.b / 255;

        };
    }

    update() {
    }

    remove() {
        console.log('Block Plane Manager - In Remove');
        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.SPS.dispose();
        this.SPS = null; // tells the GC the reference can be cleaned up also
        this.scene.unregisterBeforeRender(this.beforeRender);
    }


}
