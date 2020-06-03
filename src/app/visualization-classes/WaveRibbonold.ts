
import * as BABYLON from 'babylonjs';
import * as BMaterials from 'babylonjs-materials';

import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';

import { MaterialHelper } from 'babylonjs';

export class WaveRibbon {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private ribbon;
    // private mypaths = [];
    private maxDepth = 5;

    constructor(scene, audioService, optionsService, messageService, engineService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = -Math.PI / 2;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = Math.PI / 3;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1500;

        this.optionsService.smoothingConstant = 1;
        this.optionsService.sampleGain = 1;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');

    }



    create() {

        // const w = this.audioService.tdDataLength;
        // const h = this.audioService.tdHistoryArraySize;

        // let mypaths = [];
        // let colorsBuffer = [];

        // for (let z = 0; z < h; z++) {
        //     let path = [];
        //     for (let x = 0; x < w; x++) {
        //         path.push(new BABYLON.Vector3(x, 0, z * 100));
        //         colorsBuffer.push(new BABYLON.Color4(1, 1, 1, 1));
        //     }
        //     mypaths.push(path);
        // }

        // // tslint:disable-next-line: max-line-length
        // this.ribbon = BABYLON.MeshBuilder.CreateRibbon('ribbon', { pathArray: this.paths, colors: colorsBuffer, sideOrientation: 1, updatable: true }, this.scene);
        // // this.ribbon = BABYLON.MeshBuilder.CreateRibbon('ribbon', { pathArray: this.paths,  sideOrientation: 1, updatable: true }, this.scene);
        // this.ribbon.position.x = w / 2;
        // this.ribbon.position.z = 1000;
        // this.ribbon.position.y = -100;
        // this.ribbon.rotation.y = -Math.PI;

        // const mat = new BABYLON.StandardMaterial('myMaterial', this.scene);
        // mat.backFaceCulling = false;
        // mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        // mat.pointsCloud = true;
        // mat.specularColor = new BABYLON.Color3(.5, .5, .5);
        // // mat.ambientColor = new BABYLON.Color3(0, 0, 1);
        // // mat.emissiveColor = new BABYLON.Color3(0, 0, 1);
        // this.ribbon.material = mat;

        ////////////////////////

        // var mapSubX = 100;             // point number on X axis
        // var mapSubZ = 100;              // point number on Z axis
        var paths = [];                             // array for the ribbon model
        var colors = [];                             // array for the ribbon model
        const ww = this.audioService.tdDataLength;
        const h = this.audioService.tdHistoryArraySize;

        for (var l = 0; l < h; l++) {
            var path = [];                          // only for the ribbon
            for (var w = 0; w < ww; w++) {

                // var x = (w - ww * 0.5) * 2.0;
                // var z = (l - h * 0.5) * 20.0;
                // var y = 1;

                var x = w * 2.0;
                var z = l * 20.0;
                var y = 1;

                // colors of the map
                var r = 0;
                var g = 1;
                var b = 0; 
                colors.push(new BABYLON.Color4(r, g, b, 1));
                path.push(new BABYLON.Vector3(x, y, z));
            }
            paths.push(path);
        }
    
        this.ribbon = BABYLON.MeshBuilder.CreateRibbon("m", {pathArray: paths, colors:colors, sideOrientation: 1, updatable: true}, this.scene, );
        this.ribbon.rotation.y = Math.PI;
        this.ribbon.position.x = ww/2;

        const mat = new BABYLON.StandardMaterial('myMaterial', this.scene);
        mat.backFaceCulling = false;
        mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        mat.pointsCloud = true;
        mat.specularColor = new BABYLON.Color3(0,0,0);
        // mat.ambientColor = new BABYLON.Color3(0, 0, 1);
        // mat.emissiveColor = new BABYLON.Color3(0, 0, 1);
        this.ribbon.material = mat;
    }

    update() {
        const w = this.audioService.tdDataLength;  // dataset length + 1
        const h = this.audioService.tdHistoryArraySize;  // history length + 1
        let paths = [];
        let colorsBuffer: BABYLON.Color4[] = [];
        let path = [];

        for (let z = 0; z < h; z++) {
            const currentData = this.audioService.tdHistory[z];
            path = [];
             
            for (let x = 0; x < w; x++) {

                const r = currentData[x]/255;
                const g = (128 * x / 576)/255;
                const b = (255 - 128 * x / 350) /255;

                path.push(new BABYLON.Vector3(x, currentData[x] / 2, z * 25));
                colorsBuffer.push(new BABYLON.Color4(r, g, b, 1));
            }
            paths.push(path);
        }

        // tslint:disable-next-line: max-line-length
        this.ribbon = BABYLON.MeshBuilder.CreateRibbon(null, { pathArray: paths, colors: colorsBuffer, instance: this.ribbon});
        // this.ribbon = BABYLON.MeshBuilder.CreateRibbon(null, { pathArray: paths, instance: this.ribbon});
    }

    remove() {

        // this.ribbon.dispose();

    }
}
