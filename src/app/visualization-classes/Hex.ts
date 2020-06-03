
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';

export class Hex {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;
    private engineService: EngineService;

    private SPS;
    private mat;
    private mesh1;
    groundMat;
    groundCSG;
    spsCSG;
    holyGroundCSG;
    finalGround;
    groundCover;
    groundParent;
    tube1;
    tube2;

    private rotation = 0;


    constructor(scene, audioService, optionsService, messageService, engineService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.engineService = engineService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, -20, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72; // 4.72
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .91; // 1
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1400;

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.4;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 0.2;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 0.2;

        this.scene.registerBeforeRender(this.beforeRender);
        // this.scene.registerAfterRender(this.afterRender);

        this.optionsService.smoothingConstant = 5;
        this.optionsService.sampleGain = 4;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');

    }

    beforeRender = () => {

        // this.mat.ambientColor.r = this.optionsService.colors(128).r / 255;
        // this.mat.ambientColor.g = this.optionsService.colors(128).g / 255;
        // this.mat.ambientColor.b = this.optionsService.colors(128).b / 255;

        this.engineService.hexSPS.setParticles();

        this.rotation += Math.PI / 500;
        if (this.rotation >= Math.PI * 2) {
            this.rotation = 0;
        }

        // // this.engineService.finalHexGround.rotation.y = this.rotation;
        // // this.groundCover.rotation.y = this.rotation;


        this.engineService.hexSPS.mesh.rotation.y = this.rotation;
        this.groundParent.rotation.y = this.rotation;

    }

    // afterRender = () => {
    //     this.mesh1.setEnabled = true;
    // }

