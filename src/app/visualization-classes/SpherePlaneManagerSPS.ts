
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

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;
        this.colorsService = colorsService;
        this.engineService = engineService;

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.4;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 0.2;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 0.2;

        this.scene.registerBeforeRender(this.beforeRender);

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

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });
        const sphere = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 6, segments: 2, updatable: true }, this.scene);

        for (z = -15; z < 15; z++) {
            for (x = -15; x < 15; x++) {
                const d = Math.sqrt((x * x) + (z * z));
                if (d <= 13.46) {
                    this.SPS.addShape(sphere, 1, { positionFunction: innerPositionFunction });
                }
            }
        }

        this.mesh1 = this.SPS.buildMesh();
        this.mesh1.material = this.mat;
        this.mesh1.scaling.x = .8;
        this.mesh1.scaling.y = .8;
        this.mesh1.scaling.z = .8;

        // dispose the model
        sphere.dispose();

        this.SPS.updateParticle = (particle) => {
            this.y = this.audioService.sample1[particle.idx];
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

    update() { }

    remove() {
        this.SPS.mesh.dispose();
        this.mesh1.dispose();
        this.SPS.dispose();
        this.SPS = null; // tells the GC the reference can be cleaned up also

        this.scene.unregisterBeforeRender(this.beforeRender);

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.8;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 1.0;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 1.0;

        this.audioService = null;
        this.optionsService = null;
        this.messageService = null;
        this.engineService = null;
        this.colorsService = null;
        this.scene = null;
    }

}
