import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

import { OnDestroy } from '@angular/core';
import { OptionsService } from '../services/options/options.service';

// import { map } from './utilities.js';

export class Morph implements OnDestroy {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private colorsService: ColorsService;
    private optionsService: OptionsService;

    masterParent = new BABYLON.TransformNode('mainParent');
    nbPoints = 8;                     // the number of points between each Vector3 control points
    closed = false;                     // closes the curve when true
    index = 0;
    yy = 0;
    tmpMesh;
    theta = 0;
    material;
    mat;
    mesh1;

    private SPS;

    radiusArray = [200, 175, 150, 125, 100, 75, 50]
    indexDeltaArray = [0, 32, 64, 96, 112, 128, 160];
    // zOffsetArray = [25, 45, 65, 85, 105];
    pointsArray = [[], [], [], [], [], [], []];
    tubeArray = [null, null, null, null, null, null, null];
    tubeMaterialArray = [null, null, null, null, null, null, null];
    // ballsGroupArray = [[], [], [], [], [], []];
    // duplicatesArray = [[], [], [], [], []];
    newPathArray = [[], [], [], [], [], [], []];
    catmullRomArray = [null, null, null, null, null, null, null];


    scaleValuesArray = [
        {}
    ]

    myPathArray = [
        [
            new BABYLON.Vector3(0, 0, -35),
            new BABYLON.Vector3(0, 0, -25),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 25),
            new BABYLON.Vector3(0, 0, 35)
        ],
        [
            new BABYLON.Vector3(0, 0, -45),
            new BABYLON.Vector3(0, 0, -35),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 35),
            new BABYLON.Vector3(0, 0, 45)
        ],
        [
            new BABYLON.Vector3(0, 0, -55),
            new BABYLON.Vector3(0, 0, -45),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 45),
            new BABYLON.Vector3(0, 0, 55)
        ],
        [
            new BABYLON.Vector3(0, 0, -65),
            new BABYLON.Vector3(0, 0, -55),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 55),
            new BABYLON.Vector3(0, 0, 65)
        ],
        [
            new BABYLON.Vector3(0, 0, -75),
            new BABYLON.Vector3(0, 0, -65),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 65),
            new BABYLON.Vector3(0, 0, 75)
        ],
        [
            new BABYLON.Vector3(0, 0, -85),
            new BABYLON.Vector3(0, 0, -75),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 75),
            new BABYLON.Vector3(0, 0, 85)
        ],
        [
            new BABYLON.Vector3(0, 0, -95),
            new BABYLON.Vector3(0, 0, -85),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 85),
            new BABYLON.Vector3(0, 0, 95)
        ]
    ];

    scaleFnArray = [
        (i, distance) => {
            if (i === 2) {
                return 1.08;
            }
            else if (i === 1 || i === 3) {
                return 1.08;
            } else {
                return 1;
            }
        },
        (i, distance) => {
            if (i === 2) {
                return 1.08;
            }
            else if (i === 1 || i === 3) {
                return 1.08;
            } else {
                return 1;
            }
        },
        (i, distance) => {
            if (i === 2) {
                return 1.1;
            }
            else if (i === 1 || i === 3) {
                return 1.1;
            } else {
                return 1;
            }
        },
        (i, distance) => {
            if (i === 2) {
                return 1.13;
            }
            else if (i === 1 || i === 3) {
                return 1.13;
            } else {
                return 1;
            }
        },
        (i, distance) => {
            if (i === 2) {
                return 1.18;
            }
            else if (i === 1 || i === 3) {
                return 1.18;
            } else {
                return 1;
            }
        },
        (i, distance) => {
            if (i === 2) {
                return 1.24;
            }
            else if (i === 1 || i === 3) {
                return 1.24;
            } else {
                return 1;
            }
        },
        (i, distance) => {
            if (i === 2) {
                return 1.35;
            }
            else if (i === 1 || i === 3) {
                return 1.35;
            } else {
                return 1;
            }
        }
    ];

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;
        this.colorsService = colorsService;
        this.optionsService = optionsService;

        this.scene.registerBeforeRender(this.beforeRender);
    }

    beforeRender = () => {
        this.SPS.setParticles();
    }

    ngOnDestroy = () => {
        this.remove();
    }

    create() {

        let mat = new BABYLON.StandardMaterial('ballMat', this.scene);
        mat.maxSimultaneousLights = 8;
        mat.diffuseColor = BABYLON.Color3.FromHexString('#ffffff');
        mat.emissiveColor = BABYLON.Color3.FromHexString('#000000');

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

        const innerPositionFunction = (particle, i, s) => {

        };

        this.SPS.updateParticle = (particle) => {

        };

        // for (let count = 0; count < 2123; count++) {
        //     this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls1-' + count, { diameter: 4, segments: 16, updatable: true }, this.scene);
        //     this.tmpMesh.material = mat;

        //     this.tmpMesh.setParent(this.masterParent);
        //     // this.ballsGroupArray[0].push(this.tmpMesh);
        //     this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

        //     this.SPS.addShape(this.tmpMesh, 1, { positionFunction: innerPositionFunction});
        // }

        const colorArray = ['#ffffff', '#dddddd', '#bbbbbb', '#999999', '#777777', '#555555', '#ffffff'];

        this.tubeMaterialArray.forEach((m, i) => {
            this.tubeMaterialArray[i] = new BABYLON.StandardMaterial('tubeMat' + i, this.scene);
            this.tubeMaterialArray[i].maxSimultaneousLights = 8;
            this.tubeMaterialArray[i].diffuseColor = BABYLON.Color3.FromHexString(colorArray[i]);
            // this.tubeMaterialArray[i].bumpTexture = new BABYLON.Texture('../../assets/mats/normal1.jpg', this.scene);
            // this.tubeMaterialArray[i].bumpTexture.uScale = i*2;
            // this.tubeMaterialArray[i].bumpTexture.vScale = i*2;   
            // this.tubeMaterialArray[i].diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse1.jpg', this.scene);
            // this.tubeMaterialArray[i].diffuseTexture.uScale = i*2;
            // this.tubeMaterialArray[i].diffuseTexture.vScale = i*2;   
            // this.tubeMaterialArray[i].emissiveTexture = new BABYLON.Texture('../../assets/mats/normal.jpg', this.scene);
            // this.tubeMaterialArray[i].emissiveTexture.uScale = i*2;
            // this.tubeMaterialArray[i].emissiveTexture.vScale = i*2;   

        });

        this.material = new BABYLON.StandardMaterial('ballMat', this.scene);
        this.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.material.maxSimultaneousLights = 8;

        ////////////

        for (let theta = Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2; theta += Math.PI / 32) {
            this.pointsArray[0].push(new BABYLON.Vector3(0, 0, 0));
            this.pointsArray[1].push(new BABYLON.Vector3(0, 0, 0));
            this.pointsArray[2].push(new BABYLON.Vector3(0, 0, 0));
            this.pointsArray[3].push(new BABYLON.Vector3(0, 0, 0));
            this.pointsArray[4].push(new BABYLON.Vector3(0, 0, 0));
            this.pointsArray[5].push(new BABYLON.Vector3(0, 0, 0));
            this.pointsArray[6].push(new BABYLON.Vector3(0, 0, 0));
        }

        var oldpoints = [];

        // LOOP 192    64 * 3   64 * this.nbPoints + 1
        // for (let i = 0; i < 193; i++) {
        for (let i = 0; i < 64 * this.nbPoints + 1; i++) {
            oldpoints.push(new BABYLON.Vector3(0, 0, 0));
        }

        // LOOP 7
        this.tubeArray.forEach((t, i) => {
            this.tubeArray[i] = BABYLON.MeshBuilder.ExtrudeShape('tube' + i, { shape: oldpoints, path: this.myPathArray[i], sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3, updatable: true }, this.scene);
            this.tubeArray[i].material = this.tubeMaterialArray[i];
            this.tubeArray[i].setParent(this.masterParent);
        })

        this.masterParent.rotation.x = Math.PI;
    }

    update() {
        this.engineService.lightParent.rotation.x += .001;
        this.engineService.lightParent.rotation.y -= .002;
        this.engineService.lightParent.rotation.z += .003;

        if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].autoRotate.value) {
            // this.masterParent.rotation.x += .03;
            this.masterParent.rotation.y += .01;
            // this.masterParent.rotation.z += .01;
        }

        this.index = 0;

        // LOOP 64
        // Calculate the main audio based data points for each tube to use for the spline curve calculation
        for (let theta = Math.PI / 2; theta <= Math.PI + Math.PI / 2; theta += Math.PI / 32) {
            // LOOP 7
            this.pointsArray.forEach((pa, i) => {
                this.yy = this.audioService.sample2[this.index + this.indexDeltaArray[i]];
                this.yy = Math.pow(this.yy / ((i === 6 ? 190 : 210) - 4 * i), (8 - i / 2)) * (800 - (i === 6 ? 170 : 180) * i);
                pa[this.index].x = (this.radiusArray[i] + this.yy) * Math.cos(theta);
                pa[this.index].y = (this.radiusArray[i] + this.yy) * Math.sin(theta);
                pa[pa.length - this.index - 1].x = -((this.radiusArray[i] + this.yy) * Math.cos(theta));
                pa[pa.length - this.index - 1].y = (this.radiusArray[i] + this.yy) * Math.sin(theta);
            });

            this.index++;
        }

        // LOOP 7
        // Calculate all spline curves using the audio based points and update the tubes
        for (let i = 0; i < 7; i++) {
            this.catmullRomArray[i] = BABYLON.Curve3.CreateCatmullRomSpline(this.pointsArray[i], this.nbPoints, this.closed);
            this.newPathArray[i] = this.catmullRomArray[i].getPoints();
            this.tubeArray[i] = BABYLON.MeshBuilder.ExtrudeShapeCustom('tube' + i, { shape: this.newPathArray[i], path: this.myPathArray[i], instance: this.tubeArray[i], scaleFunction: this.scaleFnArray[i] });
        }


    }

    remove() {

        // this.SPS.mesh.dispose();
        // this.mesh1.dispose();
        // this.SPS.dispose();
        // this.SPS = null; // tells the GC the reference can be cleaned up also

        this.engineService.scene.activeCamera = this.engineService.camera1;

        this.tubeArray[0].dispose();
        this.tubeArray[1].dispose();
        this.tubeArray[2].dispose();
        this.tubeArray[3].dispose();
        this.tubeArray[4].dispose();
        this.tubeArray[5].dispose();
        this.tubeArray[6].dispose();

        this.scene.unregisterBeforeRender(this.beforeRender);

        this.audioService = null;
        this.engineService = null;
        this.colorsService = null;
        this.optionsService = null;
        this.scene = null;
    }

}