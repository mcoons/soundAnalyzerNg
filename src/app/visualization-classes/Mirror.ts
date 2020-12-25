import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

import { OnDestroy } from '@angular/core';
import { OptionsService } from '../services/options/options.service';

// import { map } from './utilities.js';

export class Mirror implements OnDestroy {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private colorsService: ColorsService;
    private optionsService: OptionsService;

    masterParent = new BABYLON.TransformNode('mainParent');
    nbPoints = 3;                     // the number of points between each Vector3 control points
    closed = false;                     // closes the curve when true
    index = 0;
    yy = 0;
    // tmpMesh;
    theta = 0;
    material;
    mat;
    mesh1;

    // private SPS;

    // radiusArray = [200, 175, 150]
    // indexDeltaArray = [32, 96, 128];
    // pointsArray = [[], [], []];
    ribbonArray = [];
    ribbonMaterialArray = [null, null, null];
    // newPathArray = [[], [], []];
    // catmullRomArray = [null, null, null];

    ribbonPaths = [];
    audioPaths = [];

    // scaleValuesArray = [
    //     {}
    // ]

    // myPathArray = [
    //     [
    //         new BABYLON.Vector3(0, 0, -35),
    //         new BABYLON.Vector3(0, 0, -25),
    //         new BABYLON.Vector3(0, 0, 0),
    //         new BABYLON.Vector3(0, 0, 25),
    //         new BABYLON.Vector3(0, 0, 35)
    //     ],
    //     [
    //         new BABYLON.Vector3(0, 0, -45),
    //         new BABYLON.Vector3(0, 0, -35),
    //         new BABYLON.Vector3(0, 0, 0),
    //         new BABYLON.Vector3(0, 0, 35),
    //         new BABYLON.Vector3(0, 0, 45)
    //     ],
    //     [
    //         new BABYLON.Vector3(0, 0, -55),
    //         new BABYLON.Vector3(0, 0, -45),
    //         new BABYLON.Vector3(0, 0, 0),
    //         new BABYLON.Vector3(0, 0, 45),
    //         new BABYLON.Vector3(0, 0, 55)
    //     ]
    // ];

