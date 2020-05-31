
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

    private innerSPS;
    private mat;
    private mesh1;

    private rotation = 0;

    constructor(scene, audioService, optionsService, messageService, engineService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.engineService = engineService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, -20, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72; // 4.72
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = 1.1; // 1
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.4;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 0.2;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 0.2;

        this.scene.registerBeforeRender(this.beforeRender);

        this.optionsService.smoothingConstant = 5;
        this.optionsService.sampleGain = 4;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');

    }

    beforeRender = () => {

        this.innerSPS.setParticles();

        // this.engineService.highlightLayer.removeMesh(this.mesh1);
        // this.engineService.highlightLayer.addMesh(this.mesh1,
        //     new BABYLON.Color3( this.optionsService.colors(128).r/255,
        //                         this.optionsService.colors(128).g/255,
        //                         this.optionsService.colors(128).b/255));

        // this.rotation += Math.PI / 500;
        // if (this.rotation >= Math.PI * 2) {
        //     this.rotation = 0;
        // }

        // this.innerSPS.mesh.rotation.y = this.rotation;
        this.mat.wireframe = this.optionsService.showWireframe;

    }

    create() {

        let x: number;
        let z: number;

        const radius = 520;
        const width = 100;
        const depth = 15;
        const height = 20;

        // this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat = new BABYLON.MultiMaterial('mm', this.scene);


        this.mat.backFaceCulling = false;
        // this.mat.bumpTexture = new BABYLON.Texture('../../assets/images/normal10.jpg', this.scene);

        // BUILD INNER SPS ////////////////////////////////

        const innerPositionFunction = (particle, i, s) => {
            let myMaterial = new BABYLON.StandardMaterial(`material${i}`, this.scene);
            myMaterial.bumpTexture = new BABYLON.Texture('../../assets/images/normal10.jpg', this.scene);

            // myMaterial.bumpTexture.coordinatesmode = BABYLON.Texture.SKYBOX_MODE;


            this.mat.subMaterials.push(myMaterial);
            particle.materialIndex = i;

            particle.position.x = (x) * 35.5;
            particle.position.y = 0;
            particle.position.z = (z) * 31;
            particle.color = new BABYLON.Color3(.5, .5, .5);
            particle.rotation.y = Math.PI / 6;
            if (Math.abs(z) % 2 === 1) {
                particle.position.x -= 17.5;
                // console.log(i);
            }
        };

        this.innerSPS = new BABYLON.SolidParticleSystem('innerSPS', this.scene, { updatable: true, enableMultiMaterial: true });
        const hex = BABYLON.MeshBuilder.CreateCylinder('s', { diameter: 40, tessellation: 6, height: 1 }, this.scene);
        hex.convertToFlatShadedMesh();
        // this.engineService.highlightLayer.addMesh(hex, BABYLON.Color3.Green());


        for (z = -15; z < 15; z++) {
            for (x = -15; x < 15; x++) {
                const d = Math.sqrt((x * x) + (z * z));
                if (d <= 13.3) {
                    this.innerSPS.addShape(hex, 1, { positionFunction: innerPositionFunction });
                }
            }
        }

        this.mesh1 = this.innerSPS.buildMesh();
        this.mesh1.material = this.mat;
        this.mesh1.scaling.x = .8;
        this.mesh1.scaling.y = .8;
        this.mesh1.scaling.z = .8;

        // dispose the model
        hex.dispose();

        this.innerSPS.updateParticle = (particle) => {
            let yy = this.audioService.getSample()[555 - particle.idx];
            yy = (yy / 255 * yy / 255) * 255;

            particle.color.r = this.optionsService.colors(yy).r / 255;
            particle.color.g = this.optionsService.colors(yy).g / 255;
            particle.color.b = this.optionsService.colors(yy).b / 255;

            // particle.scale.x = yy / 20 + .5;
            particle.scale.y = yy / 3  + .5;
            particle.position.y = particle.scaling.y / 2;
            // particle.scale.z = yy / 20 + .5;
        };

    }

    update() { }

    remove() {
        this.innerSPS.mesh.dispose();
        this.mesh1.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.8;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 1.0;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 1.0;
    }

}
