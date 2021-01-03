/* eslint-disable @typescript-eslint/no-unused-vars */

import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';
import { map } from './utilities.js';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class SingleSPSCube implements OnDestroy {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;
    private engineService: EngineService;
    private colorsService: ColorsService;

    private thetaDelta: number;

    private SPS;
    private mesh: BABYLON.Mesh;
    private mat: BABYLON.StandardMaterial;

    private master: BABYLON.Mesh;
    private origin: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);

    private x: number;
    private y: number;
    private z: number;
    private c;


    private PI: number;
    private TwoPI: number;
    private FourPI: number;
    private TwentyPI: number;
    private TwoPId576: number;
    private TwoPId72: number;
    private SixPId576: number;
    private SixteenPId576: number;
    private PId2: number;
    private PId32: number;
    private PId1000: number;

    private forwardRotation: number;
    private backwardRotation: number;

    private radius: number;

    private subscription: Subscription;

    private currentSPS: number;
    private nextSPS: number;
    // private moreThanOneSPS;

    private expanding = false;
    private contracting = false;
    private expInterval;
    private conInterval;
    private expTimer = 0;
    private conTimer = 0;
    private expTimeout = null;
    private conTimeout = null;
    private initialTimeout = null;

    private theta: number;
    ptsOnSphere = [];

    // private currentCameraIndex = 0;

    cameraIndicies = [];

    cameraSettingsCurrent;
    cameraSettingsNext;

    constructor(scene: BABYLON.Scene, audioService: AudioService, optionsService: OptionsService, messageService: MessageService, engineService: EngineService, colorsService: ColorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.engineService = engineService;
        this.colorsService = colorsService;

        this.thetaDelta = 0;

        this.PI = Math.PI;
        this.TwoPI = this.PI * 2;
        this.FourPI = this.PI * 4;
        this.TwentyPI = this.PI * 20;
        this.PId2 = this.PI / 2;
        this.PId32 = this.PI / 32;
        this.TwoPId576 = this.TwoPI / 576;
        this.TwoPId72 = this.TwoPI / 72;
        this.SixteenPId576 = 16 * this.PI / 576;
        this.SixPId576 = 6 * this.PI / 576;
        this.PId1000 = this.PI / 1000;

        this.radius = 40;
        this.forwardRotation = 0;
        this.backwardRotation = this.TwoPI;

        this.subscription = messageService.messageAnnounced$.subscribe(
            message => {
                if (message === 'sps change') {
                    this.updateCurrentNext();
                }
                if (message === 'clear intervals') {
                    clearTimeout(this.initialTimeout);
                    clearInterval(this.conInterval);
                    clearTimeout(this.conTimeout);
                    clearInterval(this.expInterval);
                    clearTimeout(this.expTimeout);
                }
            });

        this.currentSPS = -1;

        this.SPSFunctions.forEach(e => this.cameraIndicies.push(0));

        this.updateCurrentNext();
        // this.moreThanOneSPS = this.optionsService.getSelectedCubeSPSCount() > 1;

        this.genPointsOnSphere(576);

        this.scene.registerBeforeRender(this.beforeRender);

        clearTimeout(this.initialTimeout);
        clearInterval(this.conInterval);
        clearTimeout(this.conTimeout);
        clearInterval(this.expInterval);
        clearTimeout(this.expTimeout);

        this.initialTimeout = setTimeout(this.startExpanding, this.optionsService.newBaseOptions.visual[0].singleSPSDelay.value * 1000);

        this.setDefaults();

        this.master = BABYLON.MeshBuilder.CreateBox(('box'), {
            height: 1,
            width: 1,
            depth: 1
        }, this.scene);

        this.master.isVisible = false;

    }


    SPSFunctions = [

        //  when calculating the theta .. dont increment by a radai   ...  increment by   particle_separation_distance / radius

        // Block Plane
        {
            name: 'blockPlane',
            position: (particle, yy: number): BABYLON.Vector3 => {
                const row = 9 - Math.floor(particle.idx / 64);
                const column = particle.idx % 64;
                this.x = (column - 31.5) * 3;
                this.z = (row - 5) * 10;
                this.y = particle.scaling.y / 2;
                return new BABYLON.Vector3(this.x, this.y, this.z);
            },
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(2.5, 15 * yy / 255 + .5, 9);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy: number): BABYLON.Color4 => {
                this.c = this.colorsService.colors(yy);
                return new BABYLON.Color4(this.c.r / 255, this.c.g / 255, this.c.b / 255, 1);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, -this.PI, 0);
            },
            cameraDefault: (cIndex: number): Record<string, unknown> => {
                const cameraPositions = [
                    { alpha: -1 * this.PId2, beta: 1.05, radius: 830 },
                    { alpha: -1 * this.PId2, beta: .01, radius: 350 },
                    { alpha: -1 * this.PId2, beta: .01, radius: 830 }
                ];
                return cameraPositions[cIndex];
            },
            currentCameraIndex: 0,
            mainUpdate: (): void => {
                null;
            }
        },

        // Thing1
        {
            name: 'thing1',
            position: (particle): BABYLON.Vector3 => {
                const gtheta = this.PId32 * particle.idx - this.PId2;
                const radius = 30 + .12 * particle.idx;
                this.x = radius * Math.cos(gtheta);
                this.z = radius * Math.sin(gtheta) * Math.cos(gtheta);
                this.y = (particle.scaling.y / 2 - particle.idx / 10) + 20;
                return new BABYLON.Vector3(this.x, this.y, this.z);
            },
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(.5 + yy / 50, 1, .5 + yy / 50);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                // return new BABYLON.Vector3(0, 0, 0);
                return this.getLookatOriginRotation(particle);

            },
            color: (particle, yy: number): BABYLON.Color4 => {
                this.c = this.colorsService.colors(yy);
                return new BABYLON.Color4(this.c.r / 255, this.c.g / 255, this.c.b / 255, 1);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, this.backwardRotation, 0);
            },
            cameraDefault: (cIndex: number) => {
                const cameraPositions = [
                    { alpha: -this.PId2, beta: .01, radius: 900 },
                    { alpha: -this.PId2, beta: 1.05, radius: 900 },
                    { alpha: -this.PId2, beta: this.PI, radius: 400 }
                ];
                return cameraPositions[cIndex];

            },
            currentCameraIndex: 0,
            mainUpdate: (): void => {
                null;
            }
        },

        // Block Spiral
        {
            name: 'blockSpiral',
            position: (particle): BABYLON.Vector3 => {
                const gtheta = (this.PId32 * particle.idx) % this.TwoPI;
                const radius = 20 + .12 * particle.idx;
                this.x = radius * Math.cos(gtheta);
                this.z = radius * Math.sin(gtheta);
                this.y = (particle.scaling.y / 2 - particle.idx / 16) + 20;
                return new BABYLON.Vector3(this.x, this.y, this.z);
            },
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                const radius = 20 + .12 * particle.idx;
                this.x = 6;
                this.y = 20 * yy / 255 + .1;
                this.z = radius / 12;
                return new BABYLON.Vector3(this.x, this.y, this.z);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                const gtheta = (this.PId32 * particle.idx) % this.TwoPI;
                return new BABYLON.Vector3(0, -gtheta, 0);
            },
            color: (particle, yy: number): BABYLON.Color4 => {
                this.c = this.colorsService.colors(yy);
                return new BABYLON.Color4(this.c.r / 255, this.c.g / 255, this.c.b / 255, 1);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, this.forwardRotation, 0);
            },
            cameraDefault: (cIndex: number) => {
                const cameraPositions = [
                    { alpha: -this.PId2, beta: 1.05, radius: 950 },
                    { alpha: -this.PId2, beta: this.PI, radius: 900 },
                    { alpha: -this.PId2, beta: .01, radius: 500 },
                ];
                return cameraPositions[cIndex];
            },
            currentCameraIndex: 0,
            mainUpdate: (): void => {
                // this.engineService.highlightLayer.removeMesh(this.mesh);
                // this.engineService.highlightLayer.addMesh(this.mesh,
                //     new BABYLON.Color3(this.colorsService.colors(128).r / 255,
                //         this.colorsService.colors(128).g / 255,
                //         this.colorsService.colors(128).b / 255));
            }
        },

        // Thing2
        {
            name: 'thing2',
            position: (particle): BABYLON.Vector3 => {
                // const gtheta = 2 * Math.PI / 576 * particle.idx; // - this.PId2;
                const gtheta = this.TwoPId576 * particle.idx; // - this.PId2;
                const radius = (2.5 * Math.sin(6 * (gtheta)));

                this.x = 30 * radius * Math.cos(gtheta);
                this.z = 30 * radius * Math.sin(gtheta);
                this.y = 20 * Math.sin(12 * gtheta);
                return new BABYLON.Vector3(this.x, this.y, this.z);
            },
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(.5 + yy / 80, .5 + yy / 80, .5 + yy / 80);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                // return new BABYLON.Vector3(0, 0, 0);
                return this.getLookatOriginRotation(particle);

            },
            color: (particle, yy: number): BABYLON.Color4 => {
                this.c = this.colorsService.colors(yy);
                return new BABYLON.Color4(this.c.r / 255, this.c.g / 255, this.c.b / 255, 1);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, this.forwardRotation, 0);
            },
            cameraDefault: (cIndex: number) => {
                const cameraPositions = [
                    { alpha: -this.PId2, beta: .01, radius: 1200 },
                    { alpha: -this.PId2, beta: 1.05, radius: 1200 },
                    { alpha: -this.PId2, beta: 1.05, radius: 600 }
                ];
                return cameraPositions[cIndex];
            },
            currentCameraIndex: 0,
            mainUpdate: (): void => {
                null;
            }
        },

        // Equation
        {
            name: 'equation',
            position: (particle): BABYLON.Vector3 => {
                const ring = Math.floor(particle.idx / 64);
                const ringIndex = particle.idx % 64;
                // const theta = ringIndex * Math.PI / 32;
                const theta = ringIndex * this.PId32;

                this.x = (1 + .15 * ring) * this.radius * Math.cos(theta + this.thetaDelta);
                this.z = (1 + .15 * ring) * this.radius * Math.sin(theta + this.thetaDelta);
                this.y = (1 - .15 * ring) * this.radius * Math.sin(theta + this.thetaDelta) * Math.cos(theta + this.thetaDelta);

                return new BABYLON.Vector3(this.x, this.y, this.z);
            },
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(5, 20 * yy / 255 + 1, 5);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                // return new BABYLON.Vector3(0, 0, 0);
                return this.getLookatOriginRotation(particle);

            },
            color: (particle, yy: number): BABYLON.Color4 => {
                this.c = this.colorsService.colors(yy);
                return new BABYLON.Color4(this.c.r / 255, this.c.g / 255, this.c.b / 255, 1);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, this.forwardRotation, 0);
            },
            cameraDefault: (cIndex: number) => {
                const cameraPositions = [
                    { alpha: -this.PId2, beta: 1.05, radius: 1100 },
                    { alpha: -this.PId2, beta: 1.05, radius: 800 },
                    { alpha: -this.PId2, beta: .01, radius: 1100 }
                ];

                return cameraPositions[cIndex];
            },
            currentCameraIndex: 0,
            mainUpdate: (): void => {
                this.thetaDelta += .011;
                if (this.thetaDelta > this.TwoPI) {
                    this.thetaDelta -= this.TwoPI;
                }
            }
        },

        // Thing3
        {
            name: 'thing3',
            position: (particle): BABYLON.Vector3 => {
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
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(.5 + yy / 60, .5 + yy / 60, .5 + yy / 60);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                // return new BABYLON.Vector3(0, 0, 0);
                return this.getLookatOriginRotation(particle);

            },
            color: (particle, yy: number): BABYLON.Color4 => {
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, -this.forwardRotation, 0);
            },
            cameraDefault: (cIndex: number) => {
                const cameraPositions = [
                    { alpha: -this.PId2, beta: 1.05, radius: 1200 },
                    { alpha: -this.PId2, beta: .01, radius: 1200 },
                    { alpha: -this.PId2, beta: 1.52, radius: 100 }
                ];

                return cameraPositions[cIndex];
            },
            currentCameraIndex: 0,
            mainUpdate: (): void => {
                null;
            }
        },

        // Cube
        {
            name: 'cube',
            position: (particle, yy: number): BABYLON.Vector3 => {
                this.z = ((particle.idx % 8) - 3.5) * 20;
                this.x = ((Math.floor(particle.idx / 8) % 9) - 4) * 20;
                this.y = ((Math.floor(particle.idx / 72)) - 3.5) * 20;
                return new BABYLON.Vector3(this.x, this.y, this.z);
            },
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(.5 + yy / 20, .5 + yy / 20, .5 + yy / 20);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            color: (particle, yy: number): BABYLON.Color4 => {
                const r = yy * map(particle.position.x, -80, 80, 0, 1) / 255 + .1;
                const g = yy * map(particle.position.y, -70, 70, 0, 1) / 255 + .1;
                const b = yy * map(particle.position.z, -70, 70, 0, 1) / 255 + .1;
                const a = 1 - ((yy / 255) * (yy / 255)) + .1;
                return new BABYLON.Color4(r, g, b, a);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, 0, 0);
            },
            cameraDefault: (cIndex: number) => {
                const cameraPositions = [
                    { alpha: -this.PId2, beta: this.PId2, radius: 800 },
                    { alpha: -0.7579, beta: 2.1719, radius: 800 },
                    { alpha: -this.PId2, beta: .01, radius: 800 },
                ];

                return cameraPositions[cIndex];
            },
            currentCameraIndex: 0,
            mainUpdate: ():void => {
                null;
            }

        },

        // Sphere
        {
            name: 'sphere',
            position: (particle): BABYLON.Vector3 => {
                return this.ptsOnSphere[particle.idx].position;
            },
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(.5 + yy / 60, .5 + yy / 60, .5 + yy / 30);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                return this.ptsOnSphere[particle.idx].rotation;
            },
            color: (particle, yy: number): BABYLON.Color4 => {
                this.c = this.colorsService.colors(yy);
                return new BABYLON.Color4(this.c.r / 255, this.c.g / 255, this.c.b / 255, 1);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(this.PId2, this.forwardRotation, 0);
            },
            cameraDefault: (cIndex: number) => {
                const cameraPositions = [
                    { alpha: -this.PId2, beta: this.PId2, radius: 1200 },
                    { alpha: -this.PId2, beta: .01, radius: 800 },
                    { alpha: -this.PId2, beta: .01, radius: 300 }
                ];

                return cameraPositions[cIndex];
            },
            currentCameraIndex: 0,
            mainUpdate: (): void => {
                null;
            }
        },

        // Pole
        {
            name: 'pole',
            position: (particle): BABYLON.Vector3 => {
                return new BABYLON.Vector3(
                    Math.sin((particle.idx / 576) * this.FourPI) * 40,
                    (particle.idx - 288) / 3,
                    Math.cos((particle.idx / 576) * this.FourPI) * 40
                );
            },
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(yy / 10 + 1, .2, yy / 10 + 1);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, (Math.sin((particle.idx / 576) * this.FourPI)) % this.TwoPI, 0);
            },
            color: (particle, yy: number): BABYLON.Color4 => {
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, this.forwardRotation, 0);
            },
            cameraDefault: (cIndex: number) => {
                const cameraPositions = [
                    { alpha: -this.PId2, beta: this.PId2, radius: 400 },
                    { alpha: -this.PId2, beta: this.PId2, radius: 1200 },
                    { alpha: -this.PId2, beta: .01, radius: 1200 }
                ];

                return cameraPositions[cIndex];
            },
            currentCameraIndex: 0,
            mainUpdate: (): void => {
                null;
            }
        },

        // Heart
        {
            name: 'heart',
            position: (particle): BABYLON.Vector3 => {
                let x;
                let z;
                let y;
                // const gtheta = this.TwoPId576 * (particle.idx % 192) * 3;
                // const ptheta = this.TwoPId576 * (particle.idx % 192) * 3;
                const gtheta = this.SixPId576 * (particle.idx % 192);
                const ptheta = this.SixPId576 * (particle.idx % 192);

                if (particle.idx <= 192) {
                    x = 16 * Math.sin(ptheta) * Math.sin(ptheta) * Math.sin(ptheta);
                    y = 13 * Math.cos(ptheta) -
                        5 * Math.cos(2 * ptheta) -
                        2 * Math.cos(3 * ptheta) -
                        Math.cos(4 * ptheta);
                    z = -x;
                } else
                    if (particle.idx <= 384) {

                        x = 32 * Math.sin(ptheta) * Math.sin(ptheta) * Math.sin(ptheta);
                        y = 26 * Math.cos(ptheta) -
                            10 * Math.cos(2 * ptheta) -
                            4 * Math.cos(3 * ptheta) -
                            2 * Math.cos(4 * ptheta);
                        z = x;
                    } else {

                        x = 64 * Math.sin(ptheta) * Math.sin(ptheta) * Math.sin(ptheta);
                        y = 52 * Math.cos(ptheta) -
                            20 * Math.cos(2 * ptheta) -
                            8 * Math.cos(3 * ptheta) -
                            4 * Math.cos(4 * ptheta);
                        z = -x;
                    }

                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                return new BABYLON.Vector3(1 + yy / 50, 1 + yy / 50, 1 + yy / 50);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                // return new BABYLON.Vector3(0, 0, 0);
                return this.getLookatOriginRotation(particle);
            },
            color: (particle, yy: number): BABYLON.Color4 => {
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(.2 + c.r / 255, .2 + c.g / 255, .2 + c.b / 255, 1);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, this.forwardRotation, 0);
            },
            cameraDefault: (cIndex: number) => {
                const cameraPositions = [
                    { alpha: -this.PId2, beta: this.PId2, radius: 800 },
                    { alpha: -this.PId2, beta: this.PId2, radius: 600 },
                    { alpha: -this.PId2, beta: this.PId2, radius: 1200 }
                ];

                return cameraPositions[cIndex];
            },
            currentCameraIndex: 0,
            mainUpdate: (): void => {
                null;
            }
        },


        // Sine loop
        {
            name: 'sineLoop2',
            position: (particle): BABYLON.Vector3 => {
                const radius = 15;
                // const loop = particle.idx % 2 + 1;
                const loop = Math.trunc(particle.idx / 72) + 1;
                // const x;
                // const z;
                // const y;
                // const gtheta = this.TwoPId576 * particle.idx * 8;
                const gtheta = this.SixteenPId576 * particle.idx;

                const x = loop * radius * Math.cos(gtheta - loop / 40);
                const z = loop * radius * Math.sin(gtheta - loop / 40);
                // const y = .6 * loop * Math.sin(map(particle.idx % 72, 0, 72, 0, 10 * this.TwoPI));
                const y = .6 * loop * Math.sin(map(particle.idx % 72, 0, 72, 0, this.TwentyPI));

                return new BABYLON.Vector3(x, y, z);
            },
            scaling: (particle, yy: number): BABYLON.Vector3 => {
                const loop = Math.trunc(particle.idx / 72) + 1;
                yy = yy + 20;

                return new BABYLON.Vector3(loop * yy / 30, yy / 65, yy / 65);
            },
            rotation: (particle, yy: number): BABYLON.Vector3 => {
                // const radian = 2 * Math.PI / 72;
                const radian = this.TwoPId72;
                const gtheta = (radian * particle.idx) % this.TwoPI;

                return new BABYLON.Vector3(Math.PI / 8, -gtheta % this.TwoPI, 0);
            },
            color: (particle, yy: number): BABYLON.Color4 => {
                const c = this.colorsService.colors(yy);
                return new BABYLON.Color4(c.r / 255, c.g / 255, c.b / 255, 1);
            },
            spsRotation: (): BABYLON.Vector3 => {
                return new BABYLON.Vector3(0, this.forwardRotation, 0);
            },
            cameraDefault: (cIndex: number): Record<string, unknown> => {
                const cameraPositions = [
                    { alpha: -this.PId2, beta: .01, radius: 1200 },
                    { alpha: -this.PId2, beta: this.PId32, radius: 1200 },
                    { alpha: -this.PId2, beta: this.PI / 8, radius: 1200 }
                ];

                return cameraPositions[cIndex];
            },
            currentCameraIndex: 0,
            mainUpdate: (): void => {
                null;
            }
        },

    ];


    getLookatOriginRotation(particle): BABYLON.Vector3 {
        this.master.position = particle.position;
        this.master.lookAt(this.origin);
        return this.master.rotation;
    }


    getSPSNames(): string[] {
        return this.SPSFunctions.map(e => e.name);
    }

    private startExpanding = (): void => {

        // console.log('start expansion');

        clearTimeout(this.initialTimeout);
        clearInterval(this.conInterval);
        clearTimeout(this.conTimeout);
        clearInterval(this.expInterval);
        clearTimeout(this.expTimeout);

        // if (this.optionsService.getSelectedCubeSPSCount() === 1) {
        //     console.log('cancel expanding 1 SPS');

        //     return;
        // }

        this.theta = -Math.PI / 2;
        this.expanding = true;
        this.contracting = false;
        this.expTimer = 0;

        this.expInterval = setInterval(() => {
            this.theta += Math.PI / 100;
            this.expTimer = (Math.sin(this.theta) / 2 + .5);

        }, 20);

        this.expTimeout = setTimeout(() => {

            clearTimeout(this.initialTimeout);
            clearInterval(this.conInterval);
            clearTimeout(this.conTimeout);
            clearInterval(this.expInterval);
            clearTimeout(this.expTimeout);

            this.startContracting();
        }, 2000);
    }

    private startContracting = (): void => {

        // console.log('start contraction');

        clearTimeout(this.initialTimeout);
        clearInterval(this.conInterval);
        clearTimeout(this.conTimeout);
        clearInterval(this.expInterval);
        clearTimeout(this.expTimeout);

        this.theta = -Math.PI / 2;
        this.expanding = false;
        this.contracting = true;
        this.conTimer = 0;

        this.conInterval = setInterval(() => {
            this.theta += Math.PI / 100;
            this.conTimer = (Math.sin(this.theta) / 2 + .5);

        }, 50);

        this.conTimeout = setTimeout(() => {

            clearTimeout(this.initialTimeout);
            clearInterval(this.conInterval);
            clearInterval(this.expInterval);
            clearTimeout(this.expTimeout);
            this.contracting = false;

            this.cameraIndicies[this.currentSPS] = (this.cameraIndicies[this.currentSPS] + 1) % 3;

            this.currentSPS = this.nextSPS;
            do {
                this.nextSPS = this.nextSPS === this.SPSFunctions.length - 1 ? 0 : this.nextSPS + 1;
            } while (!this.optionsService.newBaseOptions.visual[0].types[Number(this.nextSPS)].value === true);

            this.expTimeout = setTimeout(this.startExpanding, this.optionsService.newBaseOptions.visual[0].singleSPSDelay.value * 1000);

        }, 5000);
    }

    updateCurrentNext = (): void => {
        // console.log('in updateCurrentNext');
        this.currentSPS = this.currentSPS > 0 ? this.currentSPS - 1 : -1;
        this.calculateCurrent();
        this.nextSPS = this.currentSPS;
        this.calculateNext();

    }


    calculateCurrent = (): void => {
        // console.log('calculating current');
        do {
            this.currentSPS = this.currentSPS === this.SPSFunctions.length - 1 ? 0 : this.currentSPS + 1;
            // console.log('checking: ', this.currentSPS);
            // console.log('value: ', this.optionsService.newBaseOptions.visual[0].types[Number(this.currentSPS)].value);
        } while (!this.optionsService.newBaseOptions.visual[0].types[Number(this.currentSPS)].value === true);
    }

    calculateNext = (): void => {
        // console.log('calculating next');
        do {
            this.nextSPS = this.nextSPS === this.SPSFunctions.length - 1 ? 0 : this.nextSPS + 1;
        } while (!this.optionsService.newBaseOptions.visual[0].types[Number(this.nextSPS)].value === true);
    }





    ngOnDestroy = (): void => {
        this.remove();
    }

    beforeRender = (): void => {
        this.SPS.setParticles();
    }

    setDefaults = (): void => {

        this.cameraSettingsCurrent = this.SPSFunctions[this.currentSPS].cameraDefault(this.cameraIndicies[this.currentSPS]); // :
        if (this.optionsService.getSelectedCubeSPSCount() === 1) {
            this.cameraSettingsNext = this.SPSFunctions[this.currentSPS].cameraDefault((this.cameraIndicies[this.currentSPS] + 1) % 3);
        } else {
            this.cameraSettingsNext = this.SPSFunctions[this.nextSPS].cameraDefault(this.cameraIndicies[this.nextSPS]);
        }

        if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].autoRotate.value) {
            (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = this.cameraSettingsCurrent.alpha;
            (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = this.cameraSettingsCurrent.beta;
            (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = this.cameraSettingsCurrent.radius;

        }
    }

    create = (): void => {
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .01;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = false;
        this.mat.specularColor = new BABYLON.Color3(1, 1, 1);
        // this.mat.ambientColor = new BABYLON.Color3(1, 1, 1);
        this.mat.forceDepthWrite = true;
        this.mat.maxSimultaneousLights = 8;

        // this.mat.reflectionTexture = new BABYLON.CubeTexture('../../assets/images/skybox/TropicalSunnyDay', this.scene);
        // this.mat.reflectionTexture.coordinatesMode = BABYLON.Texture.PLANAR_MODE;

        const master = BABYLON.MeshBuilder.CreateBox(('box'), {
            height: 1,
            width: 1,
            depth: 1
        }, this.scene);

        const myPositionFunction = (particle, i, s) => {
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
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
        // Used to update individual particles only
        // Order scaling, position, rotation then color - position adjustment may be dependent on new scaling

        this.SPS.updateParticle = (particle) => {
            let y = this.audioService.sample1[particle.idx];
            y = (y * y) / 255;

            if (this.expanding) {
                if (!('expLoc' in particle)) {
                    const rx = BABYLON.Scalar.RandomRange(particle.position.x - this.optionsService.newBaseOptions.visual[0].singleSPSExplosionSize.value,
                        particle.position.x + this.optionsService.newBaseOptions.visual[0].singleSPSExplosionSize.value);
                    const ry = BABYLON.Scalar.RandomRange(particle.position.y - this.optionsService.newBaseOptions.visual[0].singleSPSExplosionSize.value,
                        particle.position.y + this.optionsService.newBaseOptions.visual[0].singleSPSExplosionSize.value);
                    const rz = BABYLON.Scalar.RandomRange(particle.position.z - this.optionsService.newBaseOptions.visual[0].singleSPSExplosionSize.value,
                        particle.position.z + this.optionsService.newBaseOptions.visual[0].singleSPSExplosionSize.value);
                    particle.expLoc = new BABYLON.Vector3(rx, ry, rz);
                }

                particle.scaling = BABYLON.Vector3.Lerp(
                    this.SPSFunctions[this.currentSPS].scaling(particle, y),
                    this.SPSFunctions[this.nextSPS].scaling(particle, y),
                    this.expTimer);

                particle.position = BABYLON.Vector3.Lerp(
                    this.SPSFunctions[this.currentSPS].position(particle, y),
                    new BABYLON.Vector3(particle.expLoc.x, particle.expLoc.y, particle.expLoc.z),
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
                    if (!('finalLoc' in particle)) {
                        particle.finalLoc = true;

                        if ('expLoc' in particle) {
                            particle.expLoc.x = particle.position.x;
                            particle.expLoc.y = particle.position.y;
                            particle.expLoc.z = particle.position.z;
                        }
                    }

                    if (!('expLoc' in particle)) {
                        particle.expLoc = new BABYLON.Vector3(particle.position.x, particle.position.y, particle.position.z);
                    }

                    particle.scaling = this.SPSFunctions[this.nextSPS].scaling(particle, y);

                    try {
                        particle.position = BABYLON.Vector3.Lerp(
                            new BABYLON.Vector3(particle.expLoc.x, particle.expLoc.y, particle.expLoc.z),
                            this.SPSFunctions[this.nextSPS].position(particle, y),
                            this.conTimer);
                    } catch (err) {
                        // tslint:disable-next-line: no-unused-expression
                        null;
                    }

                    particle.rotation = this.SPSFunctions[this.nextSPS].rotation(particle, y);
                    particle.color = this.SPSFunctions[this.nextSPS].color(particle, y);

                } else {
                    if ('expLoc' in particle) {
                        delete particle.expLoc;
                    }

                    if ('finalLoc' in particle) {
                        delete particle.finalLoc;
                    }

                    particle.scaling = this.SPSFunctions[this.currentSPS].scaling(particle, y);
                    particle.position = this.SPSFunctions[this.currentSPS].position(particle, y);
                    particle.rotation = this.SPSFunctions[this.currentSPS].rotation(particle, y);
                    particle.color = this.SPSFunctions[this.currentSPS].color(particle, y);

                }
        };
    }

    // Used to update the scene and the SPS mesh as a whole (not particles)
    update = (): void => {

        this.forwardRotation = (this.forwardRotation + this.PId1000) % this.TwoPI;
        this.backwardRotation -= this.PId1000;

        if (this.expanding) {
            this.SPS.mesh.rotation = (BABYLON.Vector3.Lerp(
                this.SPSFunctions[this.currentSPS].spsRotation(),
                this.SPSFunctions[this.nextSPS].spsRotation(),
                this.expTimer));


            if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].autoRotate.value) {

                this.cameraSettingsCurrent = this.SPSFunctions[this.currentSPS].cameraDefault(this.cameraIndicies[this.currentSPS]); // :
                (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = this.cameraSettingsCurrent.alpha;
                (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = this.cameraSettingsCurrent.beta;
                (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = this.cameraSettingsCurrent.radius; // * (x + y),
            }

        } else

            if (this.contracting) {

                this.SPS.mesh.rotation = this.SPSFunctions[this.nextSPS].spsRotation();

                this.cameraSettingsCurrent = this.SPSFunctions[this.currentSPS].cameraDefault(this.cameraIndicies[this.currentSPS]); // :
                if (this.optionsService.getSelectedCubeSPSCount() === 1) {
                    // tslint:disable-next-line: max-line-length
                    this.cameraSettingsNext = this.SPSFunctions[this.currentSPS].cameraDefault((this.cameraIndicies[this.currentSPS] + 1) % 3);
                } else {
                    this.cameraSettingsNext = this.SPSFunctions[this.nextSPS].cameraDefault(this.cameraIndicies[this.nextSPS]);
                }

                if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].autoRotate.value) {

                    (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha =
                        BABYLON.Scalar.Lerp(
                            this.cameraSettingsCurrent.alpha,
                            this.cameraSettingsNext.alpha,
                            this.conTimer);

                    (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta =
                        BABYLON.Scalar.Lerp(
                            this.cameraSettingsCurrent.beta,
                            this.cameraSettingsNext.beta,
                            this.conTimer);

                    (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius =
                        BABYLON.Scalar.Lerp(
                            this.cameraSettingsCurrent.radius, // * (x + y),
                            this.cameraSettingsNext.radius, // * (x + y),
                            this.conTimer);

                    (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
                }
            } else {
                if (this.backwardRotation < 0) {
                    this.backwardRotation = this.backwardRotation + this.TwoPI;
                }

                if (this.forwardRotation > this.TwoPI) {
                    this.forwardRotation = this.forwardRotation - this.TwoPI;
                }

                this.SPS.mesh.rotation = this.SPSFunctions[this.currentSPS].spsRotation();



                if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].autoRotate.value) {

                    this.cameraSettingsCurrent = this.SPSFunctions[this.currentSPS].cameraDefault(this.cameraIndicies[this.currentSPS]); // :
                    (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = this.cameraSettingsCurrent.alpha;
                    (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = this.cameraSettingsCurrent.beta;
                    (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = this.cameraSettingsCurrent.radius; // * (x + y),
                }
            }

        this.SPSFunctions[this.currentSPS].mainUpdate();
    }

    remove = (): void => {
        // console.log('SingleSPSCube - remove');
        this.subscription.unsubscribe();

        clearTimeout(this.initialTimeout);
        clearInterval(this.conInterval);
        clearTimeout(this.conTimeout);
        clearInterval(this.expInterval);
        clearTimeout(this.expTimeout);

        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.SPS.dispose();
        this.SPS = null; // tells the GC the reference can be cleaned up also

        this.scene.unregisterBeforeRender(this.beforeRender);

        this.audioService = null;
        this.optionsService = null;
        this.messageService = null;
        this.engineService = null;
        this.colorsService = null;
        this.scene = null;
    }

    genPointsOnSphere = (numberOfPoints: number): void => {

        const dlong = Math.PI * (3 - Math.sqrt(5));
        const dz = 2 / numberOfPoints;
        let long = 0;
        let z = 1 - dz / 2;
        const rScale = 55;

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

        // console.log(this.ptsOnSphere);

    }


}
