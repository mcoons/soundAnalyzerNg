import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

import { OnDestroy } from '@angular/core';

export class Morph implements OnDestroy {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private colorsService: ColorsService;

    // pointListArray = [];

    theta = 0;
    material;
    mat;
    mesh1;

    points = [];
    tube;
    tubeMaterial;
    ballMaterial;
    
    points2 = [];
    tube2;
    tube2Material;    
    ball2Material;    

    points3 = [];
    tube3;
    tube3Material;
    ball3Material;    

    points4 = [];
    tube4;
    tube4Material;
    ball4Material;    

    points5 = [];
    tube5;
    tube5Material;
    ball5Material;    

    points6 = [];
    tube6;
    tube6Material;
    ball6Material;    

    balls = [];
    balls2 = [];
    balls3 = [];
    balls4 = [];
    balls5 = [];
    balls6 = [];

    // private SPS;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;
        this.colorsService = colorsService;

        this.scene.registerBeforeRender(this.beforeRender);
    }


    beforeRender = () => {
        // this.SPS.setParticles();
    }

    ngOnDestroy = () => {
        this.remove();
    }

    create() {

        this.tubeMaterial = new BABYLON.StandardMaterial('tubeMat', this.scene);
        this.tubeMaterial.maxSimultaneousLights = 8;
        this.tubeMaterial.diffuseColor = BABYLON.Color3.FromHexString('#ffffff');

        this.tube2Material = new BABYLON.StandardMaterial('tube2Mat', this.scene);
        this.tube2Material.maxSimultaneousLights = 8;
        this.tube2Material.diffuseColor = BABYLON.Color3.FromHexString('#dddddd');

        this.tube3Material = new BABYLON.StandardMaterial('tube3Mat', this.scene);
        this.tube3Material.maxSimultaneousLights = 8;
        this.tube3Material.diffuseColor = BABYLON.Color3.FromHexString('#bbbbbb');

        this.tube4Material = new BABYLON.StandardMaterial('tube4Mat', this.scene);
        this.tube4Material.maxSimultaneousLights = 8;
        this.tube4Material.diffuseColor = BABYLON.Color3.FromHexString('#999999');
 
        this.tube5Material = new BABYLON.StandardMaterial('tube5Mat', this.scene);
        this.tube5Material.maxSimultaneousLights = 8;
        this.tube5Material.diffuseColor = BABYLON.Color3.FromHexString('#777777');
 
        this.tube6Material = new BABYLON.StandardMaterial('tube6Mat', this.scene);
        this.tube6Material.maxSimultaneousLights = 8;
        this.tube6Material.diffuseColor = BABYLON.Color3.FromHexString('#555555');





        this.ballMaterial = new BABYLON.StandardMaterial('ballMat', this.scene);
        this.ballMaterial.maxSimultaneousLights = 8;
        this.ballMaterial.diffuseColor = BABYLON.Color3.FromHexString('#000000');
        this.ballMaterial.emissiveColor = BABYLON.Color3.FromHexString('#ee0000');

        this.ball2Material = new BABYLON.StandardMaterial('ball2Mat', this.scene);
        this.ball2Material.maxSimultaneousLights = 8;
        this.ball2Material.diffuseColor = BABYLON.Color3.FromHexString('#dddddd');
        this.ball2Material.emissiveColor = BABYLON.Color3.FromHexString('#ee0000');

        this.ball3Material = new BABYLON.StandardMaterial('ball3Mat', this.scene);
        this.ball3Material.maxSimultaneousLights = 8;
        this.ball3Material.diffuseColor = BABYLON.Color3.FromHexString('#bbbbbb');
        this.ball3Material.emissiveColor = BABYLON.Color3.FromHexString('#ee0000');

        this.ball4Material = new BABYLON.StandardMaterial('ball4Mat', this.scene);
        this.ball4Material.maxSimultaneousLights = 8;
        this.ball4Material.diffuseColor = BABYLON.Color3.FromHexString('#999999');
        this.ball4Material.emissiveColor = BABYLON.Color3.FromHexString('#ee0000');
 
        this.ball5Material = new BABYLON.StandardMaterial('ball5Mat', this.scene);
        this.ball5Material.maxSimultaneousLights = 8;
        this.ball5Material.diffuseColor = BABYLON.Color3.FromHexString('#777777');
        this.ball5Material.emissiveColor = BABYLON.Color3.FromHexString('#ee0000');
 
        this.ball6Material = new BABYLON.StandardMaterial('ball6Mat', this.scene);
        this.ball6Material.maxSimultaneousLights = 8;
        this.ball6Material.diffuseColor = BABYLON.Color3.FromHexString('#555555');
        this.ball6Material.emissiveColor = BABYLON.Color3.FromHexString('#ee0000');




        this.material = new BABYLON.StandardMaterial('ballMat', this.scene);
        this.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.material.maxSimultaneousLights = 8;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        // this.mat.backFaceCulling = false;
        this.mat.maxSimultaneousLights = 8;

        ////////////

        let radius = 1000;

        for (let theta = Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2; theta += Math.PI / 32) {
            this.points.push(new BABYLON.Vector3(radius * Math.cos(theta),radius * Math.sin(theta), 0));
            this.points2.push(new BABYLON.Vector3(radius * Math.cos(theta),radius * Math.sin(theta), 0));
            this.points3.push(new BABYLON.Vector3(radius * Math.cos(theta),radius * Math.sin(theta), 0));
            this.points4.push(new BABYLON.Vector3(radius * Math.cos(theta),radius * Math.sin(theta), 0));
            this.points5.push(new BABYLON.Vector3(radius * Math.cos(theta),radius * Math.sin(theta), 0));
            this.points6.push(new BABYLON.Vector3(radius * Math.cos(theta),radius * Math.sin(theta), 0));
        }

        var oldpoints = [];
        var oldpoints2 = [];
        var oldpoints3 = [];
        var oldpoints4 = [];
        var oldpoints5 = [];
        var oldpoints6 = [];

        for (let i = 0; i < 196; i++) {
            oldpoints.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints2.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints3.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints4.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints5.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints6.push(new BABYLON.Vector3(0, 0, 0));
            
            const sphere = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 8, segments: 16, updatable: true }, this.scene);
            sphere.material = this.ballMaterial;
            this.balls.push(sphere);

            const sphere2 = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 8, segments: 16, updatable: true }, this.scene);
            sphere2.material = this.ball2Material;
            this.balls2.push(sphere2);

            const sphere3 = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 8, segments: 16, updatable: true }, this.scene);
            sphere3.material = this.ball3Material;
            this.balls3.push(sphere3);
 
            const sphere4 = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 8, segments: 16, updatable: true }, this.scene);
            sphere4.material = this.ball4Material;
            this.balls4.push(sphere4);
 
            const sphere5 = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 8, segments: 16, updatable: true }, this.scene);
            sphere5.material = this.ball5Material;
            this.balls5.push(sphere5);
 
            const sphere6 = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 8, segments: 16, updatable: true }, this.scene);
            sphere6.material = this.ball6Material;
            this.balls6.push(sphere6);
        }

        const myPath = [
            new BABYLON.Vector3(0, 0, -50),
            new BABYLON.Vector3(0, 0, 50)
        ];

        const myPath2 = [
            new BABYLON.Vector3(0, 0, -100),
            new BABYLON.Vector3(0, 0, 100)
        ];


        const myPath3 = [
            new BABYLON.Vector3(0, 0, -150),
            new BABYLON.Vector3(0, 0, 150)
        ];

        const myPath4 = [
            new BABYLON.Vector3(0, 0, -200),
            new BABYLON.Vector3(0, 0, 200)
        ];

        const myPath5 = [
            new BABYLON.Vector3(0, 0, -250),
            new BABYLON.Vector3(0, 0, 250)
        ];

        const myPath6 = [
            new BABYLON.Vector3(0, 0, -300),
            new BABYLON.Vector3(0, 0, 300)
        ];

        this.tube = BABYLON.MeshBuilder.ExtrudeShape('tube', { shape: oldpoints, path: myPath, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3, updatable: true }, this.scene);
        this.tube2 = BABYLON.MeshBuilder.ExtrudeShape('tube2', { shape: oldpoints2, path: myPath2, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3, updatable: true }, this.scene);
        this.tube3 = BABYLON.MeshBuilder.ExtrudeShape('tube3', { shape: oldpoints3, path: myPath3, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3, updatable: true }, this.scene);
        this.tube4 = BABYLON.MeshBuilder.ExtrudeShape('tube4', { shape: oldpoints4, path: myPath4, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3, updatable: true }, this.scene);
        this.tube5 = BABYLON.MeshBuilder.ExtrudeShape('tube5', { shape: oldpoints5, path: myPath5, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3, updatable: true }, this.scene);
        this.tube6 = BABYLON.MeshBuilder.ExtrudeShape('tube6', { shape: oldpoints6, path: myPath6, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3, updatable: true }, this.scene);
        // this.tube = BABYLON.MeshBuilder.ExtrudeShape('tube', { shape: oldpoints, path: myPath, updatable: true }, this.scene);

        // this.tube.setPivotMatrix(BABYLON.Matrix.Identity());
        // this.tube.convertToFlatShadedMesh();

        this.tube.material = this.tubeMaterial;
        this.tube2.material = this.tube2Material;
        this.tube3.material = this.tube3Material;
        this.tube4.material = this.tube4Material;
        this.tube5.material = this.tube5Material;
        this.tube6.material = this.tube6Material;
    }

    update() {

        // const radius = 250;
        // const radius2 = 249;
        // const radius3 = 248;
        // const radius4 = 247;
        // const radius5 = 246;
        // const radius6 = 245;

        const radius = 250;
        const radius2 = 240;
        const radius3 = 230;
        const radius4 = 220;
        const radius5 = 210;
        const radius6 = 200;

        let index = 0;
        let yy = 0;
        let yy2 = 0;
        let yy3 = 0;
        let yy4 = 0;
        let yy5 = 0;
        let yy6 = 0;

        // for (let theta = Math.PI + Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2 + .01; theta += Math.PI / 32) {
        for (let theta = Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2; theta += Math.PI / 32) {

            yy = this.audioService.sample2[index];
            yy = (yy / 230) * (yy / 230) * (yy / 230) * (yy / 230) * (yy / 230) * (yy / 230) * (yy / 230) * 3000;

            this.points[index].x = (radius + yy) * Math.cos(theta);
            this.points[index].y = (radius + yy) * Math.sin(theta);

            this.points[this.points.length - index - 1].x = -((radius + yy) * Math.cos(theta));
            this.points[this.points.length - index - 1].y =  (radius + yy) * Math.sin(theta);


            yy2 = this.audioService.sample2[index+32];
            yy2 = (yy2 / 230) * (yy2 / 230) * (yy2 / 230) * (yy2 / 230) * (yy2 / 230) * (yy2 / 230) * (yy2 / 230) * 3000;

            this.points2[index].x = (radius2 + yy2) * Math.cos(theta);
            this.points2[index].y = (radius2 + yy2) * Math.sin(theta);

            this.points2[this.points2.length - index - 1].x = -((radius2 + yy2) * Math.cos(theta));
            this.points2[this.points2.length - index - 1].y =  (radius2 + yy2) * Math.sin(theta);



            yy3 = this.audioService.sample2[index+64];
            yy3 = (yy3 / 230) * (yy3 / 230) * (yy3 / 230) * (yy3 / 230) * (yy3 / 230) * (yy3 / 230) * (yy3 / 230) * 3000;

            this.points3[index].x = (radius3 + yy3) * Math.cos(theta);
            this.points3[index].y = (radius3 + yy3) * Math.sin(theta);

            this.points3[this.points3.length - index - 1].x = -((radius3 + yy3) * Math.cos(theta));
            this.points3[this.points3.length - index - 1].y =  (radius3 + yy3) * Math.sin(theta);




            yy4 = this.audioService.sample2[index+96];
            yy4 = (yy4 / 230) * (yy4 / 230) * (yy4 / 230) * (yy4 / 230) * (yy4 / 230) * (yy4 / 230) * (yy4 / 230) * 3000;

            this.points4[index].x = (radius4 + yy4) * Math.cos(theta);
            this.points4[index].y = (radius4 + yy4) * Math.sin(theta);

            this.points4[this.points4.length - index - 1].x = -((radius4 + yy4) * Math.cos(theta));
            this.points4[this.points4.length - index - 1].y =  (radius4 + yy4) * Math.sin(theta);




            yy5 = this.audioService.sample2[index+128];
            yy5 = (yy5 / 230) * (yy5 / 230) * (yy5 / 230) * (yy5 / 230) * (yy5 / 230) * (yy5 / 230) * (yy5 / 230) * 2800;

            this.points5[index].x = (radius5 + yy5) * Math.cos(theta);
            this.points5[index].y = (radius5 + yy5) * Math.sin(theta);

            this.points5[this.points5.length - index - 1].x = -((radius5 + yy5) * Math.cos(theta));
            this.points5[this.points5.length - index - 1].y =  (radius5 + yy5) * Math.sin(theta);




            yy6 = this.audioService.sample2[index+144];
            yy6 = (yy6 / 220) * (yy6 / 220) * (yy6 / 220) * (yy6 / 220) * (yy6 / 220) * (yy6 / 220) * (yy6 / 220) * 2600;

            this.points6[index].x = (radius6 + yy6) * Math.cos(theta);
            this.points6[index].y = (radius6 + yy6) * Math.sin(theta);

            this.points6[this.points6.length - index - 1].x = -((radius6 + yy6) * Math.cos(theta));
            this.points6[this.points6.length - index - 1].y =  (radius6 + yy6) * Math.sin(theta);






            index++;
        }

        var nbPoints = 3;                     // the number of points between each Vector3 control points
        var closed = true;                     // closes the curve when true

        var catmullRom = BABYLON.Curve3.CreateCatmullRomSpline(this.points, nbPoints, closed);
        var catmullRom2 = BABYLON.Curve3.CreateCatmullRomSpline(this.points2, nbPoints, closed);
        var catmullRom3 = BABYLON.Curve3.CreateCatmullRomSpline(this.points3, nbPoints, closed);
        var catmullRom4 = BABYLON.Curve3.CreateCatmullRomSpline(this.points4, nbPoints, closed);
        var catmullRom5 = BABYLON.Curve3.CreateCatmullRomSpline(this.points5, nbPoints, closed);
        var catmullRom6 = BABYLON.Curve3.CreateCatmullRomSpline(this.points6, nbPoints, closed);

        var newpath = catmullRom.getPoints();
        var newpath2 = catmullRom2.getPoints();
        var newpath3 = catmullRom3.getPoints();
        var newpath4 = catmullRom4.getPoints();
        var newpath5 = catmullRom5.getPoints();
        var newpath6 = catmullRom6.getPoints();

        const myPath = [
            new BABYLON.Vector3(0, 0, -10),
            new BABYLON.Vector3(0, 0, 10)
        ];


        const myPath2 = [
            new BABYLON.Vector3(0, 0, -25),
            new BABYLON.Vector3(0, 0, 25)
        ];


        const myPath3 = [
            new BABYLON.Vector3(0, 0, -35),
            new BABYLON.Vector3(0, 0, 35)
        ];


        const myPath4 = [
            new BABYLON.Vector3(0, 0, -45),
            new BABYLON.Vector3(0, 0, 45)
        ];


        const myPath5 = [
            new BABYLON.Vector3(0, 0, -55),
            new BABYLON.Vector3(0, 0, 55)
        ];


        const myPath6 = [
            new BABYLON.Vector3(0, 0, -65),
            new BABYLON.Vector3(0, 0, 65)
        ];


        // newpath.pop(); // last
        // newpath.shift(); // first

        // newpath.push(newpath[0]);

        // console.log(myPath);
        // console.log(newpath);


        this.tube = BABYLON.MeshBuilder.ExtrudeShape('tube', { shape: newpath, path: myPath, instance: this.tube });
        this.tube2 = BABYLON.MeshBuilder.ExtrudeShape('tube2', { shape: newpath2, path: myPath2, instance: this.tube2 });
        this.tube3 = BABYLON.MeshBuilder.ExtrudeShape('tube3', { shape: newpath3, path: myPath3, instance: this.tube3});
        this.tube4 = BABYLON.MeshBuilder.ExtrudeShape('tube4', { shape: newpath4, path: myPath4, instance: this.tube4});
        this.tube5 = BABYLON.MeshBuilder.ExtrudeShape('tube5', { shape: newpath5, path: myPath5, instance: this.tube5});
        this.tube6 = BABYLON.MeshBuilder.ExtrudeShape('tube6', { shape: newpath6, path: myPath6, instance: this.tube6});

        // show ball points
        newpath.forEach( (p, i) => {
            this.balls[i].position = p;
         });
 
         newpath2.forEach( (p, i) => {
            this.balls2[i].position = p;
            this.balls2[i].position.z = 17;
         }); 
          
         newpath3.forEach( (p, i) => {
            this.balls3[i].position = p;
            this.balls3[i].position.z = 30;
         }); 
         
         newpath4.forEach( (p, i) => {
            this.balls4[i].position = p;
            this.balls4[i].position .z = 40;
         }); 
         
         newpath5.forEach( (p, i) => {
            this.balls5[i].position = p;
            this.balls5[i].position.z = 50;
         }); 
         
         newpath6.forEach( (p, i) => {
            this.balls6[i].position = p;
            this.balls6[i].position.z = 60;
         }); 
    }

    remove() {
        this.engineService.scene.activeCamera = this.engineService.camera1;

        this.tube.dispose();
        this.tube2.dispose();
        this.tube3.dispose();
        this.tube4.dispose();
        this.tube5.dispose();
        this.tube6.dispose();

        this.scene.unregisterBeforeRender(this.beforeRender);

        this.audioService = null;
        this.engineService = null;
        this.colorsService = null;
        this.scene = null;
    }

}
