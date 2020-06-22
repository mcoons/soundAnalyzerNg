
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

export class SingleSPS {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;
    private engineService: EngineService;
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
    private rotation;

    private scalingDenom;
    private radius;

    private currentSPS;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.engineService = engineService;
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

        this.scalingDenom = 100;
        this.radius = 200;
        this.rotation = 0;

        this.currentSPS = 2;

    }

    SPSFunctions = [

        // Block Plane
        {
            position: (particle, yy) => {
                const row = Math.floor(particle.idx / 64);
                const column = particle.idx % 64;

                const x = (column - 31.5) * 30;
                const z = (row - 5) * 60;
                const y = particle.scaling.y / 2;

                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                const x = 20;
                const y = 20 * (yy * .02 + .1);
                const z = 40;
                return new BABYLON.Vector3(x, y, z);
            },
            mainUpdate: () => null
        },

        // Block Spiral
        {
            position: (particle) => {
                // console.log('In position');
                const gtheta = this.PId32 * particle.idx;
                const radius = 20 + .12 * particle.idx;

                const x = radius * Math.cos(gtheta);
                const z = radius * Math.sin(gtheta);
                const y = particle.scaling.y / 2 - particle.idx / 16;

                particle.rotation.y = -gtheta;

                return new BABYLON.Vector3(x, y, z);
            },

            scaling: (particle, yy) => {
                // console.log('In scaling');
                const radius = 20 + .12 * particle.idx;

                const x = 6;
                const y = .05 + yy / 17;
                const z = radius / 12;
                return new BABYLON.Vector3(x, y, z);
            },

            mainUpdate: () => {
                // console.log('In mainUpdate');

                if (this.optionsService.animateCamera) {
                    this.rotation += Math.PI / 1000;
                    if (this.rotation >= Math.PI * 2) {
                        this.rotation = 0;
                    }
                    this.SPS.mesh.rotation.y = this.rotation;
                }

                this.engineService.highlightLayer.removeMesh(this.mesh);
                this.engineService.highlightLayer.addMesh(this.mesh,
                    new BABYLON.Color3( this.colorsService.colors(128).r / 255,
                                        this.colorsService.colors(128).g / 255,
                                        this.colorsService.colors(128).b / 255));
            }

        },

        // Cube
        {
            position: (particle, yy) => {

                const x = ((particle.idx % 9) - 4) * 30;
                const z = ((Math.floor(particle.idx / 9) % 8) - 3.5) * 30;
                const y = ((Math.floor(particle.idx / 72)) - 3.5) * 30;

                return new BABYLON.Vector3(x, y, z);
            },

            scaling: (particle, yy) => {
                // return new BABYLON.Vector3(x, y, z);
                return new BABYLON.Vector3(20, 20, 20);

            },

            mainUpdate: () => null

        },

        // Equation
        {
            position: (particle) => {
                const ring = Math.floor(particle.idx / 64);
                const ringIndex = particle.idx % 64;
                const theta = ringIndex * Math.PI / 32;

                const x = (1 + .15 * ring) * this.radius * Math.cos(theta + this.thetaDelta);
                const z = (1 + .15 * ring) * this.radius * Math.sin(theta + this.thetaDelta);
                const y = (1 - .15 * ring) * this.radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);

                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                const x = 20;
                const z = 20;
                const y = 20 * (1 + yy / this.scalingDenom);
                return new BABYLON.Vector3(x, y, z);
            },
            mainUpdate: () => {
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
        },

        // Error
        {
            position: (particle) => {
                const row = Math.floor(particle.idx / 64);
                const column = particle.idx % 64;

                const x = (column - 31.5) * 30;
                const z = (row - 5) * 60;
                const y = particle.scaling.y / 2;

                return new BABYLON.Vector3(x, y, 1);
            },
            scaling: (particle, yy) => {
                const y = yy * .2 + .1;
                return new BABYLON.Vector3(1, y, 1);
            },
            mainUpdate: () => null
        }
    ];



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
            height: 1,
            width: 1,
            depth: 1
        }, this.scene);

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });
        this.SPS.addShape(master, 512 + 64);

        master.dispose();

        this.mesh = this.SPS.buildMesh();
        this.mesh.material = this.mat;

        // //////////////////////////

        this.SPS.updateParticle = (particle) => {
            let y = this.audioService.sample1[particle.idx];
            y = (y / 200 * y / 200) * 255;


            particle.scaling.x = this.SPSFunctions[this.currentSPS].scaling(particle, y).x;
            particle.scaling.y = this.SPSFunctions[this.currentSPS].scaling(particle, y).y;
            particle.scaling.z = this.SPSFunctions[this.currentSPS].scaling(particle, y).z;


            particle.position.x = this.SPSFunctions[this.currentSPS].position(particle, y).x;
            particle.position.y = this.SPSFunctions[this.currentSPS].position(particle, y).y;
            particle.position.z = this.SPSFunctions[this.currentSPS].position(particle, y).z;

            particle.color.r = this.colorsService.colors(y).r / 255;
            particle.color.g = this.colorsService.colors(y).g / 255;
            particle.color.b = this.colorsService.colors(y).b / 255;
        };
    }

    update() {
        this.SPSFunctions[this.currentSPS].mainUpdate();
    }

    remove() {
        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);
    }

}
