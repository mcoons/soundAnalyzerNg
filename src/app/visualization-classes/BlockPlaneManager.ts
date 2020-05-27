
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';

export class BlockPlaneManager {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private SPS;
    private mesh;
    private mat;

    constructor(scene, audioService, optionsService, messageService) {
        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = 1.00;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 2600;

        this.optionsService.smoothingConstant = 7;
        this.optionsService.sampleGain = 4;
        this.messageService.announceMessage('sampleGain');
        this.messageService.announceMessage('smoothingConstant');

        this.scene.registerBeforeRender(this.beforeRender);
    }

    beforeRender = () => {
        this.SPS.setParticles();
    }

    create() {
        let z: number;
        let x: number;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = true;
        this.mat.specularColor = new BABYLON.Color3(.1, .1, .1);
        this.mat.ambientColor = new BABYLON.Color3(.25, .25, .25);

        const myPositionFunction = (particle, i, s) => {
            particle.position.x = (x - 31.5) * 30;
            particle.position.z = (z - 5) * 60;
            particle.position.y = 0;
            particle.color = new BABYLON.Color4(.5, .5, .5, 1);
        };

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

        const box = BABYLON.MeshBuilder.CreateBox(('box'), {
            width: 30,
            depth: 60
        }, this.scene);

        for (z = (this.audioService.getSample().length / 64); z >= 0; z--) {  // 8
            for (x = 0; x < 64; x++) { // 9 * 64 = 576
                this.SPS.addShape(box, 1, { positionFunction: myPositionFunction });
            }
        }

        box.dispose();

        this.mesh = this.SPS.buildMesh();
        this.mesh.material = this.mat;

        this.SPS.updateParticle = (particle) => {

            let yy = this.audioService.getSample()[particle.idx];
            yy = (yy / 200 * yy / 200) * 255;

            particle.scaling.y = yy * .5 + .01;
            particle.position.y = particle.scaling.y / 2;

            particle.color.r = this.optionsService.colors(yy).r / 255;
            particle.color.g = this.optionsService.colors(yy).g / 255;
            particle.color.b = this.optionsService.colors(yy).b / 255;

        };
    }

    update() {    }

    remove() {
        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);
    }

}
