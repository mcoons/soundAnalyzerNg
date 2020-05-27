
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';

export class BlockSpiralManager {
    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private SPS;
    private mesh;
    private mat;
    private rotation = 0;

    constructor(scene, audioService, optionsService, messageService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, -50, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = 1.00;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 400;

        this.optionsService.smoothingConstant = 9;
        this.optionsService.sampleGain = 10;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');

        this.scene.registerBeforeRender(this.beforeRender);
    }


    beforeRender = () => {
        this.SPS.setParticles();

        this.rotation += Math.PI / 1000;
        if (this.rotation >= Math.PI * 2) {
            this.rotation = 0;
        }
        this.SPS.mesh.rotation.y = this.rotation;
    }

    create() {

        const PI = Math.PI;
        const PId32 = PI / 32;

        let radius = 20;
        let gtheta: number;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = false;
        // this.mat.specularColor = new BABYLON.Color3(.5, .5, .5);
        // this.mat.ambientColor = new BABYLON.Color3(.6, .6, .6);

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

        this.SPS.updateParticle = (particle) => {
            let y = (this.audioService.sample1[particle.idx]);
            y = (y / 255 * y / 255) * 255;

            particle.scaling.y = .05 + y / 17;
            particle.position.y = particle.scaling.y / 2 - particle.idx / 16; // + 30;

            particle.color.r = this.optionsService.colors(y).r / 255;
            particle.color.g = this.optionsService.colors(y).g / 255;
            particle.color.b = this.optionsService.colors(y).b / 255;
        };
    }

    update() {
        // const PI = Math.PI;
        // const TwoPI = PI * 2;

        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha += .001;
        // if ((this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha >= TwoPI) {
        //     (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha -= TwoPI;
        // }
    }

    remove() {
        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);
    }

}
