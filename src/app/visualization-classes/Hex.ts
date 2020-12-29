
import * as BABYLON from 'babylonjs';
// import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
// import { MessageService } from '../services/message/message.service';
import { EngineService } from '../services/engine/engine.service';
// import { ColorsService } from '../services/colors/colors.service';

export class Hex {

    private scene: BABYLON.Scene;
    // private audioService: AudioService;
    private optionsService: OptionsService;
    // private messageService: MessageService;
    private engineService: EngineService;
    // private colorsService: ColorsService;

    private rotation = 0;

    constructor(scene, audioService, optionsService, messageService, engineService, colorsService) {
        this.scene = scene;
        // this.audioService = audioService;
        this.optionsService = optionsService;
        // this.messageService = messageService;
        this.engineService  = engineService;
        // this.colorsService = colorsService;

        this.scene.registerBeforeRender(this.beforeRender);

        // this.setDefaults();
    }

    // setDefaults() {
    //     (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.x = 0;
    //     (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.y = -20;
    //     (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target.z = 0;

    //     (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72; // 4.72
    //     (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .91; // 1
    //     (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1400;
    // }

    beforeRender = () => {
        this.engineService.hexSPS.setParticles();

        if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].autoRotate.value) {
            this.rotation += Math.PI / 500;
            if (this.rotation >= Math.PI * 2) {
                this.rotation = 0;
            }
            this.engineService.hexParent.rotation.y = this.rotation;
        }
    }

    create() {
        this.engineService.hexParent.setEnabled(true);
    }

    update() { }

    remove() {

        this.scene.unregisterBeforeRender(this.beforeRender);

        this.engineService.hexParent.setEnabled(false);

        // this.audioService = null;
        this.optionsService = null;
        // this.messageService = null;
        this.engineService = null;
        // this.colorsService = null;
        this.scene = null;
    }

}
