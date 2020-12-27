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
    yy = 0;

    ribbonArray = []; // holds a list of objects made from arrays
    ribbonMaterialArray = [null, null, null];

    ribbonPaths = [];
    audioPaths = [];

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

        for (let a = 0; a <= 2 * Math.PI + Math.PI / 8; a += Math.PI / 8) {
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

        for (let a = 0; a <= 2 * Math.PI + Math.PI / 8; a += Math.PI / 8) {
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

        const ribbon = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: this.ribbonPaths, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true, closeArray: false, closePath: false}, this.scene);
        ribbon.material = new BABYLON.StandardMaterial("ribbonMaterial", this.scene);
        ribbon.material.wireframe = true;

        this.ribbonArray.push(ribbon);

        console.log('this.ribbonArray');
        console.log(this.ribbonArray);

    }

    update() {

        let offset = 32;
        for (let a = 0; a <= 2 * Math.PI + Math.PI / 8; a += Math.PI / 8) {
            let index = 0;
            for (let i = 0; i <= 32; i++) {

                this.yy = this.audioService.sample2[index + offset];
                this.yy = Math.pow(this.yy / 210, 5) * 800;

                this.audioPaths[index][i].x = Math.cos(a) * (this.yy + 100) ;
                this.audioPaths[index][i].z = Math.sin(a) * (this.yy + 100) ;

                this.audioPaths[index][i].y = (i - 32 / 2) * 100;
            }
            index++;
        }

        // console.log('this.ribbonPaths[0].length:');
        // console.log(this.ribbonPaths[0].length);
        // console.log('create Splines');

        this.ribbonPaths.forEach( (rp,i) => {
            let cSpine = BABYLON.Curve3.CreateCatmullRomSpline(this.audioPaths[i], this.nbPoints, this.closed);
            let trp = cSpine.getPoints(); 
            rp.forEach( (p,ii) => {
                p = trp[ii];
            });
        });

        // console.log('this.ribbonPaths[0].length');
        // console.log(this.ribbonPaths[0].length);

        this.ribbonArray[0] = BABYLON.MeshBuilder.CreateRibbon("ribbon", {pathArray: this.ribbonPaths, instance: this.ribbonArray[0]});

    }

    remove() {
        
        console.log('this.ribbonPaths');
        console.log(this.ribbonPaths);

        console.log('this.ribbonArray');
        console.log(this.ribbonArray);

        this.ribbonArray.forEach(  (ra) => {
            ra.dispose();  
        })

        this.audioService = null;
        this.engineService = null;
        this.colorsService = null;
        this.optionsService = null;
        this.scene = null;
    }

}

