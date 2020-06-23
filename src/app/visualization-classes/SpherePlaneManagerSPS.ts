
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

    private innerSPS;
    private mat;
    private mesh1;
    // hl;

    private rotation = 0;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.colorsService = colorsService;

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.4;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 0.2;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 0.2;

        this.scene.registerBeforeRender(this.beforeRender);

        // this.hl = new BABYLON.HighlightLayer('hl1', this.scene);

        this.setDefaults();
    }

    setDefaults() {
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = 0;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72; // 4.72
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .81; // 1
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1200;
    }

    beforeRender = () => {

        this.innerSPS.setParticles();

        if (this.optionsService.animateCamera) {
            this.rotation += Math.PI / 500;
            if (this.rotation >= Math.PI * 2) {
                this.rotation = 0;
            }

            this.innerSPS.mesh.rotation.y = this.rotation;
        }
    }

    create() {

        let x: number;
        let z: number;

        const radius = 520;
        const width = 100;
        const depth = 15;
        const height = 20;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = false;

        // BUILD INNER SPS ////////////////////////////////

        const innerPositionFunction = (particle, i, s) => {
            particle.position.x = x * 35;
            particle.position.y = 0;
            particle.position.z = z * 35;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.innerSPS = new BABYLON.SolidParticleSystem('innerSPS', this.scene, { updatable: true });
        const sphere = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 6, segments: 2, updatable: true }, this.scene);

        for (z = -15; z < 15; z++) {
            for (x = -15; x < 15; x++) {
                const d = Math.sqrt((x * x) + (z * z));
                if (d <= 13.3) {
                    this.innerSPS.addShape(sphere, 1, { positionFunction: innerPositionFunction });
                }
            }
        }

        this.mesh1 = this.innerSPS.buildMesh();
        this.mesh1.material = this.mat;
        this.mesh1.scaling.x = .8;
        this.mesh1.scaling.y = .8;
        this.mesh1.scaling.z = .8;


        // dispose the model
        sphere.dispose();

        this.innerSPS.updateParticle = (particle) => {
            let yy = this.audioService.sample1[particle.idx];
            yy = (yy / 200 * yy / 200) * 255;

            particle.color.r = this.colorsService.colors(yy).r / 255;
            particle.color.g = this.colorsService.colors(yy).g / 255;
            particle.color.b = this.colorsService.colors(yy).b / 255;

            const s = yy / 30 + .5;
            particle.scale.x = s;
            particle.scale.y = s;
            particle.scale.z = s;

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
