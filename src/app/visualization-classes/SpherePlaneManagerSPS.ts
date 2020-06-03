
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';


export class SpherePlaneManagerSPS {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private innerSPS;
    // private outerSPS;
    private mat;
    private mesh1;
    // private mesh2;
    hl;

    private rotation = 0;

    constructor(scene, audioService, optionsService, messageService, engineService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72; // 4.72
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .81; // 1
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1200;

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.4;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 0.2;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 0.2;

        this.scene.registerBeforeRender(this.beforeRender);

        this.optionsService.smoothingConstant = 5;
        this.optionsService.sampleGain = 4;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');
        this.hl = new BABYLON.HighlightLayer('hl1', this.scene);

    }

    beforeRender = () => {

        this.innerSPS.setParticles();
        // this.outerSPS.setParticles();

        this.rotation += Math.PI / 500;
        if (this.rotation >= Math.PI * 2) {
            this.rotation = 0;
        }

        this.innerSPS.mesh.rotation.y = this.rotation;
        this.mat.wireframe = this.optionsService.showWireframe;

    }

    create() {

        let x: number;
        let z: number;

        const radius = 520;
        const width = 100;
        const depth = 15;
        const height = 20;

        // let gtheta;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = false;

        // BUILD INNER SPS ////////////////////////////////

        const innerPositionFunction = (particle, i, s) => {
            particle.position.x = (x) * 35;
            particle.position.y = 0;
            particle.position.z = (z) * 35;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.innerSPS = new BABYLON.SolidParticleSystem('innerSPS', this.scene, { updatable: true });
        const sphere = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 6, segments: 8 }, this.scene);

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
            let yy = this.audioService.getSample()[555 - particle.idx];
            yy = (yy / 200 * yy / 200) * 255;

            particle.color.r = this.optionsService.colors(yy).r / 255;
            particle.color.g = this.optionsService.colors(yy).g / 255;
            particle.color.b = this.optionsService.colors(yy).b / 255;

            particle.scale.x = yy / 20 + .5;
            particle.scale.y = yy / 20 + .5;
            particle.scale.z = yy / 20 + .5;
            // this.hl.addMesh(particle, BABYLON.Color3.Green());

        };

    }

    update() { }

    remove() {
        this.innerSPS.mesh.dispose();
        // this.outerSPS.mesh.dispose();
        this.mesh1.dispose();
        // this.mesh2.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);

        (this.scene.lights[0] as BABYLON.PointLight).intensity = 0.8;
        (this.scene.lights[1] as BABYLON.PointLight).intensity = 1.0;
        (this.scene.lights[2] as BABYLON.PointLight).intensity = 1.0;
    }

}
