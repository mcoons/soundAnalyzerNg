import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';

import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

import { OnDestroy } from '@angular/core';
import { OptionsService } from '../services/options/options.service';
// import { _ThinInstanceDataStorage } from 'babylonjs';

import { map } from './utilities.js';
import { ThinSprite } from 'babylonjs/Sprites/thinSprite';
import { terrainPixelShader } from 'babylonjs-materials/terrain/terrain.fragment';


export class Morph implements OnDestroy {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private engineService: EngineService;
    private colorsService: ColorsService;
    private optionsService: OptionsService;

    masterParent = new BABYLON.TransformNode('mainParent');
    nbPoints = 3;                     // the number of points between each Vector3 control points
    closed = false;                     // closes the curve when true

    radius = 175;
    radius2 = 160;
    radius3 = 145;
    radius4 = 130;
    radius5 = 115;
    radius6 = 100;

    index = 0;
    yy = 0;
    yy2 = 0;
    yy3 = 0;
    yy4 = 0;
    yy5 = 0;
    yy6 = 0;

    tmpMesh;

    // pointListArray = [];

    theta = 0;
    material;
    mat;
    mesh1;

    points = [];
    points2 = [];
    points3 = [];
    points4 = [];
    points5 = [];
    points6 = [];
    
    pointsArray = [ [],[],[],[],[],[] ];

    tubeArray = [ null, null, null, null, null, null ];

    tubeMaterialArray = [];

    ballsGroupArray = [ [],[],[],[],[],[]];

    duplicatesArray = [ [],[],[],[],[] ];

    newPathArray = [ [],[],[],[],[],[] ];

