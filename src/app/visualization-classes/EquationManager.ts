
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

    // private wheel1Master;

    private cameraMoveDir;
    private thetaDelta;

    private SPS;
    private mesh;
    private mat;

    constructor(scene, audioService, optionsService, messageService, engineService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        // this.wheel1Master = new BABYLON.TransformNode('root');
        // this.wheel1Master.position = new BABYLON.Vector3(0, 0, 0);
        this.thetaDelta = 0;

        this.cameraMoveDir = .002;

        this.setDefaults();

        this.scene.registerBeforeRender(this.beforeRender);

    }

    beforeRender = () => {
        this.SPS.setParticles();
    }

    setDefaults() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

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
        const radius = 20;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = false;
        this.mat.specularColor = new BABYLON.Color3(.1, .1, .1);
        this.mat.ambientColor = new BABYLON.Color3(.25, .25, .25);

        const master = BABYLON.MeshBuilder.CreateBox(('box'), {
            height: 20,
            width: 20,
            depth: 20
        }, this.scene);

        const myPositionFunction = (particle, i, s) => {
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

        this.SPS.addShape(master, 512, { positionFunction: myPositionFunction });

        master.dispose();

        this.mesh = this.SPS.buildMesh();
        this.mesh.material = this.mat;


        this.SPS.updateParticle = (particle) => {
            const scalingDenom = 200;
            const radius = 200;

            let ringIndex = particle.idx % 64;
            let ring = Math.floor(particle.idx / 64);

            let theta = ringIndex * Math.PI / 32;

            let musicIndex = particle.idx;

            let y = this.audioService.sample1[musicIndex];
            y = (y / 200 * y / 200) * 255;

            particle.position.x = (1 + .15 * ring) * radius * Math.cos(theta + this.thetaDelta);
            particle.position.z = (1 + .15 * ring) * radius * Math.sin(theta + this.thetaDelta);
            particle.position.y = (1 - .15 * ring) * radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);


            // particle.position.x = (1 + .1 * ringIndex) * radius * Math.cos(theta + this.thetaDelta);
            // particle.position.z = (1 + .1 * ringIndex) * radius * Math.sin(theta + this.thetaDelta);
            // particle.position.y = (1 - .1 * ringIndex) * radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);
            particle.color.r = this.optionsService.colors(y).r / 255;
            particle.color.g = this.optionsService.colors(y).g / 255;
            particle.color.b = this.optionsService.colors(y).b / 255;

            particle.scaling.y = 1 + y / scalingDenom;

        };



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

        this.mesh.rotation.y += .01;

        this.thetaDelta += .011;
        if (this.thetaDelta > TwoPI) {
            this.thetaDelta -= TwoPI;
        }

    }

    remove() {

        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);

    }

}
