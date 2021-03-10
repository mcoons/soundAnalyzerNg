
// import * as BABYLON from 'babylonjs';
// import { AudioService } from '../services/audio/audio.service';

// import { EngineService } from '../services/engine/engine.service';
// import { ColorsService } from '../services/colors/colors.service';

// import { OnDestroy } from '@angular/core';
// import { OptionsService } from '../services/options/options.service';
// import { MessageService } from '../services/message/message.service';

// export class Notes implements OnDestroy {

//     private scene: BABYLON.Scene;
//     private audioService: AudioService;
//     private engineService: EngineService;
//     private colorsService: ColorsService;

//     private notes = [];
//     private noteStr = ['G ', 'G#', 'A ', 'A#', 'B ', 'C ', 'C#', 'D ', 'D#', 'E ', 'F ', 'F#'];
//     private noteIndex = [73, 77, 82, 87, 92, 33, 39, 45, 52, 58, 65, 69];

//     theta = 0;
//     material;
//     mat;
//     mesh1;





//     private SPS;
//     nbPoints = 8;                     // the number of points between each Vector3 control points
//     audioValues;
//     pointsArray = [];
//     curveArray;
//     catmullRomArray;
//     SPSMesh;
//     y;



//     constructor(scene: BABYLON.Scene, audioService: AudioService, optionsService: OptionsService, messageService: MessageService, engineService: EngineService, colorsService: ColorsService) {

//         this.scene = scene;
//         this.audioService = audioService;
//         this.engineService = engineService;
//         this.colorsService = colorsService;

//         this.material = new BABYLON.StandardMaterial('ballMat', this.scene);
//         this.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
//         this.material.maxSimultaneousLights = 8;

//         this.scene.registerBeforeRender(this.beforeRender);

//     }

//     beforeRender = (): void => {
//         this.SPS.setParticles();
//     }

//     ngOnDestroy = (): void => {
//         this.remove();
//     }

//     create(): void {

//         // Set font
//         const font_size = 48;
//         const font = 'bold ' + font_size + 'px Arial';


//         // Set text
//         let text = 'Some words';



//         this.noteStr.forEach((s, i) => {
//             // Create dynamic texture and write the text
//             const dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', { width: 500, height: 300 }, this.scene, false);


//             const ballMat = new BABYLON.StandardMaterial('ballMat', this.scene);
//             ballMat.maxSimultaneousLights = 8;

//             ballMat.diffuseTexture = dynamicTexture;
//             text = this.noteStr[i] + '              ' + this.noteStr[i];
//             dynamicTexture.drawText(text, null, null, font, '#000000', '#ffffff', true);

//             const stickMat = new BABYLON.StandardMaterial('ballMat', this.scene);
//             stickMat.diffuseColor = new BABYLON.Color3(.2, .2, .2);
//             stickMat.maxSimultaneousLights = 8;

//             const ball = BABYLON.MeshBuilder.CreateSphere(s,
//                 { segments: 32, diameterX: 30, diameterY: 25, diameterZ: 10, updatable: true }, this.scene);
//             ball.rotation.z = Math.PI;

//             ball.material = ballMat;

//             const stick = BABYLON.MeshBuilder.CreateCylinder('stick' || s, { height: 50, diameter: 4 }, this.scene);
//             stick.position.x = -13;
//             stick.position.y = -25;
//             stick.material = stickMat;

//             stick.parent = ball;

//             ball.position.x = 50 * i - 275;
//             ball.position.y = 0;
//             this.notes.push(ball);

//         });



//         this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

//         for (let i = 0; i < 64 * this.nbPoints + 1; i++) {
//             this.pointsArray.push(new BABYLON.Vector3(0, 0, 0));
//         }

//         const innerPositionFunction = (particle, i) => {

//             particle.position.x = (i % 32 ) * 50 - 16 * 50;
//             particle.position.z = Math.floor( i / 32 ) * 50 - 8 * this.nbPoints * 25;
//             particle.position.y = 0;
//         };

//         const sphere = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 2, segments: 2, updatable: true }, this.scene);


//         this.SPS.addShape(sphere, 4096, { positionFunction: innerPositionFunction });

//         sphere.dispose();

//         this.SPSMesh = this.SPS.buildMesh();
        
//         this.SPS.updateParticle = (particle) => {
//             this.y = this.curveArray[particle.idx].y;
//             this.y = (this.y / 200 * this.y / 200) * 255;
//             // console.log(this.y);
//             particle.position.y = this.y/5 - 100;
//         };

//     }
    

//     update(): void {


//         let color; // = this.colorsService.colors(y1);
//         let noteMin = Math.min(...this.audioService.noteAvgs);

//         // console.log(noteMin);

//         this.audioService.noteAvgs.forEach((a, i) => {
//             color = this.colorsService.colors(a * 2.5);

//             this.notes[i].position.y = (a - noteMin) / 2;

