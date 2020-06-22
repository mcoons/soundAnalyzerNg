
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

export class EquationManager {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;
    private colorsService: ColorsService;

    private cameraMoveDir;
    private cameraDelta;
    private cameraBeta;
    private thetaDelta;

    private SPS;
    private mesh;
    private mat;


    private PI;
    private TwoPI;
    private PId2;
    private PId32;
    private loopMax;

    private scalingDenom;
    private radius;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        console.log('from eqMan');
        console.log(colorsService);

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.colorsService = colorsService;

        this.thetaDelta = 0;
        this.cameraDelta = 0;

        this.cameraMoveDir = .002;

        this.setDefaults();

        this.scene.registerBeforeRender(this.beforeRender);

        this.PI = Math.PI;
        this.TwoPI = this.PI * 2;
        this.PId2 = this.PI / 2;
        this.PId32 = this.PI / 32;

        this.scalingDenom = 200;
        this.radius = 200;

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

            let ringIndex = particle.idx % 64;
            let ring = Math.floor(particle.idx / 64);

            let theta = ringIndex * Math.PI / 32;

            let musicIndex = particle.idx;

            let y = this.audioService.sample1[musicIndex];
            y = (y / 200 * y / 200) * 255;

            particle.position.x = (1 + .15 * ring) * this.radius * Math.cos(theta + this.thetaDelta);
            particle.position.z = (1 + .15 * ring) * this.radius * Math.sin(theta + this.thetaDelta);
            particle.position.y = (1 - .15 * ring) * this.radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);

            particle.color.r = this.colorsService.colors(y).r / 255;
            particle.color.g = this.colorsService.colors(y).g / 255;
            particle.color.b = this.colorsService.colors(y).b / 255;

            particle.scaling.y = 1 + y / this.scalingDenom;

        };

    }

    update() {

        if (this.optionsService.animateCamera) {
            this.cameraBeta = Math.PI * (Math.sin(this.cameraDelta) / 2 + .5);

            (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = this.cameraBeta;

            this.cameraDelta += .001;
            if (this.cameraDelta > this.TwoPI) {
                this.cameraDelta -= this.TwoPI;
            }
        }

        this.mesh.rotation.y += .01;

        this.thetaDelta += .011;

        if (this.thetaDelta > this.TwoPI) {
            this.thetaDelta -= this.TwoPI;
        }

    }

    remove() {

        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);

    }

}