    create() {
        this.groundParent = new BABYLON.TransformNode('root');
        this.engineService.finalHexGround.setEnabled(true);

        this.engineService.hexMesh.setEnabled(true);
        const matGroundCover = new BABYLON.StandardMaterial('mat1', this.scene);
        matGroundCover.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse1.jpg', this.scene);
        matGroundCover.bumpTexture = new BABYLON.Texture('../../assets/mats/normal1.jpg', this.scene);
        (matGroundCover.diffuseTexture as BABYLON.Texture).vScale = 2;
        (matGroundCover.bumpTexture as BABYLON.Texture).vScale = 2;
        (matGroundCover.diffuseTexture as BABYLON.Texture).uScale = 100;
        (matGroundCover.bumpTexture as BABYLON.Texture).uScale = 100;

        const matGround = new BABYLON.StandardMaterial('mat1', this.scene);
        matGround.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse2.jpg', this.scene);
        matGround.bumpTexture = new BABYLON.Texture('../../assets/mats/normal2.jpg', this.scene);
        // matGround.diffuseTexture.vScale = 2;
        // matGround.bumpTexture.vScale = 2;
        (matGround.diffuseTexture as BABYLON.Texture).uScale = 10;
        (matGround.diffuseTexture as BABYLON.Texture).vScale = 10;
        (matGround.bumpTexture as BABYLON.Texture).uScale = 10;
        (matGround.bumpTexture as BABYLON.Texture).vScale = 10;

        this.engineService.finalHexGround.material = matGround;
        this.engineService.finalHexGround.parent = this.groundParent;

        const path = [];
        const segLength = 100;
        // const numSides = 44;
        const numSides = 6;

        const mat = new BABYLON.StandardMaterial('mat1', this.scene);
        mat.diffuseColor = new BABYLON.Color3(1, 1, 1);
        mat.backFaceCulling = false;

        for (let i = -1; i <= 0; i++) {
            let x = (i / 2) * segLength;
            const y = 0;
            const z = 0;
            path.push(new BABYLON.Vector3(x, y, z));
        }

        // this.groundCover = BABYLON.Mesh.CreateTube('tube', path, 378, numSides, null, 0, this.scene);
        this.groundCover = BABYLON.Mesh.CreateTube('tube', path, 441, numSides, null, 0, this.scene);
        this.groundCover.rotation.z = Math.PI / 2;
        this.groundCover.rotation.y = Math.PI / 6;
        
        this.groundCover.material = matGroundCover;
        this.groundCover.convertToFlatShadedMesh();
        // this.groundCover.scaling.y = 1.13;
        this.groundCover.position.y = 6;

        this.groundCover.parent = this.groundParent;

        const matTube = new BABYLON.StandardMaterial('mat1', this.scene);
        matTube.diffuseTexture = new BABYLON.Texture('../../assets/mats/diffuse3.jpg', this.scene);
        matTube.bumpTexture = new BABYLON.Texture('../../assets/mats/normal3.jpg', this.scene);
        // matTube.diffuseTexture.vScale = 50;
        (matTube.diffuseTexture as BABYLON.Texture).uScale = 50;
        // matTube.bumpTexture.vScale = 2;
        // matTube.bumpTexture.uScale = 100;

        // this.tube1 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 750, thickness: 13, tessellation: 44 }, this.scene);
        this.tube1 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 880, thickness: 13, tessellation: 6 }, this.scene);
        this.tube1.material = mat;
        this.tube1.position.y = 7.5;
        this.tube1.parent = this.groundParent;
        // this.tube1.scaling.x = 1.13;
        this.tube1.scaling.y = .5;
        this.tube1.material = matTube;
        this.tube1.rotation.y = Math.PI / 6;


        // this.tube2 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 750, thickness: 13, tessellation: 44 }, this.scene);
        this.tube2 = BABYLON.MeshBuilder.CreateTorus('torus', { diameter: 880, thickness: 13, tessellation: 6 }, this.scene);
        this.tube2.material = mat;
        this.tube2.position.y = -48;
        this.tube2.parent = this.groundParent;
        // this.tube2.scaling.x = 1.13;
        this.tube2.material = matTube;
        this.tube2.rotation.y = Math.PI/6;



        // // var groundBox = BABYLON.MeshBuilder.CreateBox('groundBox', {height: 100, width: 1000, depth: 1000}, this.scene);
        // var groundBox = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 750, tessellation: 22, height: 42 }, this.scene);
        //     groundBox.position.y = -21;
        //     groundBox.scaling.x = 1.13;
        // this.groundCSG = BABYLON.CSG.FromMesh(groundBox);
        // groundBox.dispose();

        // let x: number;
        // let x2: number;
        // let z: number;

        // this.groundMat = new BABYLON.StandardMaterial(`groundMat`, this.scene);


        // this.mat = new BABYLON.StandardMaterial(`material`, this.scene);
        // this.mat.bumpTexture = new BABYLON.Texture('../../assets/images/normal8.jpg', this.scene);
        // // this.mat.ambientColor = new BABYLON.Color3(.5, .5, .5);


        // this.mat.bumpTexture.uScale = 10.5;
        // this.mat.bumpTexture.vScale = 5.5;

        // this.mat.backFaceCulling = false;

        // // BUILD SPS ////////////////////////////////

        // const innerPositionFunction = (particle, i, s) => {

        //     particle.position.x = (x2) * 35.5;
        //     particle.position.y = -24.5;
        //     particle.position.z = (z) * 31;
        //     particle.color = new BABYLON.Color3(.5, .5, .5);
        //     particle.rotation.y = Math.PI / 6;

        // };

        // this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });
        // const hex = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 38, tessellation: 6, height: 50 }, this.scene);
        // hex.convertToFlatShadedMesh();
        // this.engineService.highlightLayer.addMesh(hex, BABYLON.Color3.Green());

        // for (z = -15; z < 15; z++) {
        //     for (x = -15; x < 15; x++) {
        //         x2 = x;
        //         if (Math.abs(z) % 2 === 1) {
        //             x2 = x - .5;
        //             // console.log(i);
        //         }
        //         const d = Math.sqrt((x2 * x2) + (z * z));
        //         if (d <= 13.3) {
        //             this.SPS.addShape(hex, 1, { positionFunction: innerPositionFunction });
        //         }
        //     }
        // }

        // this.mesh1 = this.SPS.buildMesh();
        // this.mesh1.material = this.mat;
        // this.mesh1.scaling.x = .8;
        // this.mesh1.scaling.y = .8;
        // this.mesh1.scaling.z = .8;

        // this.spsCSG = BABYLON.CSG.FromMesh(this.mesh1);
        // this.holyGroundCSG = this.groundCSG.subtract(this.spsCSG);
        // this.finalGround = this.holyGroundCSG.toMesh('ground', this.groundMat, this.scene);
        // this.finalGround.position.y = -19;
        // this.finalGround.convertToFlatShadedMesh();

        // // var serializedMesh = BABYLON.SceneSerializer.SerializeMesh(this.finalGround);
        // // var strMesh = JSON.stringify(serializedMesh);
        // // console.log(strMesh);

        // // dispose the model
        // hex.dispose();

        // this.SPS.updateParticle = (particle) => {
        //     let yy = this.audioService.getSample()[555 - particle.idx];
        //     yy = (yy / 255 * yy / 255) * 255;

        //     particle.color.r = this.optionsService.colors(yy).r / 255;
        //     particle.color.g = this.optionsService.colors(yy).g / 255;
        //     particle.color.b = this.optionsService.colors(yy).b / 255;

        //     particle.position.y = -24.5 + yy / 3;
        //     particle.scaling.x = .9;
        //     particle.scaling.z = .9;
        // };

    }

    update() { }

    remove() {
        // this.SPS.mesh.dispose();
        // this.mesh1.dispose();
        // this.finalGround.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);
        this.engineService.finalHexGround.setEnabled(false);
        this.engineService.hexMesh.setEnabled(false);
        this.tube1.dispose();
        this.tube2.dispose();
        this.groundCover.dispose();

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.8;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 1.0;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 1.0;
    }

}