    // scaleFnArray = [
    //     (i, distance) => {
    //         if (i === 2) {
    //             return 1.08;
    //         }
    //         else if (i === 1 || i === 3) {
    //             return 1.08;
    //         } else {
    //             return 1;
    //         }
    //     },
    //     (i, distance) => {
    //         if (i === 2) {
    //             return 1.08;
    //         }
    //         else if (i === 1 || i === 3) {
    //             return 1.08;
    //         } else {
    //             return 1;
    //         }
    //     },
    //     (i, distance) => {
    //         if (i === 2) {
    //             return 1.1;
    //         }
    //         else if (i === 1 || i === 3) {
    //             return 1.1;
    //         } else {
    //             return 1;
    //         }
    //     }
    // ];

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;
        this.colorsService = colorsService;
        this.optionsService = optionsService;

    }

    ngOnDestroy = () => {
        this.remove();
    }

    create() {

        let mat = new BABYLON.StandardMaterial('ballMat', this.scene);
        mat.maxSimultaneousLights = 8;
        mat.diffuseColor = BABYLON.Color3.FromHexString('#ffffff');
        mat.emissiveColor = BABYLON.Color3.FromHexString('#000000');

        const colorArray = ['#ffffff', '#dddddd', '#bbbbbb'];

        this.ribbonMaterialArray.forEach((m, i) => {
            this.ribbonMaterialArray[i] = new BABYLON.StandardMaterial('tubeMat' + i, this.scene);
            this.ribbonMaterialArray[i].maxSimultaneousLights = 8;
            this.ribbonMaterialArray[i].diffuseColor = BABYLON.Color3.FromHexString(colorArray[i]);
            // this.ribbonMaterialArray[i].bumpTexture = new BABYLON.Texture('../../assets/mats/normal1.jpg', this.scene);
            // this.ribbonMaterialArray[i].bumpTexture.uScale = i*2;
            // this.ribbonMaterialArray[i].bumpTexture.vScale = i*2;   
            // this.ribbonMaterialArray[i].diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse1.jpg', this.scene);
            // this.ribbonMaterialArray[i].diffuseTexture.uScale = i*2;
            // this.ribbonMaterialArray[i].diffuseTexture.vScale = i*2;   
            // this.ribbonMaterialArray[i].emissiveTexture = new BABYLON.Texture('../../assets/mats/normal.jpg', this.scene);
            // this.ribbonMaterialArray[i].emissiveTexture.uScale = i*2;
            // this.ribbonMaterialArray[i].emissiveTexture.vScale = i*2;   

        });

        this.material = new BABYLON.StandardMaterial('ballMat', this.scene);
        this.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.material.maxSimultaneousLights = 8;

        ////////////
        this.ribbonArray = [];

        this.audioPaths = [];
        for (let a = 0; a <= 2 * Math.PI; a += Math.PI / 8) {
            const path = [];
            for (let i = 0; i < 32; i++) {
                let x = 200 * Math.cos(a);
                let z = 200 * Math.sin(a);
                let y = (i - 32/2) * 100;
                path.push(new BABYLON.Vector3(x, y, z))
            }
            path.push(path[0]); // close circle
            this.audioPaths.push(path);
        }

        console.log('this.audioPaths');
        console.log(this.audioPaths);

        this.ribbonPaths = [];
        for (let a = 0; a <= 2 * Math.PI; a += Math.PI / 8) {
            const path = [];
            for (let i = 0; i < 32 * this.nbPoints + 1; i++) {
                let x = 200 * Math.cos(a);
                let z = 200 * Math.sin(a);
                let y = (i - 32/2) * 100;
                path.push(new BABYLON.Vector3(x, y, z))
            }
            // path.push(path[0]); // close circle
            this.ribbonPaths.push(path)
        }
        
        console.log('this.ribbonPaths');
        console.log(this.ribbonPaths);

        const ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: this.ribbonPaths, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true, closeArray: true, closePath: false}, this.scene);
        ribbon.material = new BABYLON.StandardMaterial("ribbonMaterial", this.scene);
        ribbon.material.wireframe = true;

        this.ribbonArray.push(ribbon);

        console.log('this.ribbonArray');
        console.log(this.ribbonArray);

        // for (let theta = Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2; theta += Math.PI / 32) {
        //     this.pointsArray[0].push(new BABYLON.Vector3(0, 0, 0));
        //     this.pointsArray[1].push(new BABYLON.Vector3(0, 0, 0));
        //     this.pointsArray[2].push(new BABYLON.Vector3(0, 0, 0));

        // }

        // var oldpoints = [];

        // // LOOP 192    64 * 3   64 * this.nbPoints + 1
        // // 96
        // for (let i = 0; i < 32 * this.nbPoints + 1; i++) {
        //     oldpoints.push(new BABYLON.Vector3(0, 0, 0));
        // }

        // LOOP 7
        // this.ribbonArray.forEach((t, i) => {
        //     // this.ribbonArray[i] = BABYLON.MeshBuilder.ExtrudeShape('tube' + i, { shape: oldpoints, path: this.myPathArray[i], sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3, updatable: true }, this.scene);
        //     this.ribbonArray[i] = BABYLON.MeshBuilder.CreateLathe("lathe" + i, { shape:oldpoints, radius:1, tessellation: 64, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true },this.scene);
        //     this.ribbonArray[i].material = this.ribbonMaterialArray[i];
        //     this.ribbonArray[i].position.x = 50 * i - 75;
        //     this.ribbonArray[i].setParent(this.masterParent);
        // })

        // this.masterParent.rotation.x = Math.PI;
    }

    update() {


        // this.engineService.lightParent.rotation.x += .001;
        // this.engineService.lightParent.rotation.y -= .002;
        // this.engineService.lightParent.rotation.z += .003;

        // if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].autoRotate.value) {
        //     // this.masterParent.rotation.x += .03;
        //     this.masterParent.rotation.y += .01;
        //     // this.masterParent.rotation.z += .01;
        // }

        // this.index = 0;

        // LOOP 64
        // // Calculate the main audio based data points for each tube to use for the spline curve calculation
        // for (let theta = Math.PI / 2; theta <= Math.PI + Math.PI / 2; theta += Math.PI / 32) {
        //     // LOOP 7
        //     this.pointsArray.forEach((pa, i) => {
        //         this.yy = this.audioService.sample2[this.index + this.indexDeltaArray[i]];
        //         this.yy = Math.pow(this.yy / ((i === 6 ? 190 : 210) - 4 * i), (8 - i / 2)) * (800 - (i === 6 ? 170 : 180) * i);
        //         pa[this.index].x = (this.radiusArray[i] + this.yy) * Math.cos(theta);
        //         pa[this.index].y = (this.radiusArray[i] + this.yy) * Math.sin(theta);
        //     });

        //     this.index++;
        // }

        // // LOOP 7
        // // Calculate all spline curves using the audio based points and update the tubes
        // // for (let i = 0; i < 3; i++) {
        //     this.catmullRomArray[0] = BABYLON.Curve3.CreateCatmullRomSpline(this.pointsArray[0], this.nbPoints, this.closed);
        //     this.newPathArray[0] = this.catmullRomArray[0].getPoints();
        //     // this.ribbonArray[i] = BABYLON.MeshBuilder.ExtrudeShapeCustom('tube' + i, { shape: this.newPathArray[i], path: this.myPathArray[i], instance: this.ribbonArray[i], scaleFunction: this.scaleFnArray[i] });
        //     // this.ribbonArray[i] = BABYLON.MeshBuilder.CreateLathe("lathe" + i, { shape: this.newPathArray[i], instance: this.ribbonArray[i] });

        // // }


        let offset = 128;
        let index = 0;
        for (let a = 0; a <= 2 * Math.PI; a += Math.PI / 8) {
            for (let i = 0; i < 32; i++) {


                this.yy = this.audioService.sample2[this.index + offset];
                this.yy = Math.pow(this.yy / 210, 8) * 800;

                this.audioPaths[index][i].x = Math.cos(a) * (this.yy + 100) ;
                this.audioPaths[index][i].z = Math.sin(a) * (this.yy + 100) ;
                this.audioPaths[index][i].y = (i - 32 / 2) * 100;
            }
            index++;
        }

        this.ribbonPaths.forEach( (rp,i) => {
            let cSpine = BABYLON.Curve3.CreateCatmullRomSpline(this.audioPaths[i], this.nbPoints, this.closed);
            this.ribbonPaths[i] = cSpine.getPoints();
        })

        this.ribbonArray[0] = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: this.ribbonPaths, instance: this.ribbonArray[0]});


    }

    remove() {

        this.ribbonArray[0].dispose();
        // this.ribbonArray[1].dispose();
        // this.ribbonArray[2].dispose();

        this.audioService = null;
        this.engineService = null;
        this.colorsService = null;
        this.optionsService = null;
        this.scene = null;
    }

}