    myPathArray = [
        [
            new BABYLON.Vector3(0, 0, -15),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 15)
        ],
        [
            new BABYLON.Vector3(0, 0, -40),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 40)
        ],
        [
            new BABYLON.Vector3(0, 0, -70),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 70)
        ],
        [
            new BABYLON.Vector3(0, 0, -100),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 100)
        ],
        [
            new BABYLON.Vector3(0, 0, -130),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 130)
        ],
        [
            new BABYLON.Vector3(0, 0, -160),
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 0, 160)
        ]
    ];

    scaleFnArray = [
        (i, distance) => {
            let theta = map(i, 0, 2, 0, Math.PI);
            return 1; // + (1 -  .15 * Math.sin(theta));
        },
        (i, distance) => {
            let theta = map(i, 0, 2, 0, Math.PI);
            return 1; // + (1 -   Math.sin(theta));
        },
        (i, distance) => {
            let theta = map(i, 0, 2, 0, Math.PI);
            return 1; // + (1 -   Math.sin(theta));
        },
        (i, distance) => {
            let theta = map(i, 0, 2, 0, Math.PI);
            return 1; // + (1 -   Math.sin(theta));
        },
        (i, distance) => {
            let theta = map(i, 0, 2, 0, Math.PI);
            return 1; // + (1 - Math.sin(theta));
        },
        (i, distance) => {
            let theta = map(i, 0, 2, 0, Math.PI);
            return 1; // + (1 -   Math.sin(theta));
        }
    ];

    catmullRomArray = [ null, null, null, null, null, null ];

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.engineService = engineService;
        this.colorsService = colorsService;
        this.optionsService = optionsService;

        this.scene.registerBeforeRender(this.beforeRender);
    }

    beforeRender = () => {
        // this.SPS.setParticles();
    }

    ngOnDestroy = () => {
        this.remove();
    }

    create() {

        this.tubeMaterialArray[0] = new BABYLON.StandardMaterial('tubeMat', this.scene);
        this.tubeMaterialArray[0].maxSimultaneousLights = 8;
        this.tubeMaterialArray[0].diffuseColor = BABYLON.Color3.FromHexString('#ffffff');

        this.tubeMaterialArray[1] = new BABYLON.StandardMaterial('tube2Mat', this.scene);
        this.tubeMaterialArray[1].maxSimultaneousLights = 8;
        this.tubeMaterialArray[1].diffuseColor = BABYLON.Color3.FromHexString('#dddddd');

        this.tubeMaterialArray[2] = new BABYLON.StandardMaterial('tube3Mat', this.scene);
        this.tubeMaterialArray[2].maxSimultaneousLights = 8;
        this.tubeMaterialArray[2].diffuseColor = BABYLON.Color3.FromHexString('#bbbbbb');

        this.tubeMaterialArray[3] = new BABYLON.StandardMaterial('tube4Mat', this.scene);
        this.tubeMaterialArray[3].maxSimultaneousLights = 8;
        this.tubeMaterialArray[3].diffuseColor = BABYLON.Color3.FromHexString('#999999');

        this.tubeMaterialArray[4] = new BABYLON.StandardMaterial('tube5Mat', this.scene);
        this.tubeMaterialArray[4].maxSimultaneousLights = 8;
        this.tubeMaterialArray[4].diffuseColor = BABYLON.Color3.FromHexString('#777777');

        this.tubeMaterialArray[5] = new BABYLON.StandardMaterial('tube6Mat', this.scene);
        this.tubeMaterialArray[5].maxSimultaneousLights = 8;
        this.tubeMaterialArray[5].diffuseColor = BABYLON.Color3.FromHexString('#555555');

        this.material = new BABYLON.StandardMaterial('ballMat', this.scene);
        this.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        this.material.maxSimultaneousLights = 8;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        // this.mat.backFaceCulling = false;
        this.mat.maxSimultaneousLights = 8;

        ////////////

        for (let theta = Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2; theta += Math.PI / 32) {
            this.points.push(new BABYLON.Vector3(0, 0, 0));
            this.points2.push(new BABYLON.Vector3(0, 0, 0));
            this.points3.push(new BABYLON.Vector3(0, 0, 0));
            this.points4.push(new BABYLON.Vector3(0, 0, 0));
            this.points5.push(new BABYLON.Vector3(0, 0, 0));
            this.points6.push(new BABYLON.Vector3(0, 0, 0));
        }

        var oldpoints = [];

        let mat = new BABYLON.StandardMaterial('ballMat', this.scene);
        mat.maxSimultaneousLights = 8;
        mat.diffuseColor = BABYLON.Color3.FromHexString('#ffffff');
        mat.emissiveColor = BABYLON.Color3.FromHexString('#000000');

        for (let i = 0; i < 193; i++) {
            oldpoints.push(new BABYLON.Vector3(0, 0, 0));

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls1-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.ballsGroupArray[0].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls2-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.ballsGroupArray[1].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls2-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.duplicatesArray[0].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls3-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.ballsGroupArray[2].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls3-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.duplicatesArray[1].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls4-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.ballsGroupArray[3].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls4-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.duplicatesArray[2].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls5-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.ballsGroupArray[4].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls5-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.duplicatesArray[3].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls6-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.ballsGroupArray[5].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);

            this.tmpMesh = BABYLON.MeshBuilder.CreateSphere('balls6-' + i, { diameter: 4, segments: 16, updatable: true }, this.scene);
            this.tmpMesh.material = mat;
            this.tmpMesh.setParent(this.masterParent);
            this.duplicatesArray[4].push(this.tmpMesh);
            this.engineService.renderTargetTexture.renderList.push(this.tmpMesh);
        }

        this.tubeArray.forEach( (t, i) => {
            this.tubeArray[i] = BABYLON.MeshBuilder.ExtrudeShape('tube' + i, { shape: oldpoints, path: this.myPathArray[i], sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: 3, updatable: true }, this.scene);
            this.tubeArray[i].material = this.tubeMaterialArray[i];
            this.tubeArray[i].setParent(this.masterParent);
        })
    }

    update() {
        this.engineService.lightParent.rotation.x += .004;
        this.engineService.lightParent.rotation.y -= .006;
        this.engineService.lightParent.rotation.z += .008;

        if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].autoRotate.value) {
            // this.masterParent.rotation.x += .03;
            this.masterParent.rotation.y += .01;
            // this.masterParent.rotation.z += .01;
        }

        this.index = 0;

        // for (let theta = Math.PI + Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2 + .01; theta += Math.PI / 32) {
        for (let theta = Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2; theta += Math.PI / 32) {

            this.yy = this.audioService.sample2[this.index];
            this.yy = (this.yy / 230) * (this.yy / 230) * (this.yy / 230) * (this.yy / 230) * (this.yy / 230) * (this.yy / 230) * (this.yy / 230) * 900;
            this.points[this.index].x = (this.radius + this.yy) * Math.cos(theta);
            this.points[this.index].y = (this.radius + this.yy) * Math.sin(theta);
            this.points[this.points.length - this.index - 1].x = -((this.radius + this.yy) * Math.cos(theta));
            this.points[this.points.length - this.index - 1].y = (this.radius + this.yy) * Math.sin(theta);


            this.yy2 = this.audioService.sample2[this.index + 32];
            this.yy2 = (this.yy2 / 230) * (this.yy2 / 230) * (this.yy2 / 230) * (this.yy2 / 230) * (this.yy2 / 230) * (this.yy2 / 230) * (this.yy2 / 230) * 900;
            this.points2[this.index].x = (this.radius2 + this.yy2) * Math.cos(theta);
            this.points2[this.index].y = (this.radius2 + this.yy2) * Math.sin(theta);
            this.points2[this.points2.length - this.index - 1].x = -((this.radius2 + this.yy2) * Math.cos(theta));
            this.points2[this.points2.length - this.index - 1].y = (this.radius2 + this.yy2) * Math.sin(theta);


            this.yy3 = this.audioService.sample2[this.index + 64];
            this.yy3 = (this.yy3 / 230) * (this.yy3 / 230) * (this.yy3 / 230) * (this.yy3 / 230) * (this.yy3 / 230) * (this.yy3 / 230) * (this.yy3 / 230) * 900;
            this.points3[this.index].x = (this.radius3 + this.yy3) * Math.cos(theta);
            this.points3[this.index].y = (this.radius3 + this.yy3) * Math.sin(theta);
            this.points3[this.points3.length - this.index - 1].x = -((this.radius3 + this.yy3) * Math.cos(theta));
            this.points3[this.points3.length - this.index - 1].y = (this.radius3 + this.yy3) * Math.sin(theta);


            this.yy4 = this.audioService.sample2[this.index + 96];
            this.yy4 = (this.yy4 / 230) * (this.yy4 / 230) * (this.yy4 / 230) * (this.yy4 / 230) * (this.yy4 / 230) * (this.yy4 / 230) * (this.yy4 / 230) * 900;
            this.points4[this.index].x = (this.radius4 + this.yy4) * Math.cos(theta);
            this.points4[this.index].y = (this.radius4 + this.yy4) * Math.sin(theta);
            this.points4[this.points4.length - this.index - 1].x = -((this.radius4 + this.yy4) * Math.cos(theta));
            this.points4[this.points4.length - this.index - 1].y = (this.radius4 + this.yy4) * Math.sin(theta);


            this.yy5 = this.audioService.sample2[this.index + 128];
            this.yy5 = (this.yy5 / 230) * (this.yy5 / 230) * (this.yy5 / 230) * (this.yy5 / 230) * (this.yy5 / 230) * (this.yy5 / 230) * (this.yy5 / 230) * 900;
            this.points5[this.index].x = (this.radius5 + this.yy5) * Math.cos(theta);
            this.points5[this.index].y = (this.radius5 + this.yy5) * Math.sin(theta);
            this.points5[this.points5.length - this.index - 1].x = -((this.radius5 + this.yy5) * Math.cos(theta));
            this.points5[this.points5.length - this.index - 1].y = (this.radius5 + this.yy5) * Math.sin(theta);


            this.yy6 = this.audioService.sample2[this.index + 144];
            this.yy6 = (this.yy6 / 230) * (this.yy6 / 230) * (this.yy6 / 230) * (this.yy6 / 230) * (this.yy6 / 230) * (this.yy6 / 230) * (this.yy6 / 230) * 900;
            this.points6[this.index].x = (this.radius6 + this.yy6) * Math.cos(theta);
            this.points6[this.index].y = (this.radius6 + this.yy6) * Math.sin(theta);
            this.points6[this.points6.length - this.index - 1].x = -((this.radius6 + this.yy6) * Math.cos(theta));
            this.points6[this.points6.length - this.index - 1].y = (this.radius6 + this.yy6) * Math.sin(theta);

            this.index++;
        }


        // this.catmullRomArray.forEach( (c, i) => {
            // this.catmullRomArray[0] = BABYLON.Curve3.CreateCatmullRomSpline(this.points, this.nbPoints, this.closed);
        // });

        this.catmullRomArray[0] = BABYLON.Curve3.CreateCatmullRomSpline(this.points, this.nbPoints, this.closed);
        this.catmullRomArray[1] = BABYLON.Curve3.CreateCatmullRomSpline(this.points2, this.nbPoints, this.closed);
        this.catmullRomArray[2] = BABYLON.Curve3.CreateCatmullRomSpline(this.points3, this.nbPoints, this.closed);
        this.catmullRomArray[3] = BABYLON.Curve3.CreateCatmullRomSpline(this.points4, this.nbPoints, this.closed);
        this.catmullRomArray[4] = BABYLON.Curve3.CreateCatmullRomSpline(this.points5, this.nbPoints, this.closed);
        this.catmullRomArray[5] = BABYLON.Curve3.CreateCatmullRomSpline(this.points6, this.nbPoints, this.closed);

        this.newPathArray.forEach( (p, i) => {
            this.newPathArray[i] = this.catmullRomArray[i].getPoints();
        })

        this.tubeArray.forEach( (t, i) => {
            this.tubeArray[i] = BABYLON.MeshBuilder.ExtrudeShapeCustom('tube' + i, { shape: this.newPathArray[i], path: this.myPathArray[i], instance: this.tubeArray[i], scaleFunction: this.scaleFnArray[i] });
        })

        // show ball points
        this.newPathArray[0].forEach((p, i) => {
            this.ballsGroupArray[0][i].position = p;
            this.ballsGroupArray[0][i].position.x *= 1.01;
            this.ballsGroupArray[0][i].position.y *= 1.01;
        });

        this.newPathArray[1].forEach((p, i) => {
            this.ballsGroupArray[1][i].position = p;
            this.ballsGroupArray[1][i].position.x *= 1.01;
            this.ballsGroupArray[1][i].position.y *= 1.01;
            
            this.ballsGroupArray[1][i].position.z = 25;
            this.duplicatesArray[0][i].position.x = this.ballsGroupArray[1][i].position.x;
            this.duplicatesArray[0][i].position.y = this.ballsGroupArray[1][i].position.y;
            this.duplicatesArray[0][i].position.z = -25;
        });

        this.newPathArray[2].forEach((p, i) => {
            this.ballsGroupArray[2][i].position = p;
            this.ballsGroupArray[2][i].position.x = p.x * 1.01;
            this.ballsGroupArray[2][i].position.y = p.y * 1.01;
            this.ballsGroupArray[2][i].position.z = 55;
            this.duplicatesArray[1][i].position.x = this.ballsGroupArray[2][i].position.x;
            this.duplicatesArray[1][i].position.y = this.ballsGroupArray[2][i].position.y;
            this.duplicatesArray[1][i].position.z = -55;
        });

        this.newPathArray[3].forEach((p, i) => {
            this.ballsGroupArray[3][i].position = p;
            this.ballsGroupArray[3][i].position.x *= 1.01;
            this.ballsGroupArray[3][i].position.y *= 1.01;
            this.ballsGroupArray[3][i].position.z = 85;
            this.duplicatesArray[2][i].position.x = this.ballsGroupArray[3][i].position.x;
            this.duplicatesArray[2][i].position.y = this.ballsGroupArray[3][i].position.y;
            this.duplicatesArray[2][i].position.z = -85;
        });

        this.newPathArray[4].forEach((p, i) => {
            this.ballsGroupArray[4][i].position = p;
            this.ballsGroupArray[4][i].position.x *= 1.01;
            this.ballsGroupArray[4][i].position.y *= 1.01;
            this.ballsGroupArray[4][i].position.z = 115;
            this.duplicatesArray[3][i].position.x = this.ballsGroupArray[4][i].position.x;
            this.duplicatesArray[3][i].position.y = this.ballsGroupArray[4][i].position.y;
            this.duplicatesArray[3][i].position.z = -115;
        });

        this.newPathArray[5].forEach((p, i) => {
            this.ballsGroupArray[5][i].position = p;
            this.ballsGroupArray[5][i].position.x *= 1.01;
            this.ballsGroupArray[5][i].position.y *= 1.01;
            this.ballsGroupArray[5][i].position.z = 145;
            this.duplicatesArray[4][i].position.x = this.ballsGroupArray[5][i].position.x;
            this.duplicatesArray[4][i].position.y = this.ballsGroupArray[5][i].position.y;
            this.duplicatesArray[4][i].position.z = -145;
        });
    }

    remove() {
        this.engineService.scene.activeCamera = this.engineService.camera1;

        this.tubeArray[0].dispose();
        this.tubeArray[1].dispose();
        this.tubeArray[2].dispose();
        this.tubeArray[3].dispose();
        this.tubeArray[4].dispose();
        this.tubeArray[5].dispose();

        this.ballsGroupArray[0].forEach((b, i) => {
            this.ballsGroupArray[0][i].dispose();
            this.ballsGroupArray[1][i].dispose();
            this.ballsGroupArray[2][i].dispose();
            this.ballsGroupArray[3][i].dispose();
            this.ballsGroupArray[4][i].dispose();
            this.ballsGroupArray[5][i].dispose();

            this.duplicatesArray[0][i].dispose();
            this.duplicatesArray[1][i].dispose();
            this.duplicatesArray[2][i].dispose();
            this.duplicatesArray[3][i].dispose();
            this.duplicatesArray[4][i].dispose();
        });

        this.scene.unregisterBeforeRender(this.beforeRender);

        this.audioService = null;
        this.engineService = null;
        this.colorsService = null;
        this.optionsService = null;
        this.scene = null;
    }

}
