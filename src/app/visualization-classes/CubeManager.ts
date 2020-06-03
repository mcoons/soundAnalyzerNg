
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';

export class CubeManager {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    private SPS;
    private mesh;
    private mat;

    constructor(scene, audioService, optionsService, messageService, engineService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, -40, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = Math.PI / 2;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = Math.PI / 2;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1000;

        // this.optionsService.smoothingConstant = 7;
        // this.optionsService.sampleGain = 1;
        // this.messageService.announceMessage('sampleGain');
        // this.messageService.announceMessage('smoothingConstant');

        this.scene.registerBeforeRender(this.beforeRender);
    }

    beforeRender = () => {
        this.SPS.setParticles();
        this.mat.wireframe = this.optionsService.showWireframe;
    }

    create() {
        let x: number;
        let y: number;
        let z: number;

        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        this.mat.backFaceCulling = true;
        this.mat.specularColor = new BABYLON.Color3(.1, .1, .1);
        this.mat.ambientColor = new BABYLON.Color3(.25, .25, .25);

        const myPositionFunction = (particle, i, s) => {
            particle.position.x = (x - 4.5) * 80;  // 80
            particle.position.y = (y - 3) * 80;  // 80
            particle.position.z = (z - 3.5) * 80;  // 80
            particle.color = new BABYLON.Color4(.5, .5, .5, .1);
        };

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });

        const box = BABYLON.MeshBuilder.CreateBox(('box'), {
            width: 30,
            depth: 30,
            height: 30
        }, this.scene);

        for ( y = 0; y <= 8; y++) { // 9 * 64 = 576
            for ( x = 0; x <= 9; x++) { // 9 * 64 = 576
                for ( z = 0; z <= 7; z++) {
                    this.SPS.addShape(box, 1, { positionFunction: myPositionFunction });
                }
            }
        }
        box.dispose();

        this.mesh = this.SPS.buildMesh();
        this.mesh.material = this.mat;
        this.SPS.mesh.hasVertexAlpha = true;

        this.SPS.updateParticle = (particle) => {
            let yy = this.audioService.sample1[particle.idx] * 1.05;
            yy = (yy / 155 * yy / 155) * 255;

            particle.scaling.x = yy / 160;
            particle.scaling.y = yy / 160;
            particle.scaling.z = yy / 160;

            const r = (128 - yy) / 255;
            const b = yy / 255;
            const g = (128 - yy) / 255;

            particle.color = new BABYLON.Color4(r, g, b, (yy / 255) * (yy / 255));
        };
    }

    update() {    }

    remove() {
        this.SPS.mesh.dispose();
        this.mesh.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);
    }
}
