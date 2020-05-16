
import { AudioService } from '../services/audio/audio.service';
import * as BABYLON from 'babylonjs';

export class Spectrograph {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private ground;

    constructor(scene, audioService) {
        this.scene = scene;
        this.audioService = audioService;
    }

    create() {
        // this.ground = BABYLON.Mesh.CreateGround('ground1', 1, 1, this.audioService.sample1.length - 1, this.scene, true);
        // this.ground.material = new BABYLON.StandardMaterial("gmat", this.scene);
        // this.ground.material.backFaceCulling = false;
        // this.ground.material.specularColor = new BABYLON.Color3(0, 0, 0); // black is no shine
    
        // this.ground.position.z = 64.26;
        // this.ground.scaling = new BABYLON.Vector3(1280, 1, 1280);

        this.ground = BABYLON.MeshBuilder.CreateGround('ground1',{width: 2, height: 1, subdivisionsX: 550, subdivisionsY: 200, updatable: true}, this.scene);
        this.ground.material = new BABYLON.StandardMaterial("gmat", this.scene);
        this.ground.material.backFaceCulling = false;
        this.ground.material.specularColor = new BABYLON.Color3(0, 0, 0); // black is no shine
    
        this.ground.position.z = 64.26;
        this.ground.scaling = new BABYLON.Vector3(1280, 1, 1280);


    }

    update() {
        // let h = this.audioService.sample1.length;
        // let w = this.audioService.sample1BufferHistory.length;
        // let groundVertices = this.ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        // let vertexDataIndex = 0;
        // let colorsBuffer = [];
    
        // for (let x = 0; x < w; x++) {
        //   for (let y = 0; y < h; y++) {
        //     let currentData = this.audioService.sample1BufferHistory[x];
        
        //     const barHeight = currentData[y] * .5 + 1;

        //     const r = barHeight * 3 - 1;
        //     const g = 128 * y / 576;
        //     const b = 255 - 128 * y / 350;

        //     // set color for 3D babylonjs canvas
        //     colorsBuffer.push(r / 255);
        //     colorsBuffer.push(g / 255);
        //     colorsBuffer.push(b / 255);
        //     colorsBuffer.push(1);
    
        //     // set y value of ground vertex data
        //     groundVertices[vertexDataIndex + 1] = currentData[y] / 4;
    
        //     vertexDataIndex = vertexDataIndex + 3;
        //   }
        // }
    
        // // update the 3D babylon ground plane
        // this.ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, groundVertices);
        // this.ground.setVerticesData(BABYLON.VertexBuffer.ColorKind, colorsBuffer);


        let h = 551;
        let w = 201;
        let groundVertices = this.ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        // console.log(groundVertices);
        let vertexDataIndex = 0;
        let colorsBuffer = [];
    
        for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            //   console.log(x,y);
            let currentData = this.audioService.sample1BufferHistory[x];
        
            const barHeight = currentData[y] * .5 + 1;

            const r = barHeight * 3 - 1;
            const g = 128 * y / 576;
            const b = 255 - 128 * y / 350;

            // set color for 3D babylonjs canvas
            colorsBuffer.push(r / 255);
            colorsBuffer.push(g / 255);
            colorsBuffer.push(b / 255);
            colorsBuffer.push(1);
    
            // set y value of ground vertex data
            groundVertices[vertexDataIndex + 1] = currentData[y] ;
    
            vertexDataIndex = vertexDataIndex + 3;
          }
        }
    
        // update the 3D babylon ground plane
        this.ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, groundVertices);
        this.ground.setVerticesData(BABYLON.VertexBuffer.ColorKind, colorsBuffer);
    }

    remove() {
        this.ground.dispose();
    }
}