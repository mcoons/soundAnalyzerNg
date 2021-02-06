import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

import { OnDestroy } from '@angular/core';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';

export class DancingRainbow implements OnDestroy {

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

    points2 = [];
    tube2;
    tube2Material;

    points3 = [];
    tube3;
    tube3Material;

    points4 = [];
    tube4;
    tube4Material;

    points5 = [];
    tube5;
    tube5Material;

    points6 = [];
    tube6;
    tube6Material;

    points7 = [];
    tube7;
    tube7Material;

    // colors = ['#ff0000', '#FF7F00', '#ffff00', '#00ff00', '#0000ff', '#3A2D61', '#9B4BD9'];



    private SPS;

    constructor(scene: BABYLON.Scene, audioService: AudioService, optionsService: OptionsService, messageService: MessageService, engineService: EngineService, colorsService: ColorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;
        this.colorsService = colorsService;

        // this.material = new BABYLON.StandardMaterial('ballMat', this.scene);
        // this.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        // this.material.maxSimultaneousLights = 8;

        // for (let i = 0; i < 6; i++) {
        //     let m = new BABYLON.StandardMaterial('tubeMat' + i, this.scene);
        //     m.maxSimultaneousLights = 8;
        //     m.diffuseColor = BABYLON.Color3.FromHexString(this.colors[i]);

        //     this.pointListArray.push(
        //         {
        //             points: [],
        //             tube: null,
        //             material: m
        //         }
        //     )
        // }


        // this.tubeMaterial = new BABYLON.StandardMaterial('tubeMat', this.scene);
        // this.tubeMaterial.maxSimultaneousLights = 8;
        // this.tubeMaterial.diffuseColor = BABYLON.Color3.FromHexString('#ff0000');

        // this.tube2Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        // this.tube2Material.maxSimultaneousLights = 8;
        // this.tube2Material.diffuseColor = BABYLON.Color3.FromHexString('#FF7F00');

        // this.tube3Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        // this.tube3Material.maxSimultaneousLights = 8;
        // this.tube3Material.diffuseColor = BABYLON.Color3.FromHexString('#ffff00');

        // this.tube4Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        // this.tube4Material.maxSimultaneousLights = 8;
        // this.tube4Material.diffuseColor = BABYLON.Color3.FromHexString('#00ff00');

        // this.tube5Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        // this.tube5Material.maxSimultaneousLights = 8;
        // this.tube5Material.diffuseColor = BABYLON.Color3.FromHexString('#0000ff');

        // this.tube6Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        // this.tube6Material.maxSimultaneousLights = 8;
        // this.tube6Material.diffuseColor = BABYLON.Color3.FromHexString('#3A2D61');


        // this.tube7Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        // this.tube7Material.maxSimultaneousLights = 8;
        // this.tube7Material.diffuseColor = BABYLON.Color3.FromHexString('#9B4BD9');


        this.scene.registerBeforeRender(this.beforeRender);


    }


    beforeRender = (): void => {
        this.SPS.setParticles();
    }

    ngOnDestroy = (): void => {
        this.remove();
    }

