
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';
import { MaterialHelper } from 'babylonjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


export class Notes {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private colorsService: ColorsService;

    private ground;

    private notes = [];
    private noteStr = ['G ', 'G#', 'A ', 'A#', 'B ', 'C ', 'C#', 'D ', 'D#', 'E ', 'F ', 'F#'];
    private noteIndex = [73, 77, 82, 87, 92, 33, 39, 45, 52, 58, 65, 69];

    theta = 0;
    material;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;
        this.colorsService = colorsService;


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


    }

    update() {


        let color; // = this.colorsService.colors(this.y1);
        let noteMin = Math.min(...this.audioService.noteAvgs);

        this.audioService.noteAvgs.forEach( (a, i) => {
            color = this.colorsService.colors(a*2.5);

            this.notes[i].position.y = (a - noteMin)/2;

            this.notes[i].material.diffuseColor.r = color.r/255;
            this.notes[i].material.diffuseColor.g = color.g/255;
            this.notes[i].material.diffuseColor.b = color.b/255;

            this.notes[i].scaling.x = 1 + a/350;
            this.notes[i].scaling.y = 1 + a/350;
            this.notes[i].scaling.z = 1 + a/350;
        } );
    }

    remove() {
        this.engineService.scene.activeCamera = this.engineService.camera1;

        this.audioService = null;
        this.engineService = null;
        this.scene = null;

        this.notes.forEach(n => n.dispose());
    }
}
