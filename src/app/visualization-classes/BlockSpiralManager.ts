
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

export class BlockSpiralManager {
    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;
    private engineService: EngineService;
    private colorsService: ColorsService;

    private SPS;
    private mesh;
    private mat;
    private rotation = 0;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.engineService = engineService;
        this.colorsService = colorsService;

        this.setDefaults();

        this.scene.registerBeforeRender(this.beforeRender);
    }

    setDefaults() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = -50;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = 1.00;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;
    }

    beforeRender = () => {
        this.SPS.setParticles();

        if (this.optionsService.animateCamera) {
            this.rotation += Math.PI / 1000;
            if (this.rotation >= Math.PI * 2) {
                this.rotation = 0;
            }
            this.SPS.mesh.rotation.y = this.rotation;
        }

        this.engineService.highlightLayer.removeMesh(this.mesh);
        this.engineService.highlightLayer.addMesh(this.mesh,
            new BABYLON.Color3(this.colorsService.colors(128).r / 255,
                this.colorsService.colors(128).g / 255,
                this.colorsService.colors(128).b / 255));
    }

    create() {

        const PI = Math.PI;
        const PId32 = PI / 32;

        let radius = 20;
        let gtheta: number;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = false;
        this.mat.specularColor = new BABYLON.Color3(0, 0, 0);
        this.mat.ambientColor = new BABYLON.Color3(.6, .6, .6);

        const myPositionFunction = (particle, i, s) => {
            particle.position.x = radius * Math.cos(gtheta);
            particle.position.z = radius * Math.sin(gtheta);
            particle.position.y = 50;
            particle.rotation.y = -gtheta;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

        for (let theta = 0; theta < 17 * PI; theta += PId32) { // 512 items ---  256*2    128*4    64*8
            gtheta = theta;
            const box = BABYLON.MeshBuilder.CreateBox(('box'), {
                width: 6,
                depth: radius / 12
            }, this.scene);
            this.SPS.addShape(box, 1, { positionFunction: myPositionFunction });

            radius += .12;
            box.dispose();
        }

        this.mesh = this.SPS.buildMesh();
        this.mesh.material = this.mat;
        this.mesh.scaling.x = 3;
        this.mesh.scaling.y = 3;
        this.mesh.scaling.z = 3;

        this.SPS.updateParticle = (particle) => {

            let y = this.audioService.sample1[particle.idx];
            y = (y / 255 * y / 255) * 255;

            particle.scaling.y = .05 + y / 17;
            particle.position.y = particle.scaling.y / 2 - particle.idx / 16; // + 30;

            particle.color.r = this.colorsService.colors(y).r / 255;
            particle.color.g = this.colorsService.colors(y).g / 255;
            particle.color.b = this.colorsService.colors(y).b / 255;

        };
    }

    update() { }

    remove() {
        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);
    }

}
