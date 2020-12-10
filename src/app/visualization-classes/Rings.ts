
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
    private engineService: EngineService;

    private ring1SPS;
    private ring3SPS;
    private ring5SPS;

    private mat;

    private mesh1;
    private mesh3;
    private mesh5;

    private PI;
    private TwoPI;
    private PId2;
    private PId32;
    private PId50;
    private PId550;
    private PId100;

    private c1;
    private y1;
    private myTheta1;

    private c3;
    private y3;
    private myTheta3;

    private c5;
    private y5;
    private myTheta5;

    glass;
    Writer;
    text1;
    lineMat;
    textSPS;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.colorsService = colorsService;
        this.engineService = engineService;

        this.PI = Math.PI;
        this.TwoPI = this.PI * 2;
        this.PId2 = this.PI / 2;
        this.PId32 = this.PI / 32;
        this.PId50 = this.PI / 50;
        this.PId550 = this.PI / 550;
        this.PId100 = this.PI / 100;

        this.scene.registerBeforeRender(this.beforeRender);

        // this.setDefaults();
    }

    setDefaults() {
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72; // 4.72
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .81; // 1
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1900;
    }

    beforeRender = () => {
        this.ring1SPS.setParticles();
        this.ring3SPS.setParticles();
        this.ring5SPS.setParticles();
        // this.textSPS.setParticles();
    }

    create() {

        const radius1 = 100;
        const radius3 = 500;
        const radius5 = 300;

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
            particle.rotation.y = this.PId2 - gtheta;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.ring1SPS = new BABYLON.SolidParticleSystem('ring1SPS', this.scene, { updatable: true, enableMultiMaterial: true });

        const box1 = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: 10, height: 1 }, this.scene);

        for (let theta = this.PId2; theta < this.TwoPI + this.PId2 - this.PId50; theta += this.PId50) {
            gtheta = theta;
            this.ring1SPS.addShape(box1, 1, { positionFunction: ring1PositionFunction });
        }

        this.mesh1 = this.ring1SPS.buildMesh();
        this.mesh1.material = this.mat;

        // dispose the model
        box1.dispose();

        this.ring1SPS.updateParticle = (particle) => {
            this.myTheta1 = particle.idx * this.PId50 + this.PId2;
            this.y1 = this.audioService.fr64DataArray[particle.idx < 50 ? particle.idx : 50 - (particle.idx - 50)];

            this.c1 = this.colorsService.colors(this.y1);
            particle.color.r = this.c1.r / 255;
            particle.color.g = this.c1.g / 255;
            particle.color.b = this.c1.b / 255;

            particle.scale.y = this.y1 / 3;
            particle.position.y = (particle.scale.y) / 2;
        };

        // BUILD RING3 SPS ////////////////////////////////

        const ring3PositionFunction = (particle, i, s) => {
            particle.position.x = radius3 * Math.cos(gtheta);
            particle.position.z = radius3 * Math.sin(gtheta);
            particle.position.y = 100;
            particle.rotation.y = this.PId2 - gtheta;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.ring3SPS = new BABYLON.SolidParticleSystem('ring3SPS', this.scene, { updatable: true, enableMultiMaterial: true });

        const box3 = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: 7, height: 1 }, this.scene);

        for (let theta = this.PId2; theta < this.TwoPI + this.PId2 - this.PId550; theta += this.PId550) {
            gtheta = theta;
            this.ring3SPS.addShape(box3, 1, { positionFunction: ring3PositionFunction });
        }

        this.mesh3 = this.ring3SPS.buildMesh();
        this.mesh3.material = this.mat;

        // dispose the model
        box3.dispose();

        this.ring3SPS.updateParticle = (particle) => {
            this.myTheta3 = particle.idx * this.PId550 + this.PId2;
            this.y3 = this.audioService.sample1[particle.idx + 20 < 570 ? particle.idx + 20 : 570 - (particle.idx + 20 - 570)];

            this.c3 = this.colorsService.colors(this.y3);
            particle.color.r = this.c3.r / 255;
            particle.color.g = this.c3.g / 255;
            particle.color.b = this.c3.b / 255;

            particle.scale.y = this.y3 / 2;
            particle.position.y = (particle.scale.y) / 2;
        };

        // // BUILD RING5 SPS ////////////////////////////////

        const ring5PositionFunction = (particle, i, s) => {
            particle.position.x = radius5 * Math.cos(gtheta);
            particle.position.z = radius5 * Math.sin(gtheta);
            particle.position.y = 100;
            particle.rotation.y = this.PId2 - gtheta;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.ring5SPS = new BABYLON.SolidParticleSystem('ring5SPS', this.scene, { updatable: true, enableMultiMaterial: true });

        const box5 = BABYLON.MeshBuilder.CreatePlane('myPlane', { width: 10, height: 1 }, this.scene);

        for (let theta = this.PId2; theta <= this.TwoPI + this.PId2; theta += this.PId100) {
            gtheta = theta;
            this.ring5SPS.addShape(box5, 1, { positionFunction: ring5PositionFunction });
        }

        this.mesh5 = this.ring5SPS.buildMesh();
        this.mesh5.material = this.mat;

        // dispose the model
        box5.dispose();

        this.ring5SPS.updateParticle = (particle) => {
            this.myTheta5 = particle.idx * this.PId100 + this.PId2;
            this.y5 = this.audioService.fr128DataArray[particle.idx <= 100 ? particle.idx : 100 - (particle.idx - 100)];

            this.c5 = this.colorsService.colors(this.y5);
            particle.color.r = this.c5.r / 255;
            particle.color.g = this.c5.g / 255;
            particle.color.b = this.c5.b / 255;

            particle.scale.y = this.y5 / 2;
            particle.position.y = (particle.scale.y) / 2;
        };

        this.ring5SPS.mesh.rotation.y = this.PI;

        // CREATE A MIRROR

        this.glass = BABYLON.MeshBuilder.CreatePlane('plane', { size: 1000000 }, this.scene);
        this.glass.rotation.x = this.PId2;
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
        mirrorMaterial.reflectionTexture = new BABYLON.MirrorTexture('mirror', 1024, this.scene, true);
        (mirrorMaterial.reflectionTexture as BABYLON.MirrorTexture).mirrorPlane = reflector;
        // tslint:disable-next-line: max-line-length
        (mirrorMaterial.reflectionTexture as BABYLON.MirrorTexture).renderList = [this.ring1SPS.mesh, this.ring3SPS.mesh, this.ring5SPS.mesh];
        mirrorMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        mirrorMaterial.backFaceCulling = true; // not working??
        mirrorMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        this.glass.material = mirrorMaterial;



        // const displayText = 'Have Yourself a Merry Little Christmas';
        // const scale = 10;
        // const depth = .75;

        // const Writer = new MESHWRITER(this.scene, { scale: scale });
        // this.text1 = new Writer(
        //     displayText,
        //     {
        //         anchor: 'center',
        //         'letter-height': scale,
        //         'letter-thickness': depth,
        //         color: '#ff0000',
        //         position: {
        //             x: 0,
        //             y: 30,
        //             z: 30
        //         }
        //     }
        // );

        // this.text1.getMesh().setPivotPoint(this.text1.getMesh().getBoundingInfo().boundingBox.centerWorld, BABYLON.Space.WORLD);

        // this.text1.getMesh().rotation.x = -Math.PI / 2;
        // this.text1.getMesh().material = this.lineMat;

        // this.textSPS = this.text1.getSPS() as BABYLON.SolidParticleSystem;

        // this.textSPS.updateParticle = (particle) => {
        //     const py = this.audioService.sample1[ (particle.idx + 1) * 5 + 192];
        //     particle.position.z = py / 5;
        //     const pc = this.colorsService.colors(py);
        //     particle.color.r = pc.r / 255;
        //     particle.color.g = pc.g / 255;
        //     particle.color.b = pc.b / 255;
        // };

        // this.engineService.scene.registerBeforeRender(this.textSPS.setParticles);

        // console.log('this.textSPS');
        // console.log(this.textSPS);
        // console.log('this.text1');
        // console.log(this.text1);

    }




    update() { }

    remove() {
        this.ring1SPS.mesh.dispose();
        this.mesh1.dispose();
        this.ring1SPS.dispose();
        this.ring1SPS = null; // tells the GC the reference can be cleaned up also

        this.ring3SPS.mesh.dispose();
        this.mesh3.dispose();
        this.ring3SPS.dispose();
        this.ring3SPS = null; // tells the GC the reference can be cleaned up also

        this.ring5SPS.mesh.dispose();
        this.mesh5.dispose();
        this.ring5SPS.dispose();
        this.ring5SPS = null; // tells the GC the reference can be cleaned up also

        // this.textSPS.mesh.dispose();
        // this.textSPS.dispose();
        // this.text1.dispose();
        // this.textSPS = null;
        // this.text1 = null;

        this.glass.dispose();

        this.scene.unregisterBeforeRender(this.beforeRender);

        this.audioService = null;
        this.optionsService = null;
        this.messageService = null;
        this.engineService = null;
        this.colorsService = null;
        this.scene = null;
    }
}
