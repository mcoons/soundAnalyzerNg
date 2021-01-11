
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';


export class SpherePlaneManagerSPS {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;
    private colorsService: ColorsService;
    private engineService: EngineService;

    private SPS;
    private mat;
    private mesh1;

    private c;
    private y;
    private s;

    private rotation = 0;

    private audioSample;

    constructor(scene: BABYLON.Scene, audioService: AudioService, optionsService: OptionsService, messageService: MessageService, engineService: EngineService, colorsService: ColorsService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.colorsService = colorsService;
        this.engineService = engineService;

        this.scene.registerBeforeRender(this.beforeRender);

        this.setDefaults();

        this.audioSample = this.audioService.sample2;
    }

    setDefaults(): void {
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 7.86; // 4.72
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = 1.10; // 1
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;
    }

    beforeRender = (): void => {

        this.SPS.setParticles();

        if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].autoRotate.value) {
            this.rotation += Math.PI / 500;
            if (this.rotation >= Math.PI * 2) {
                this.rotation = 0;
            }

            this.SPS.mesh.rotation.y = this.rotation;
        }
    }

    create(): void {

        let x: number;
        let z: number;

        let magicDiameter: number;

        // const radius = 520;
        // const width = 100;
        // const depth = 15;
        // const height = 20;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = false;
        this.mat.maxSimultaneousLights = 8;
        // this.mat.emissiveColor = new BABYLON.Color3(1,1,1);

        if (this.audioSample.length === 224) {
            magicDiameter = 8.5;
        } else if (this.audioSample.length === 576) {
            magicDiameter = 13.46;
        } else {
            magicDiameter = 8.5;
        }

        magicDiameter = 9.05;

        // BUILD INNER SPS ////////////////////////////////

        // const innerPositionFunction = (particle, i, s) => {
        const innerPositionFunction = (particle) => {
            particle.position.x = x * 35;
            particle.position.y = 0;
            particle.position.z = z * 35;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });
        const sphere = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 6, segments: 16, updatable: true }, this.scene);

        for (z = -15; z < 15; z++) {
            for (x = -15; x < 15; x++) {
                const d = Math.sqrt((x * x) + (z * z));
                // if (d <= 13.46) {
                // if (d <= 8.5) {
                if (d <= magicDiameter) {
                    this.SPS.addShape(sphere, 1, { positionFunction: innerPositionFunction });
                }
            }
        }
        // console.log('this.SPS.nbParticles');
        // console.log(this.SPS.nbParticles);

        this.mesh1 = this.SPS.buildMesh();
        this.mesh1.material = this.mat;
        this.mesh1.scaling.x = .8;
        this.mesh1.scaling.y = .8;
        this.mesh1.scaling.z = .8;

        // dispose the model
        sphere.dispose();

        this.SPS.updateParticle = (particle) => {
            this.y = this.audioSample[particle.idx];
            this.y = (this.y / 200 * this.y / 200) * 255;

            this.c = this.colorsService.colors(this.y);

            particle.color.r = this.c.r / 255;
            particle.color.g = this.c.g / 255;
            particle.color.b = this.c.b / 255;

            this.s = this.y / 30 + .5;

            particle.scale.x = this.s;
            particle.scale.y = this.s;
            particle.scale.z = this.s;

        };

    }

    update(): void {
        this.engineService.lightParent.rotation.x += .004;
        this.engineService.lightParent.rotation.y -= .006;
        this.engineService.lightParent.rotation.z += .008;
    }

    remove(): void {
        this.SPS.mesh.dispose();
        this.mesh1.dispose();
        this.SPS.dispose();
        this.SPS = null; // tells the GC the reference can be cleaned up also

        this.scene.unregisterBeforeRender(this.beforeRender);

        this.engineService.lightParent.rotation.x = 0;
        this.engineService.lightParent.rotation.y = 0;
        this.engineService.lightParent.rotation.z = 0;

        this.audioService = null;
        this.optionsService = null;
        this.messageService = null;
        this.engineService = null;
        this.colorsService = null;
        this.scene = null;
    }

}
