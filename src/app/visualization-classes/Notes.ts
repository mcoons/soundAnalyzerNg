
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';
// import { MaterialHelper } from 'babylonjs';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { OnDestroy } from '@angular/core';


export class Notes implements OnDestroy{

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private colorsService: ColorsService;

    private ground;

    private notes = [];
    private noteStr = ['G ', 'G#', 'A ', 'A#', 'B ', 'C ', 'C#', 'D ', 'D#', 'E ', 'F ', 'F#'];
    private noteIndex = [73, 77, 82, 87, 92, 33, 39, 45, 52, 58, 65, 69];
    private SPS;

    theta = 0;
    material;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;
        this.colorsService = colorsService;

        this.scene.registerBeforeRender(this.beforeRender);

    }

    ngOnDestroy = () => {
        this.remove();
    }

    beforeRender = () => {
        this.SPS.setParticles();
    }

    create() {

        // Set font
        let font_size = 48;
        const font = 'bold ' + font_size + 'px Arial';

        // Set height for plane
        const planeHeight = 3;

        // Set height for dynamic texture
        const DTHeight = 1.5 * font_size; // or set as wished

        // Calcultae ratio
        const ratio = planeHeight / DTHeight;

        // Set text
        let text = 'Some words';

        // Use a temporay dynamic texture to calculate the length of the text on the dynamic texture canvas
        // const temp = new BABYLON.DynamicTexture('DynamicTexture', 64, scene);
        // const tmpctx = temp.getContext();
        // tmpctx.font = font;
        // const DTWidth = tmpctx.measureText(text).width + 8;

        // Calculate width the plane has to be 
        // const planeWidth = DTWidth * ratio;



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


        const myShape = [
            new BABYLON.Vector3(-1, -1.732 / 2, 0),
            new BABYLON.Vector3(1, -1.732 / 2, 0),
            new BABYLON.Vector3(0, 1.732 / 2, 0),
            new BABYLON.Vector3(-1, -1.732 / 2, 0)
        ];

        myShape.push(myShape[0]);  // close profile

        const myPath = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 1)
        ];


        const extrusion = BABYLON.MeshBuilder.ExtrudeShape('star', { shape: myShape, path: myPath, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3 }, this.scene);

        extrusion.setPivotMatrix(BABYLON.Matrix.Identity());

        extrusion.rotation.x = -Math.PI / 2;
        //    extrusion.position = new BABYLON.Vector3(0,0,0);


        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

        const buildT = () => {
            const radius = 500;
            // let theta;
            let x;
            let y;
            let z;


            const innerPositionFunction = (particle, i, s) => {
                // console.log('In Build0 innerPosition for of notes.create', i);
                const row = 10 - Math.floor(particle.idx / 10);
                const column = particle.idx % 10;

                particle.scaling.x = 1;
                particle.scaling.y = 1;
                particle.scaling.z = 1;
                particle.position.x = x;
                particle.position.z = y;
                particle.position.y = 0;
                particle.rotation.x = Math.PI / 2;
                particle.rotation.z = i % 2 ? Math.PI : 0;


            };

            z = 0;
            for (let index = 0; index < 576; index++) {
                this.SPS.addShape(extrusion, 1, { positionFunction: innerPositionFunction });
                z += 1 / 32;
            }
        };

        buildT();

        extrusion.dispose();

        this.SPS.updateParticle = (particle) => {

            const index = particle.idx + 1;

            // const row = 6 - Math.floor(particle.idx / 10);
            const row = Math.ceil(Math.sqrt(index));
            const startingRowIndex = ((row - 1) * (row - 1) + 1);
            const rowEndingIndex = row * row;
            const column = index - startingRowIndex;


            particle.color.r = ((index - startingRowIndex) % 2) ? 255 : 0;

            particle.position.x = (column - row) + 1;


            particle.position.z = -row * 1.732;

            particle.rotation.z = (index - startingRowIndex) % 2 ? Math.PI : 0;

            particle.position.z = particle.position.z + 1;


            let y = this.audioService.sample1[particle.idx];
            // y = (this.y / 200 * this.y / 200) * 255;

            particle.scaling.z = -y/255;

            let c = this.colorsService.colors(y);

            particle.color.r = c.r / 255;
            particle.color.g = c.g / 255;
            particle.color.b = c.b / 255;


        }


        this.SPS.buildMesh();
        this.SPS.mesh.material = this.material;
        this.SPS.material = this.material;

        this.SPS.mesh.position.z = 500;

        this.SPS.mesh.scaling.x = 20;
        this.SPS.mesh.scaling.y = 20;
        this.SPS.mesh.scaling.z = 20;

        this.SPS.mesh.position.y = -50;


    }

    update() {


        let color; // = this.colorsService.colors(this.y1);
        let noteMin = Math.min(...this.audioService.noteAvgs);

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

    remove() {
        this.engineService.scene.activeCamera = this.engineService.camera1;

        
        this.notes.forEach(n => n.dispose());
        
        this.SPS.mesh.dispose();
        // this.mesh.dispose();
        this.SPS.dispose();
        this.SPS = null; // tells the GC the reference can be cleaned up also
        
        this.scene.unregisterBeforeRender(this.beforeRender);
        
        this.audioService = null;
        // this.optionsService = null;
        // this.messageService = null;
        this.engineService = null;
        this.colorsService = null;
        this.scene = null;
  
        

    }
}
