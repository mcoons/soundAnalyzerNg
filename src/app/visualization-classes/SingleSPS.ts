
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';
import { map } from '../visualization-classes/utilities.js';
// import { prepareSyntheticListenerFunctionName } from '@angular/compiler/src/render3/util';

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
    private TwoPId576;
    private PId2;
    private PId32;
    private loopMax;
    private rotation;

    private scalingDenom;
    private radius;

    private currentSPS;
    private nextSPS;

    private expanding = false;
    private contracting = false;
    private expInt;
    private conInt;
    private expTimer = 0;
    private conTimer = 0;
    private expTimeout = null;
    private conTimeout = null;

    private theta;

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

        this.PI = Math.PI;
        this.TwoPI = this.PI * 2;
        this.PId2 = this.PI / 2;
        this.PId32 = this.PI / 32;
        this.TwoPId576 = 2 * this.PI / 576;

        this.scalingDenom = 100;
        this.radius = 40;
        this.rotation = 0;

        this.currentSPS = 5;
        this.nextSPS = 6;

        this.setDefaults();

        this.scene.registerBeforeRender(this.beforeRender);
        setTimeout(this.startExpanding, this.optionsService.singleSPSDelay * 1000);

    }

    SPSFunctions = [

        // Block Plane
        {
            position: (particle, yy) => {
                const row = 9 - Math.floor(particle.idx / 64);
                const column = particle.idx % 64;
                const x = (column - 31.5) * 3;
                const z = (row - 5) * 10;
                const y = particle.scaling.y / 2;
                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                const x = 2.5;
                const y = 15 * yy / 255 + .5;
                const z = 9;
                return new BABYLON.Vector3(x, y, z);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy) => {
                const r = this.colorsService.colors(yy).r / 255;
                const g = this.colorsService.colors(yy).g / 255;
                const b = this.colorsService.colors(yy).b / 255;
                const a = 1;
                return new BABYLON.Color4(r, g, b, a);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            mainUpdate: () => null
        },

        // Thing1
        {
            position: (particle) => {
                const gtheta = this.PId32 * particle.idx - this.PId2;
                const radius = 30 + .12 * particle.idx;
                const x = radius * Math.cos(gtheta);
                const z = radius * Math.sin(gtheta) * Math.cos(gtheta);
                const y = (particle.scaling.y / 2 - particle.idx / 10) + 20;
                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                return new BABYLON.Vector3(yy / 50, 1, yy / 50);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy) => {
                const r = this.colorsService.colors(yy).r / 255;
                const g = this.colorsService.colors(yy).g / 255;
                const b = this.colorsService.colors(yy).b / 255;
                const a = 1;
                return new BABYLON.Color4(r, g, b, a);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, -this.rotation, 0);
            },
            mainUpdate: () => {

            }
        },

        // Block Spiral
        {
            position: (particle) => {
                const gtheta = this.PId32 * particle.idx;
                const radius = 20 + .12 * particle.idx;
                const x = radius * Math.cos(gtheta);
                const z = radius * Math.sin(gtheta);
                const y = (particle.scaling.y / 2 - particle.idx / 16) + 20;
                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                const radius = 20 + .12 * particle.idx;
                const x = 6;
                const y = 20 * yy / 255 + .1;
                const z = radius / 12;
                return new BABYLON.Vector3(x, y, z);
            },
            rotation: (particle, yy) => {
                const gtheta = this.PId32 * particle.idx;
                return new BABYLON.Vector3(0, -gtheta, 0);
            },
            color: (particle, yy) => {
                const r = this.colorsService.colors(yy).r / 255;
                const g = this.colorsService.colors(yy).g / 255;
                const b = this.colorsService.colors(yy).b / 255;
                const a = 1;
                return new BABYLON.Color4(r, g, b, a);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, this.rotation, 0);
            },
            mainUpdate: () => {
                this.engineService.highlightLayer.removeMesh(this.mesh);
                this.engineService.highlightLayer.addMesh(this.mesh,
                    new BABYLON.Color3(this.colorsService.colors(128).r / 255,
                        this.colorsService.colors(128).g / 255,
                        this.colorsService.colors(128).b / 255));
            }
        },

        // Thing2
        {
            position: (particle) => {
                const gtheta = 2 * Math.PI / 576 * particle.idx; // - this.PId2;
                const radius = (2.5 * Math.sin(6 * (gtheta)));

                const x = 30 * radius * Math.cos(gtheta);
                const z = 30 * radius * Math.sin(gtheta);
                const y = 20 * Math.sin(12 * gtheta);
                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                return new BABYLON.Vector3(.5 + yy / 80, .5 + yy / 80, .5 + yy / 80);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy) => {
                const r = this.colorsService.colors(yy).r / 255;
                const g = this.colorsService.colors(yy).g / 255;
                const b = this.colorsService.colors(yy).b / 255;
                const a = 1;
                return new BABYLON.Color4(r, g, b, a);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, this.rotation, 0);
            },
            mainUpdate: () => {

            }
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
                const x = 5;
                const z = 5;
                const y = 20 * yy / 255 + 1;
                return new BABYLON.Vector3(x, y, z);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy) => {
                const r = this.colorsService.colors(yy).r / 255;
                const g = this.colorsService.colors(yy).g / 255;
                const b = this.colorsService.colors(yy).b / 255;
                const a = 1;
                return new BABYLON.Color4(r, g, b, a);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, 2 * this.rotation, 0);
            },
            mainUpdate: () => {
                // if (this.optionsService.animateCamera) {
                //     this.cameraBeta = Math.PI * (Math.sin(this.cameraDelta) / 2 + .5);

                //     (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = this.cameraBeta;

                //     this.cameraDelta += .001;
                //     if (this.cameraDelta > this.TwoPI) {
                //         this.cameraDelta -= this.TwoPI;
                //     }
                // }

                // this.mesh.rotation.y += .01;

                this.thetaDelta += .011;
                if (this.thetaDelta > this.TwoPI) {
                    this.thetaDelta -= this.TwoPI;
                }
            }
        },

        // Thing3
        {
            position: (particle) => {
                let x;
                let z;
                let y;
                const gtheta = this.TwoPId576 * particle.idx;
                // const radius = Math.sqrt(Math.abs (9 * Math.sin(2.5 * gtheta  ) ) )
                const radius = Math.sqrt(Math.abs(10 * Math.sin(2 * gtheta)));
                if (particle.idx % 2) {
                    x = 30 * radius * Math.cos(gtheta);
                    z = 30 * radius * Math.sin(gtheta);
                } else {
                    x = -30 * radius * Math.cos(gtheta);
                    z = -30 * radius * Math.sin(gtheta);
                }

                if (particle.idx % 2) {
                    y = 20 * Math.sin(4 * gtheta);
                } else {
                    y = 20 * Math.sin(-4 * gtheta);
                }
                // y = 0;
                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                return new BABYLON.Vector3(.5 + yy / 60, .5 + yy / 60, .5 + yy / 60);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy) => {
                const r = this.colorsService.colors(yy).r / 255;
                const g = this.colorsService.colors(yy).g / 255;
                const b = this.colorsService.colors(yy).b / 255;
                const a = 1;
                return new BABYLON.Color4(r, g, b, a);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, -this.rotation, 0);
                // return new BABYLON.Vector3(0, 0, 0);
            },
            mainUpdate: () => {

            }
        },

        // Cube
        {
            position: (particle, yy) => {
                const z = ((particle.idx % 8) - 3.5) * 20;
                const x = ((Math.floor(particle.idx / 8) % 9) - 4) * 20;
                const y = ((Math.floor(particle.idx / 72)) - 3.5) * 20;
                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                const x = yy / 20;
                const y = yy / 20;
                const z = yy / 20;
                return new BABYLON.Vector3(x, y, z);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy) => {
                const r = yy * map(particle.position.x, -80, 80, 0, 1) / 255;
                const g = yy * map(particle.position.y, -70, 70, 0, 1) / 255;
                const b = yy * map(particle.position.z, -70, 70, 0, 1) / 255;
                // const a = 1 - (yy / 255);
                const a = 1 - ((yy / 255) * (yy / 255)) + .1;
                return new BABYLON.Color4(r, g, b, a);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            mainUpdate: () => null

        },



        // // Thing
        // {
        //     position: (particle) => {
        //         const gtheta = this.PId32 * particle.idx;
        //         const radius = 20 + .12 * particle.idx;
        //         const x = radius * Math.cos(gtheta);
        //         const z = radius * Math.sin(gtheta);
        //         const y = (particle.scaling.y / 2 - particle.idx / 16) + 20;
        //         return new BABYLON.Vector3(x, y, z);
        //     },
        //     scaling: (particle, yy) => {
        //         return new BABYLON.Vector3(1, 1, 1);
        //     },
        //     rotation: (particle, yy) => {
        //         return new BABYLON.Vector3(0, 0, 0);
        //     },
        //     color: (particle, yy) => {
        //         return new BABYLON.Color4(.5, .5, .5, 1);
        //     },
        //     spsRotation: () => {
        //         return new BABYLON.Vector3(0, 0, 0);
        //     },
        //     mainUpdate: () => {

        //     }
        // }


    ];

    private startExpanding = () => {
        // console.log('start expanding');
        this.theta = -Math.PI / 2;
        this.expanding = true;
        this.expTimer = 0;

        this.expInt = setInterval(() => {
            this.theta += Math.PI / 100;
            this.expTimer = (Math.sin(this.theta) / 2 + .5);
        }, 20);

        this.expTimeout = setTimeout(() => {
            // console.log('expTmeout contracting = false');
            clearInterval(this.expInt);
            this.startContracting();
        }, 2000);
    }

    private startContracting = () => {
        // console.log('start contracting');
        this.theta = -Math.PI / 2;
        this.expanding = false;
        this.contracting = true;
        this.conTimer = 0;

        this.conInt = setInterval(() => {
            this.theta += Math.PI / 100;
            this.conTimer = (Math.sin(this.theta) / 2 + .5);
        }, 50);

        this.conTimeout = setTimeout(() => {
            // console.log('conTmeout - contracting = false');
            clearInterval(this.conInt);
            this.contracting = false;
            this.currentSPS = this.nextSPS;
            this.nextSPS = this.nextSPS === this.SPSFunctions.length - 1 ? 0 : this.nextSPS + 1;
            this.expTimeout = setTimeout(this.startExpanding, this.optionsService.singleSPSDelay * 1000);
        }, 5000);
    }

    beforeRender = () => {
        this.SPS.setParticles();
    }

    setDefaults() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.712;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .01;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;
    }

    create() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .01;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = false;
        this.mat.specularColor = new BABYLON.Color3(.1, .1, .1);
        this.mat.ambientColor = new BABYLON.Color3(.25, .25, .25);
        this.mat.forceDepthWrite = true;

        const master = BABYLON.MeshBuilder.CreateBox(('box'), {
            height: 1,
            width: 1,
            depth: 1
        }, this.scene);

        const myPositionFunction = (particle, i, s) => {
            particle.color = new BABYLON.Color4(.5, .5, .5, .1);
            particle.hasVertexAlpha = true;
        };

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });
        this.SPS.addShape(master, 512 + 64, { positionFunction: myPositionFunction });

        master.dispose();

        this.mesh = this.SPS.buildMesh();
        this.mesh.material = this.mat;
        this.mesh.scaling.x = 3;
        this.mesh.scaling.y = 3;
        this.mesh.scaling.z = 3;
        this.SPS.mesh.hasVertexAlpha = true;

        // //////////////////////////

        this.SPS.updateParticle = (particle) => {
            let y = this.audioService.sample1[particle.idx];
            y = (y * y) / 255;

            if (this.expanding) {
                if (!('expLoc' in particle)) {
                    const rx = BABYLON.Scalar.RandomRange(particle.position.x - 150, particle.position.x + 150);
                    const ry = BABYLON.Scalar.RandomRange(particle.position.y - 150, particle.position.y + 150);
                    const rz = BABYLON.Scalar.RandomRange(particle.position.z - 150, particle.position.z + 150);
                    particle.expLoc = new BABYLON.Vector3(rx, ry, rz);
                }

                particle.position = BABYLON.Vector3.Lerp(
                    this.SPSFunctions[this.currentSPS].position(particle, y),
                    particle.expLoc,
                    this.expTimer);

                particle.scaling = BABYLON.Vector3.Lerp(
                    this.SPSFunctions[this.currentSPS].scaling(particle, y),
                    this.SPSFunctions[this.nextSPS].scaling(particle, y),
                    this.expTimer);


                particle.color = BABYLON.Color4.Lerp(
                    this.SPSFunctions[this.currentSPS].color(particle, y),
                    this.SPSFunctions[this.nextSPS].color(particle, y),
                    this.expTimer);

                particle.rotation = BABYLON.Vector3.Lerp(
                    this.SPSFunctions[this.currentSPS].rotation(particle, y),
                    this.SPSFunctions[this.nextSPS].rotation(particle, y),
                    this.expTimer);

            } else
            if (this.contracting) {

                try {
                    particle.position = BABYLON.Vector3.Lerp(
                        particle.expLoc,
                        this.SPSFunctions[this.nextSPS].position(particle, y),
                        this.conTimer);
                } catch (err) {
                    // tslint:disable-next-line: no-unused-expression
                    null;
                    // console.log(err);
                    // console.log(particle);
                    // console.log(particle.expLoc);
                    // console.log(this.conTimer);
                    // console.log(this.currentSPS);
                    // console.log(this.nextSPS);
                    // console.log(this.SPSFunctions[this.nextSPS].position(particle, y));
                }

                particle.scaling = this.SPSFunctions[this.nextSPS].scaling(particle, y);

                const color = this.SPSFunctions[this.nextSPS].color(particle, y);
                particle.color.r = color.r;
                particle.color.g = color.g;
                particle.color.b = color.b;
                particle.color.a = color.a;

                this.SPSFunctions[this.nextSPS].rotation(particle, y);

            } else {
                if ('expLoc' in particle) {
                    delete particle.expLoc;
                }

                particle.scaling = this.SPSFunctions[this.currentSPS].scaling(particle, y);
                particle.position = this.SPSFunctions[this.currentSPS].position(particle, y);
                const color = this.SPSFunctions[this.currentSPS].color(particle, y);
                particle.color.r = color.r;
                particle.color.g = color.g;
                particle.color.b = color.b;
                particle.color.a = color.a;

                particle.rotation = this.SPSFunctions[this.currentSPS].rotation(particle, y);

            }
        };
    }

    update() {
        this.rotation += Math.PI / 1000;
        if (this.rotation >= Math.PI * 2) {
            this.rotation = 0;
        }

        if (this.expanding) {
            this.SPS.mesh.rotation = BABYLON.Vector3.Lerp(
                this.SPSFunctions[this.currentSPS].spsRotation(),
                this.SPSFunctions[this.nextSPS].spsRotation(),
                this.expTimer);
        } else
        if (this.contracting) {
            this.SPS.mesh.rotation = this.SPSFunctions[this.nextSPS].spsRotation();
        } else {
            this.SPS.mesh.rotation = this.SPSFunctions[this.currentSPS].spsRotation();
        }

        this.SPSFunctions[this.currentSPS].mainUpdate();
    }

    remove() {
        clearInterval(this.conInt);
        clearTimeout(this.conTimeout);
        clearInterval(this.expInt);
        clearTimeout(this.expTimeout);
        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);
    }

}