    create(): void {

        this.tubeMaterial = new BABYLON.StandardMaterial('tubeMat', this.scene);
        this.tubeMaterial.maxSimultaneousLights = 8;
        this.tubeMaterial.diffuseColor = BABYLON.Color3.FromHexString('#ff0000');

        this.tube2Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        this.tube2Material.maxSimultaneousLights = 8;
        this.tube2Material.diffuseColor = BABYLON.Color3.FromHexString('#FF7F00');

        this.tube3Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        this.tube3Material.maxSimultaneousLights = 8;
        this.tube3Material.diffuseColor = BABYLON.Color3.FromHexString('#ffff00');

        this.tube4Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        this.tube4Material.maxSimultaneousLights = 8;
        this.tube4Material.diffuseColor = BABYLON.Color3.FromHexString('#00ff00');

        this.tube5Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        this.tube5Material.maxSimultaneousLights = 8;
        this.tube5Material.diffuseColor = BABYLON.Color3.FromHexString('#0000ff');

        this.tube6Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        this.tube6Material.maxSimultaneousLights = 8;
        this.tube6Material.diffuseColor = BABYLON.Color3.FromHexString('#3A2D61');

        this.tube7Material = new BABYLON.StandardMaterial('tubeMat', this.scene);
        this.tube7Material.maxSimultaneousLights = 8;
        this.tube7Material.diffuseColor = BABYLON.Color3.FromHexString('#9B4BD9');

        this.tubeMaterial.freeze();
        this.tube2Material.freeze();
        this.tube3Material.freeze();
        this.tube4Material.freeze();
        this.tube5Material.freeze();
        this.tube6Material.freeze();
        this.tube7Material.freeze();

        this.material = new BABYLON.StandardMaterial('ballMat', this.scene);
        this.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.material.maxSimultaneousLights = 8;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        // this.mat.backFaceCulling = false;
        this.mat.maxSimultaneousLights = 8;

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });
        const sphere = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 6, segments: 16, updatable: true }, this.scene);

        let x;
        let y;
        let z;
        let s;
        let c;

        // let counter = 0;

        const innerPositionFunction = (particle) => {
            particle.position.x = x * 35;
            particle.position.y = 0;
            particle.position.z = z * 35;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        for (z = -15; z < 15; z++) {
            for (x = -15; x < 15; x++) {
                const d = Math.sqrt((x * x) + (z * z));
                if (d <= 8.5) {
                    this.SPS.addShape(sphere, 1, { positionFunction: innerPositionFunction });
                    // counter++;
                }
            }
        }

        this.mesh1 = this.SPS.buildMesh();
        this.mesh1.material = this.mat;

        sphere.dispose();

        // console.log(counter);

        this.SPS.updateParticle = (particle) => {
            y = this.audioService.sample2[particle.idx];
            y = (y / 200 * y / 200) * 255;

            c = this.colorsService.colors(y);

            particle.color.r = c.r / 255;
            particle.color.g = c.g / 255;
            particle.color.b = c.b / 255;

            s = y / 30 + .5;

            particle.scale.x = 5;
            particle.scale.y = 5;
            particle.scale.z = 5;

            particle.position.y = s * 8;
        };





        const radius = 1000;

        for (let theta = Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2; theta += Math.PI / 32) {
            this.points.push(new BABYLON.Vector3(radius * Math.cos(theta), -120, radius * Math.sin(theta)));
            this.points2.push(new BABYLON.Vector3(radius * Math.cos(theta), -100, radius * Math.sin(theta)));
            this.points3.push(new BABYLON.Vector3(radius * Math.cos(theta), -80, radius * Math.sin(theta)));
            this.points4.push(new BABYLON.Vector3(radius * Math.cos(theta), -60, radius * Math.sin(theta)));
            this.points5.push(new BABYLON.Vector3(radius * Math.cos(theta), -40, radius * Math.sin(theta)));
            this.points6.push(new BABYLON.Vector3(radius * Math.cos(theta), -20, radius * Math.sin(theta)));
            this.points7.push(new BABYLON.Vector3(radius * Math.cos(theta), 0, radius * Math.sin(theta)));
        }

        // console.log(this.pointListArray);

        // this.points.push(this.points[0]);
        // this.points2.push(this.points2[0]);
        // this.points3.push(this.points3[0]);
        // this.points4.push(this.points4[0]);
        // this.points5.push(this.points5[0]);

        const oldpoints = [];
        const oldpoints2 = [];
        const oldpoints3 = [];
        const oldpoints4 = [];
        const oldpoints5 = [];
        const oldpoints6 = [];
        const oldpoints7 = [];

        for (let i = 0; i < 193; i++) {
            // for (let i = 0; i < 385; i++) {
            oldpoints.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints2.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints3.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints4.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints5.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints6.push(new BABYLON.Vector3(0, 0, 0));
            oldpoints7.push(new BABYLON.Vector3(0, 0, 0));
        }


        // for (let i = 0; i < 6; i++) {
        //     for (let theta = Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2; theta += Math.PI / 32) {
        //         this.pointListArray[i].points.push(new BABYLON.Vector3(radius * Math.cos(theta), -120 + 20 * i, radius * Math.sin(theta)));
        //         this.pointListArray[i].tube = BABYLON.MeshBuilder.CreateTube("tube", { path: oldpoints, radius: 10, tessellation: 32, updatable: true });
        //         this.pointListArray[i].tube.material = this.pointListArray[i].material;
        //     }
        // }


        this.tube = BABYLON.MeshBuilder.CreateTube("tube", { path: oldpoints, radius: 10, tessellation: 32, updatable: true });
        this.tube.material = this.tubeMaterial;

        this.tube2 = BABYLON.MeshBuilder.CreateTube("tube2", { path: oldpoints2, radius: 10, tessellation: 32, updatable: true });
        this.tube2.material = this.tube2Material;

        this.tube3 = BABYLON.MeshBuilder.CreateTube("tube3", { path: oldpoints3, radius: 10, tessellation: 32, updatable: true });
        this.tube3.material = this.tube3Material;

        this.tube4 = BABYLON.MeshBuilder.CreateTube("tube4", { path: oldpoints4, radius: 10, tessellation: 32, updatable: true });
        this.tube4.material = this.tube4Material;

        this.tube5 = BABYLON.MeshBuilder.CreateTube("tube5", { path: oldpoints5, radius: 10, tessellation: 32, updatable: true });
        this.tube5.material = this.tube5Material;


        this.tube6 = BABYLON.MeshBuilder.CreateTube("tube6", { path: oldpoints6, radius: 10, tessellation: 32, updatable: true });
        this.tube6.material = this.tube6Material;


        this.tube7 = BABYLON.MeshBuilder.CreateTube("tube7", { path: oldpoints7, radius: 10, tessellation: 32, updatable: true });
        this.tube7.material = this.tube7Material;


        // this.torus = BABYLON.MeshBuilder.CreateTorus("torus", {tessellation: 64, diameter: 700.5, thickness: 21.5}, this.scene);

    }

    update(): void {

        const radius = 950;
        const radius2 = 850;
        const radius3 = 750;
        const radius4 = 650;
        const radius5 = 550;
        const radius6 = 450;
        const radius7 = 350;

        // const radius = 500;
        // const radius2 = 500;
        // const radius3 = 500;
        // const radius4 = 500;
        // const radius5 = 500;
        // const radius6 = 500;
        // const radius7 = 500;

        let index = 0;
        let yy = 0;
        let yy2 = 0;
        let yy3 = 0;
        let yy4 = 0;
        let yy5 = 0;
        let yy6 = 0;
        let yy7 = 0;

        for (let theta = Math.PI + Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2 + .01; theta += Math.PI / 32) {

            yy = this.audioService.sample2[index];

            yy2 = this.audioService.sample2[index + 32];
            yy3 = this.audioService.sample2[index + 64];
            yy4 = this.audioService.sample2[index + 96];
            yy5 = this.audioService.sample2[index + 112];
            yy6 = this.audioService.sample2[index + 128];
            yy7 = this.audioService.sample2[index + 160];

            yy = (yy / 230) * (yy / 230) * (yy / 230) * (yy / 230) * (yy / 230) * (yy / 230) * (yy / 230) * 3000;
            yy2 = (yy2 / 230) * (yy2 / 230) * (yy2 / 230) * (yy2 / 230) * (yy2 / 230) * (yy2 / 230) * (yy2 / 230) * 3000;
            yy3 = (yy3 / 230) * (yy3 / 230) * (yy3 / 230) * (yy3 / 230) * (yy3 / 230) * (yy3 / 230) * (yy3 / 230) * 3000;
            yy4 = (yy4 / 230) * (yy4 / 230) * (yy4 / 230) * (yy4 / 230) * (yy4 / 230) * (yy4 / 230) * (yy4 / 230) * 2700;
            yy5 = (yy5 / 230) * (yy5 / 230) * (yy5 / 230) * (yy5 / 230) * (yy5 / 230) * (yy5 / 230) * (yy5 / 230) * 2500;
            yy6 = (yy6 / 230) * (yy6 / 230) * (yy6 / 230) * (yy6 / 230) * (yy6 / 230) * (yy6 / 230) * 2500;
            // yy7 = (yy7 / 230) * (yy7 / 230) * (yy7 / 230) * (yy7 / 230) * (yy7 / 230) * (yy7 / 230) * 2500;
            yy7 = (yy7 / 230) * 120;

            this.points[index].x = (radius + yy) * Math.cos(theta);
            this.points[index].z = (radius + yy) * Math.sin(theta);

            this.points[this.points.length - index - 1].x = -(radius + yy) * Math.cos(theta);
            this.points[this.points.length - index - 1].z = (radius + yy) * Math.sin(theta);

            this.points2[index].x = (radius2 + yy2) * Math.cos(theta);
            this.points2[index].z = (radius2 + yy2) * Math.sin(theta);

            this.points2[this.points2.length - index - 1].x = -(radius2 + yy2) * Math.cos(theta);
            this.points2[this.points2.length - index - 1].z = (radius2 + yy2) * Math.sin(theta);

            this.points3[index].x = (radius3 + yy3) * Math.cos(theta);
            this.points3[index].z = (radius3 + yy3) * Math.sin(theta);

            this.points3[this.points3.length - index - 1].x = -(radius3 + yy3) * Math.cos(theta);
            this.points3[this.points3.length - index - 1].z = (radius3 + yy3) * Math.sin(theta);

            this.points4[index].x = (radius4 + yy4) * Math.cos(theta);
            this.points4[index].z = (radius4 + yy4) * Math.sin(theta);

            this.points4[this.points4.length - index - 1].x = -(radius4 + yy4) * Math.cos(theta);
            this.points4[this.points4.length - index - 1].z = (radius4 + yy4) * Math.sin(theta);

            this.points5[index].x = (radius5 + yy5) * Math.cos(theta);
            this.points5[index].z = (radius5 + yy5) * Math.sin(theta);

            this.points5[this.points5.length - index - 1].x = -(radius5 + yy5) * Math.cos(theta);
            this.points5[this.points5.length - index - 1].z = (radius5 + yy5) * Math.sin(theta);

            this.points6[index].x = (radius6 + yy6) * Math.cos(theta);
            this.points6[index].z = (radius6 + yy6) * Math.sin(theta);

            this.points6[this.points6.length - index - 1].x = -(radius6 + yy6) * Math.cos(theta);
            this.points6[this.points6.length - index - 1].z = (radius6 + yy6) * Math.sin(theta);

            this.points7[index].x = (radius7 + yy7) * Math.cos(theta);
            this.points7[index].z = (radius7 + yy7) * Math.sin(theta);

            this.points7[this.points7.length - index - 1].x = -(radius7 + yy7) * Math.cos(theta);
            this.points7[this.points7.length - index - 1].z = (radius7 + yy7) * Math.sin(theta);

            index++;
        }

        const nbPoints = 3;                     // the number of points between each Vector3 control points
        const closed = false;                     // closes the curve when true

        const catmullRom = BABYLON.Curve3.CreateCatmullRomSpline(this.points, nbPoints, closed);
        const catmullRom2 = BABYLON.Curve3.CreateCatmullRomSpline(this.points2, nbPoints, closed);
        const catmullRom3 = BABYLON.Curve3.CreateCatmullRomSpline(this.points3, nbPoints, closed);
        const catmullRom4 = BABYLON.Curve3.CreateCatmullRomSpline(this.points4, nbPoints, closed);
        const catmullRom5 = BABYLON.Curve3.CreateCatmullRomSpline(this.points5, nbPoints, closed);
        const catmullRom6 = BABYLON.Curve3.CreateCatmullRomSpline(this.points6, nbPoints, closed);
        const catmullRom7 = BABYLON.Curve3.CreateCatmullRomSpline(this.points7, nbPoints, closed);

        // var test = BABYLON.Curve3.CreateCatmullRomSpline(this.points7, 6, true);

        const newpath = catmullRom.getPoints();
        const newpath2 = catmullRom2.getPoints();
        const newpath3 = catmullRom3.getPoints();
        const newpath4 = catmullRom4.getPoints();
        const newpath5 = catmullRom5.getPoints();
        const newpath6 = catmullRom6.getPoints();
        const newpath7 = catmullRom7.getPoints();

        // var tp = test.getPoints();

        // var l = catmullRom.length();
        // var l = catmullRom.length();

        // console.log("tp.length");
        // console.log(tp.length);

        this.tube = BABYLON.MeshBuilder.CreateTube("tube", { path: newpath, instance: this.tube });
        this.tube2 = BABYLON.MeshBuilder.CreateTube("tube2", { path: newpath2, instance: this.tube2 });
        this.tube3 = BABYLON.MeshBuilder.CreateTube("tube3", { path: newpath3, instance: this.tube3 });
        this.tube4 = BABYLON.MeshBuilder.CreateTube("tube4", { path: newpath4, instance: this.tube4 });
        this.tube5 = BABYLON.MeshBuilder.CreateTube("tube5", { path: newpath5, instance: this.tube5 });
        this.tube6 = BABYLON.MeshBuilder.CreateTube("tube6", { path: newpath6, instance: this.tube6 });
        this.tube7 = BABYLON.MeshBuilder.CreateTube("tube7", { path: newpath7, instance: this.tube7 });

    }



    remove(): void {
        this.engineService.scene.activeCamera = this.engineService.camera1;

        this.tube.dispose();
        this.tube2.dispose();
        this.tube3.dispose();
        this.tube4.dispose();
        this.tube5.dispose();
        this.tube6.dispose();
        this.tube7.dispose();

        this.SPS.mesh.dispose();
        this.mesh1.dispose();
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
