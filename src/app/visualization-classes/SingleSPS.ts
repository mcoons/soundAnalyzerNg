
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';
import { map } from '../visualization-classes/utilities.js';
import { Inject, OnDestroy } from '@angular/core';

export class SingleSPS implements OnDestroy {

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

    private subscription;

    private currentSPS;
    private nextSPS;
    private moreThanOneSPS;

    private expanding = false;
    private contracting = false;
    private expInterval;
    private conInterval;
    private expTimer = 0;
    private conTimer = 0;
    private expTimeout = null;
    private conTimeout = null;

    private theta;
    ptsOnSphere = [];

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

        this.subscription = messageService.messageAnnounced$.subscribe(
            message => {
              // console.log('Engine: Message received from service is :  ' + message);
                if (message === 'sps change') {
                    console.log('sps change received')
                    this.updateCurrentNext();
                }
            });


        this.currentSPS = -1;

        this.updateCurrentNext();
        this.moreThanOneSPS = this.optionsService.getSelectedSPSCount() > 1;


        this.setDefaults();

        this.genPointsOnSphere(576);

        this.scene.registerBeforeRender(this.beforeRender);
        if (this.moreThanOneSPS) {
            setTimeout(this.startExpanding, this.optionsService.singleSPSDelay * 1000);
        }
    }


    SPSFunctions = [

        // Block Plane
        {
            name: 'blockPlane',
            position: (particle, yy) => {
                const row = 9 - Math.floor(particle.idx / 64);
                const column = particle.idx % 64;
                const x = (column - 31.5) * 3;
                const z = (row - 5) * 10;
                const y = particle.scaling.y / 2;
                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                return new BABYLON.Vector3(2.5, 15 * yy / 255 + .5, 9);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy) => {
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            mainUpdate: () => null
        },

        // Thing1
        {   
            name: 'thing1',
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
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, -this.rotation, 0);
            },
            mainUpdate: () => {

            }
        },

        // Block Spiral
        {
            name: 'blockSpiral',
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
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
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
            name: 'thing2',
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
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, this.rotation, 0);
            },
            mainUpdate: () => {

            }
        },

        // Equation
        {
            name: 'equation',
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
                return new BABYLON.Vector3(5, 20 * yy / 255 + 1, 5);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy) => {
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, 2 * this.rotation, 0);
            },
            mainUpdate: () => {
                this.thetaDelta += .011;
                if (this.thetaDelta > this.TwoPI) {
                    this.thetaDelta -= this.TwoPI;
                }
            }
        },

        // Thing3
        {
            name: 'thing3',
            position: (particle) => {
                let x;
                let z;
                let y;
                const gtheta = this.TwoPId576 * particle.idx;
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
                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                return new BABYLON.Vector3(.5 + yy / 60, .5 + yy / 60, .5 + yy / 60);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy) => {
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, -this.rotation, 0);
            },
            mainUpdate: () => {

            }
        },

        // Cube
        {
            name: 'cube',
            position: (particle, yy) => {
                const z = ((particle.idx % 8) - 3.5) * 20;
                const x = ((Math.floor(particle.idx / 8) % 9) - 4) * 20;
                const y = ((Math.floor(particle.idx / 72)) - 3.5) * 20;
                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy) => {
                return new BABYLON.Vector3(yy / 20, yy / 20, yy / 20);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy) => {
                const r = yy * map(particle.position.x, -80, 80, 0, 1) / 255;
                const g = yy * map(particle.position.y, -70, 70, 0, 1) / 255;
                const b = yy * map(particle.position.z, -70, 70, 0, 1) / 255;
                const a = 1 - ((yy / 255) * (yy / 255)) + .1;
                return new BABYLON.Color4(r, g, b, a);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            mainUpdate: () => null

        },

        // Sphere
        {
            name: 'sphere',
            position: (particle) => {
                return this.ptsOnSphere[particle.idx].position;
            },
            scaling: (particle, yy) => {
                return new BABYLON.Vector3(.5 + yy / 60, .5 + yy / 60, .5 + yy / 30);
            },
            rotation: (particle, yy) => {
                return this.ptsOnSphere[particle.idx].rotation;
            },
            color: (particle, yy) => {
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(this.PId2, this.rotation, 0);
            },
            mainUpdate: () => {

            }
        },

        // Pole
        {
            name: 'pole',
            position: (particle) => {
                return new BABYLON.Vector3(
                    Math.sin((particle.idx / 576) * Math.PI * 4) * 40,
                    (particle.idx - 576 / 2) / 3,
                    Math.cos((particle.idx / 576) * Math.PI * 4) * 40
                );
            },
            scaling: (particle, yy) => {
                return new BABYLON.Vector3(yy / 10 + 1, .2, yy / 10 + 1);
            },
            rotation: (particle, yy) => {
                return new BABYLON.Vector3(0, Math.sin((particle.idx / 576) * Math.PI * 4), 0);
            },
            color: (particle, yy) => {
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
            },
            spsRotation: () => {
                return new BABYLON.Vector3(0, this.rotation * 3, 0);
            },
            mainUpdate: () => {

            }
        }

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
        clearInterval(this.conInterval);
        clearTimeout(this.conTimeout);
        clearInterval(this.expInterval);
        clearTimeout(this.expTimeout);

        if (this.optionsService.getSelectedSPSCount() === 1) {
            return;
        }

        console.log('start expanding');
        this.theta = -Math.PI / 2;
        this.expanding = true;
        this.contracting = false;
        this.expTimer = 0;

        this.expInterval = setInterval(() => {
            this.theta += Math.PI / 100;
            this.expTimer = (Math.sin(this.theta) / 2 + .5);
        }, 20);

        this.expTimeout = setTimeout(() => {
            console.log('expTmeout');
            clearInterval(this.expInterval);
            this.startContracting();
        }, 2000);
    }

    private startContracting = () => {

        if (this.optionsService.getSelectedSPSCount() === 1) {
            clearInterval(this.conInterval);
            clearTimeout(this.conTimeout);
            clearInterval(this.expInterval);
            clearTimeout(this.expTimeout);
            return;
        }

        console.log('start contracting');
        this.theta = -Math.PI / 2;
        this.expanding = false;
        this.contracting = true;
        this.conTimer = 0;

        this.conInterval = setInterval(() => {
            this.theta += Math.PI / 100;
            this.conTimer = (Math.sin(this.theta) / 2 + .5);
        }, 50);

        this.conTimeout = setTimeout(() => {
            console.log('conTmeout');
            clearInterval(this.conInterval);
            this.contracting = false;
            this.currentSPS = this.nextSPS;
            do {
                this.nextSPS = this.nextSPS === this.SPSFunctions.length - 1 ? 0 : this.nextSPS + 1;
                // console.log(this.optionsService.options[this.SPSFunctions[this.nextSPS].name])
            } while (!this.optionsService.options[this.SPSFunctions[this.nextSPS].name].value);

            this.expTimeout = setTimeout(this.startExpanding, this.optionsService.singleSPSDelay * 1000);
        }, 5000);
    }



    updateCurrentNext = () => {
        console.log('in updateCurrentNext');
        this.currentSPS = this.currentSPS > 0 ? this.currentSPS - 1 : -1;
        this.calculateCurrent();
        this.nextSPS = this.currentSPS;
        this.calculateNext();

        if (this.moreThanOneSPS && this.optionsService.getSelectedSPSCount() === 1) {

            clearInterval(this.conInterval);
            clearTimeout(this.conTimeout);
            clearInterval(this.expInterval);
            clearTimeout(this.expTimeout);

            this.expanding = false;
            this.contracting = false;

            this.moreThanOneSPS = false;

        } else
        if (!this.moreThanOneSPS && this.optionsService.getSelectedSPSCount() > 1) {
            setTimeout(this.startExpanding, this.optionsService.singleSPSDelay * 1000);
            this.moreThanOneSPS = true;
        }

        // this.moreThanOneSPS = this.optionsService.getSelectedSPSCount() > 1;
    }

    calculateCurrent = () => {
        do {
            this.currentSPS = this.currentSPS === this.SPSFunctions.length - 1 ? 0 : this.currentSPS + 1;
        } while (!this.optionsService.options[this.SPSFunctions[this.currentSPS].name].value);
    }

    calculateNext = () => {
        do {
            this.nextSPS = this.nextSPS === this.SPSFunctions.length - 1 ? 0 : this.nextSPS + 1;
        } while (!this.optionsService.options[this.SPSFunctions[this.nextSPS].name].value);
    }



    ngOnDestroy() {
        this.remove();
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

                particle.rotation = BABYLON.Vector3.Lerp(
                    this.SPSFunctions[this.currentSPS].rotation(particle, y),
                    this.SPSFunctions[this.nextSPS].rotation(particle, y),
                    this.expTimer);

                particle.color = BABYLON.Color4.Lerp(
                    this.SPSFunctions[this.currentSPS].color(particle, y),
                    this.SPSFunctions[this.nextSPS].color(particle, y),
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

                    this.SPSFunctions[this.nextSPS].rotation(particle, y);

                    const color = this.SPSFunctions[this.nextSPS].color(particle, y);
                    particle.color.r = color.r;
                    particle.color.g = color.g;
                    particle.color.b = color.b;
                    particle.color.a = color.a;

                } else {
                    if ('expLoc' in particle) {
                        delete particle.expLoc;
                    }

                    particle.scaling = this.SPSFunctions[this.currentSPS].scaling(particle, y);
                    particle.position = this.SPSFunctions[this.currentSPS].position(particle, y);
                    particle.rotation = this.SPSFunctions[this.currentSPS].rotation(particle, y);

                    const color = this.SPSFunctions[this.currentSPS].color(particle, y);
                    particle.color.r = color.r;
                    particle.color.g = color.g;
                    particle.color.b = color.b;
                    particle.color.a = color.a;

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
        this.subscription.unsubscribe();
        clearInterval(this.conInterval);
        clearTimeout(this.conTimeout);
        clearInterval(this.expInterval);
        clearTimeout(this.expTimeout);
        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.SPS.dispose();
        this.SPS = null; // tells the GC the reference can be cleaned up also
        this.scene.unregisterBeforeRender(this.beforeRender);
    }


    genPointsOnSphere(numberOfPoints) {

        const dlong = Math.PI * (3 - Math.sqrt(5));
        const dz = 2 / numberOfPoints;
        let long = 0;
        let z = 1 - dz / 2;
        const rScale = 50;

        const master = BABYLON.MeshBuilder.CreateBox(('box'), {
            height: 1,
            width: 1,
            depth: 1
        }, this.scene);

        const origin = new BABYLON.Vector3(0, 0, 0);

        for (let k = 0; k <= numberOfPoints; k++) {
            const r = Math.sqrt(1 - z * z);
            const ptNew = new BABYLON.Vector3(Math.cos(long) * r * rScale, Math.sin(long) * r * rScale, z * rScale);

            master.position = ptNew;
            master.lookAt(origin);
            const mr = new BABYLON.Vector3(master.rotation.x, master.rotation.y, master.rotation.z);

            this.ptsOnSphere.push({ position: ptNew, rotation: mr });

            z = z - dz;
            long = long + dlong;
        }

        master.dispose();

    }


}
