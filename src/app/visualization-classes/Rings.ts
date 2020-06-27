
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';

import { map } from './utilities.js';

export class Rings {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;
    private colorsService: ColorsService;

    private ring1SPS;
    private ring3SPS;
    private ring5SPS;

    private mat;
    // private mat5;

    private mesh1;
    private mesh3;
    private mesh5;

    glass;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.colorsService = colorsService;

        // (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.4;
        // (this.scene.lights[1] as BABYLON.PointLight).intensity = 0.4;
        // (this.scene.lights[2] as BABYLON.PointLight).intensity = 0.4;

        this.scene.registerBeforeRender(this.beforeRender);

        this.setDefaults();
    }

    setDefaults() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72; // 4.72
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .81; // 1
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1900;
    }

    beforeRender = () => {
        this.ring1SPS.setParticles();
        this.ring3SPS.setParticles();
        this.ring5SPS.setParticles();
    }

    create() {

        const radius1 = 100;
        const radius3 = 500;
        const radius5 = 300;
        const width1 = 150;
        const depth1 = 4;
        const height1 = 10;

        let gtheta;
        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.diffuseTexture = new BABYLON.Texture('../../assets/mats/glow2.png', this.scene);
        this.mat.backFaceCulling = false;
        this.mat.opacityTexture = new BABYLON.Texture('../../assets/mats/glow2.png', this.scene);
        this.mat.specularColor = new BABYLON.Color3(0, 0, 0);

        this.mat.diffuseTexture.hasAlpha = true;
        (this.mat.diffuseTexture as BABYLON.Texture).vScale = 1 / 5;
        (this.mat.opacityTexture as BABYLON.Texture).vScale = 1 / 5;


        // BUILD RING1 SPS ////////////////////////////////

        const ring1PositionFunction = (particle, i, s) => {

            particle.position.x = radius1 * Math.cos(gtheta);
            particle.position.z = radius1 * Math.sin(gtheta);
            particle.position.y = 100;
            particle.rotation.y = Math.PI / 2 - gtheta;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.ring1SPS = new BABYLON.SolidParticleSystem('ring1SPS', this.scene, { updatable: true, enableMultiMaterial: true });

        const box1 = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: 10, height: 1 }, this.scene);

        for (let theta = Math.PI / 2; theta < 2 * Math.PI + Math.PI / 2 - Math.PI / 50; theta += Math.PI / 50) {
            gtheta = theta;
            this.ring1SPS.addShape(box1, 1, { positionFunction: ring1PositionFunction });
        }

        this.mesh1 = this.ring1SPS.buildMesh();
        this.mesh1.material = this.mat;

        // dispose the model
        box1.dispose();

        this.ring1SPS.updateParticle = (particle) => {
            const myTheta = particle.idx * Math.PI / 50 + Math.PI / 2;
            const yy = this.audioService.fr64DataArray[particle.idx < 50 ? particle.idx : 50 - (particle.idx - 50)];

            particle.color.r = this.colorsService.colors(yy).r / 255;
            particle.color.g = this.colorsService.colors(yy).g / 255;
            particle.color.b = this.colorsService.colors(yy).b / 255;

            particle.scale.y = yy / 3;
            particle.position.y = (particle.scale.y) / 2;

        };

        // BUILD RING3 SPS ////////////////////////////////

        const ring3PositionFunction = (particle, i, s) => {

            particle.position.x = radius3 * Math.cos(gtheta);
            particle.position.z = radius3 * Math.sin(gtheta);
            particle.position.y = 100;
            particle.rotation.y = Math.PI / 2 - gtheta;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.ring3SPS = new BABYLON.SolidParticleSystem('ring3SPS', this.scene, { updatable: true, enableMultiMaterial: true });

        const box3 = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: 7, height: 1 }, this.scene);

        for (let theta = Math.PI / 2; theta < 2 * Math.PI + Math.PI / 2 - Math.PI / 550; theta += Math.PI / 550) {
            gtheta = theta;
            this.ring3SPS.addShape(box3, 1, { positionFunction: ring3PositionFunction });
        }

        this.mesh3 = this.ring3SPS.buildMesh();
        this.mesh3.material = this.mat;

        // dispose the model
        box3.dispose();

        this.ring3SPS.updateParticle = (particle) => {
            const myTheta = particle.idx * Math.PI / 550 + Math.PI / 2;
            const yy = this.audioService.sample1[particle.idx + 20 < 570 ? particle.idx + 20 : 570 - (particle.idx + 20 - 570)];

            particle.color.r = this.colorsService.colors(yy).r / 255;
            particle.color.g = this.colorsService.colors(yy).g / 255;
            particle.color.b = this.colorsService.colors(yy).b / 255;

            particle.scale.y = yy / 2;
            particle.position.y = (particle.scale.y) / 2;

        };



        // // BUILD RING5 SPS ////////////////////////////////

        const ring5PositionFunction = (particle, i, s) => {

            particle.position.x = radius5 * Math.cos(gtheta);
            particle.position.z = radius5 * Math.sin(gtheta);
            particle.position.y = 100;
            particle.rotation.y = Math.PI / 2 - gtheta;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.ring5SPS = new BABYLON.SolidParticleSystem('ring5SPS', this.scene, { updatable: true, enableMultiMaterial: true });

        const box5 = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: 10, height: 1 }, this.scene);

        for (let theta = Math.PI / 2; theta <= 2 * Math.PI + Math.PI / 2; theta += Math.PI / 100) {
            gtheta = theta;
            this.ring5SPS.addShape(box5, 1, { positionFunction: ring5PositionFunction });
        }

        this.mesh5 = this.ring5SPS.buildMesh();
        this.mesh5.material = this.mat;

        // dispose the model
        box5.dispose();

        this.ring5SPS.updateParticle = (particle) => {
            const myTheta = particle.idx * Math.PI / 100 + Math.PI / 2;
            const yy = this.audioService.fr128DataArray[particle.idx <= 100 ? particle.idx : 100 - (particle.idx - 100)];

            particle.color.r = this.colorsService.colors(yy).r / 255;
            particle.color.g = this.colorsService.colors(yy).g / 255;
            particle.color.b = this.colorsService.colors(yy).b / 255;

            particle.scale.y = yy / 2;
            particle.position.y = (particle.scale.y) / 2;

        };

        this.ring5SPS.mesh.rotation.y = Math.PI;

        // CREATE A MIRROR

        this.glass = BABYLON.MeshBuilder.CreatePlane('plane', { size: 1000000 }, this.scene);
        this.glass.rotation.x = Math.PI / 2;
        this.glass.position.y = -5;

        // Ensure working with new values for flat surface by computing and obtaining its worldMatrix
        this.glass.computeWorldMatrix(true);
        const glassWorldMatrix = this.glass.getWorldMatrix();

        // Obtain normals for plane and assign one of them as the normal
        const glassVertexData = this.glass.getVerticesData('normal');
        let glassNormal = new BABYLON.Vector3(glassVertexData[0], glassVertexData[1], glassVertexData[2]);
        // Use worldMatrix to transform normal into its current world value
        glassNormal = BABYLON.Vector3.TransformNormal(glassNormal, glassWorldMatrix);

        // Create reflector using the position and reflected normal of the flat surface
        const reflector = BABYLON.Plane.FromPositionAndNormal(this.glass.position, glassNormal.scale(-1));

        const mirrorMaterial = new BABYLON.StandardMaterial('MirrorMat', this.scene);
        mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture('mirror', 512, this.scene, true);
        (mirrorMaterial.reflectionTexture as BABYLON.MirrorTexture).mirrorPlane = reflector;
        // tslint:disable-next-line: max-line-length
        (mirrorMaterial.reflectionTexture as BABYLON.MirrorTexture).renderList = [this.ring1SPS.mesh, this.ring3SPS.mesh, this.ring5SPS.mesh];
        mirrorMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        mirrorMaterial.backFaceCulling = true; // not working??
        mirrorMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        this.glass.material = mirrorMaterial;

    }

    update() { }

    remove() {
        this.ring1SPS.mesh.dispose();
        this.ring3SPS.mesh.dispose();
        this.ring5SPS.mesh.dispose();

        this.mesh1.dispose();
        this.mesh3.dispose();
        this.mesh5.dispose();

        this.glass.dispose();

        this.scene.unregisterBeforeRender(this.beforeRender);

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.8;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 1.0;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 1.0;
    }

}
