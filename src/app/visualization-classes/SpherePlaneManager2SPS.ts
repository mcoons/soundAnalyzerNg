
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
import { ColorsService } from '../services/colors/colors.service';
import { couldStartTrivia } from 'typescript';


export class SpherePlaneManager2SPS {

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

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.colorsService = colorsService;
        this.engineService = engineService;

        this.scene.registerBeforeRender(this.beforeRender);

        this.setDefaults();
    }

    setDefaults() {
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        // console.log((this.optionsService.getOptions()).spherePlaneManager2SPS.calpha);
        // console.log(this.optionsService.options.spherePlaneManager2SPS.cbeta);
        // console.log(this.optionsService.options.spherePlaneManager2SPS.cradius);

        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = (this.optionsService.getOptions())['spherePlaneManager2SPS'].calpha // 4.72

        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = this.optionsService.getOptions().spherePlaneManager2SPS.cbeta; // 1
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = this.optionsService.getOptions().spherePlaneManager2SPS.radius;


        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = Math.PI/2;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .01; // 1
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1200;
    }

    beforeRender = () => {

        this.SPS.setParticles();

        if (this.optionsService.autoRotate) {
            this.rotation += Math.PI / 500;
            if (this.rotation >= Math.PI * 2) {
                this.rotation = 0;
            }

            this.SPS.mesh.rotation.y = this.rotation;
        }
    }

    create() {

        let x: number;
        let y: number;
        let z: number;

        let theta: number;


        const radius = 100;
        // const width = 100;
        // const depth = 15;
        // const height = 20;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = false;



        // this.mat.diffuseTexture = new BABYLON.Texture('../../assets/mats/glow2.png', this.scene);
        // this.mat.backFaceCulling = false;
        // this.mat.opacityTexture = new BABYLON.Texture('../../assets/mats/glow2.png', this.scene);
        // this.mat.specularColor = new BABYLON.Color3(0, 0, 0);

        // this.mat.diffuseTexture.hasAlpha = true;
        // (this.mat.diffuseTexture as BABYLON.Texture).vScale = 1 / 5;
        // (this.mat.opacityTexture as BABYLON.Texture).vScale = 1 / 5;



        // BUILD INNER SPS ////////////////////////////////

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });
        const sphere = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 6, segments: 8, updatable: true }, this.scene);

        // const innerPositionFunction = (particle, i, s) => {
        //     particle.position.x = x * 35;
        //     particle.position.y = y * 35;
        //     particle.position.z = 0;
        //     particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        // };

        // for (y = -4.5; y < 4.5; y++) {
        //     for (x = -32; x < 32; x++) {
        //         this.SPS.addShape(sphere, 1, { positionFunction: innerPositionFunction });
        //     }
        // }



        const innerPositionFunction = (particle, i, s) => {
            particle.position.x = (radius + 10 * y) * Math.cos(theta)  * 1.5;
            particle.position.y = y * 30 ;
            particle.position.z = (radius + 10 * y) * Math.sin(theta);
            // particle.position.x = (radius + ( y % 2 ? 2 : 15) * y) * Math.cos(theta)  * 1.5;
            // particle.position.y = y * 20 ;
            // particle.position.z = (radius + ( y % 2 ? 2 : 15) * y) * Math.sin(theta);
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };
        y = 18;
        // for (y = 18; y >= -18; y--) {
            for (theta = 0; theta < 2 * Math.PI * 18 ; theta+=Math.PI/16) {
                this.SPS.addShape(sphere, 1, { positionFunction: innerPositionFunction });
                y -= 1/32
            }
        // }


        this.mesh1 = this.SPS.buildMesh();
        this.mesh1.material = this.mat;
        this.mesh1.scaling.x = .8;
        this.mesh1.scaling.y = .8;
        this.mesh1.scaling.z = .8;

        // this.engineService.highlightLayer.addMesh(this.mesh1,
        //   new BABYLON.Color3(.4, 0, 1));

        // dispose the model
        sphere.dispose();

        this.SPS.updateParticle = (particle) => {
            this.y = this.audioService.sample1[particle.idx];
            this.y = (this.y / 200 * this.y / 200) * 255;

            this.c = this.colorsService.colors(this.y);

            particle.color.r = this.c.r / 255;
            particle.color.g = this.c.g / 255;
            particle.color.b = this.c.b / 255;

            this.s = this.y / 40 + .5;

            particle.scale.x = this.s;
            particle.scale.y = this.s;
            particle.scale.z = this.s;

        };

    }

    update() { }

    remove() {
        this.SPS.mesh.dispose();
        this.mesh1.dispose();
        this.SPS.dispose();
        this.SPS = null; // tells the GC the reference can be cleaned up also

        this.scene.unregisterBeforeRender(this.beforeRender);


        this.audioService = null;
        this.optionsService = null;
        this.messageService = null;
        this.engineService = null;
        this.colorsService = null;
        this.scene = null;
    }

}