//             this.notes[i].material.diffuseColor.r = color.r / 255;
//             this.notes[i].material.diffuseColor.g = color.g / 255;
//             this.notes[i].material.diffuseColor.b = color.b / 255;

//             this.notes[i].scaling.x = 1 + a / 350;
//             this.notes[i].scaling.y = 1 + a / 350;
//             this.notes[i].scaling.z = 1 + a / 350;

//         });

//         this.pointsArray.forEach( (p,i) => p.y = this.audioService.sample2[i]);


//         this.catmullRomArray = BABYLON.Curve3.CreateCatmullRomSpline(this.pointsArray, this.nbPoints, false);
//         this.curveArray = this.catmullRomArray.getPoints();
//         // console.log(this.curveArray[500]);
//     }

//     remove(): void {
//         this.engineService.scene.activeCamera = this.engineService.camera1;

//         this.notes.forEach(n => n.dispose());

//         this.SPS.mesh.dispose();
//         this.SPSMesh.dispose();
//         this.SPS.dispose();
//         this.SPS = null; // tells the GC the reference can be cleaned up also

//         this.scene.unregisterBeforeRender(this.beforeRender);

//         this.audioService = null;
//         this.engineService = null;
//         this.colorsService = null;
//         this.scene = null;

//     }
// }


import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

import { OnDestroy } from '@angular/core';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';

export class Notes implements OnDestroy {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private colorsService: ColorsService;

    private notes = [];
    private noteStr = ['G ', 'G#', 'A ', 'A#', 'B ', 'C ', 'C#', 'D ', 'D#', 'E ', 'F ', 'F#'];
    private noteIndex = [73, 77, 82, 87, 92, 33, 39, 45, 52, 58, 65, 69];

    theta = 0;
    material;
    mat;
    mesh1;

    private SPS;

    constructor(scene: BABYLON.Scene, audioService: AudioService, optionsService: OptionsService, messageService: MessageService, engineService: EngineService, colorsService: ColorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;
        this.colorsService = colorsService;

        this.material = new BABYLON.StandardMaterial('ballMat', this.scene);
        this.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.material.maxSimultaneousLights = 8;

        this.scene.registerBeforeRender(this.beforeRender);

    }

    beforeRender = (): void => {
        // this.SPS.setParticles();
    }

    ngOnDestroy = (): void => {
        this.remove();
    }

    create(): void {

        // Set font
        const font_size = 48;
        const font = 'bold ' + font_size + 'px Arial';


        // Set text
        let text = 'Some words';



        this.noteStr.forEach((s, i) => {
            // Create dynamic texture and write the text
            const dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', { width: 500, height: 300 }, this.scene, false);


            const ballMat = new BABYLON.StandardMaterial('ballMat', this.scene);
            ballMat.maxSimultaneousLights = 8;

            ballMat.diffuseTexture = dynamicTexture;
            text = this.noteStr[i] + '              ' + this.noteStr[i];
            dynamicTexture.drawText(text, null, null, font, '#000000', '#ffffff', true);

            const stickMat = new BABYLON.StandardMaterial('ballMat', this.scene);
            stickMat.diffuseColor = new BABYLON.Color3(.2, .2, .2);
            stickMat.maxSimultaneousLights = 8;

            const ball = BABYLON.MeshBuilder.CreateSphere(s,
                { segments: 32, diameterX: 30, diameterY: 25, diameterZ: 10, updatable: true }, this.scene);
            ball.rotation.z = Math.PI;

            ball.material = ballMat;

            const stick = BABYLON.MeshBuilder.CreateCylinder('stick' || s, { height: 50, diameter: 4 }, this.scene);
            stick.position.x = -13;
            stick.position.y = -25;
            stick.material = stickMat;

            stick.parent = ball;

            ball.position.x = 50 * i - 275;
            ball.position.y = 0;
            this.notes.push(ball);

        });

    }

    update(): void {


        let color; // = this.colorsService.colors(y1);
        const noteMin = Math.min(...this.audioService.noteAvgs);

        this.audioService.noteAvgs.forEach((a, i) => {
            color = this.colorsService.colors(a * 2.5);

            this.notes[i].position.y = (a - noteMin) / 2;

            this.notes[i].material.diffuseColor.r = color.r / 255;
            this.notes[i].material.diffuseColor.g = color.g / 255;
            this.notes[i].material.diffuseColor.b = color.b / 255;

            this.notes[i].scaling.x = 1 + a / 350;
            this.notes[i].scaling.y = 1 + a / 350;
            this.notes[i].scaling.z = 1 + a / 350;

        });

    }

    remove(): void {
        this.engineService.scene.activeCamera = this.engineService.camera1;

        this.notes.forEach(n => n.dispose());

        this.scene.unregisterBeforeRender(this.beforeRender);

        this.audioService = null;
        this.engineService = null;
        this.colorsService = null;
        this.scene = null;

    }
}