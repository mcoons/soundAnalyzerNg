import { AudioService } from '../services/audio/audio.service';
import * as BABYLON from 'babylonjs';

export class CubeManager {


    private objects;
    private scene: BABYLON.Scene;
    private audioService: AudioService;

    private master;
    private thetaDelta;
    private cameraMoveDir;

    constructor(scene, audioService) {
        this.scene = scene;
        this.audioService = audioService;
        this.objects = [];

        this.objects = [];
        // window.objects = this.objects;
        this.master = new BABYLON.TransformNode('planeMaster');
        this.master.scaling.x = .7;
        this.master.scaling.y = .7;
        this.master.scaling.z = .7;

        this.thetaDelta = 0;

        this.cameraMoveDir = .002;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, -40, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = Math.PI / 2;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = Math.PI / 2;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 650;
    }

    create() {

        const master = BABYLON.MeshBuilder.CreateBox(('box'), {
            width: 30,
            depth: 30,
            height: 30
        }, this.scene);

        for (let y = 0; y <= 6; y++) { // 9 * 64 = 576
            for (let x = 0; x <= 9; x++) { // 9 * 64 = 576
                for (let z = 0; z <= 7; z++) {
                    // console.log('creating');

                    // let thing = BABYLON.MeshBuilder.CreateBox(('box'), {
                    //     width: width,
                    //     depth: depth,
                    //     height: depth
                    // }, this.scene);

                    // let thing = BABYLON.MeshBuilder.CreateSphere(('sphere'), {
                    //     diameter: 20
                    // }, this.scene);

                    const thing = master.clone('clone');


                    thing.position.x = (x - 4.5) * 80;  // 80
                    thing.position.y = (y - 3) * 80;  // 80
                    thing.position.z = (z - 3.5) * 80;  // 80

                    thing.parent = this.master;

                    thing.doNotSyncBoundingInfo = true;
                    thing.convertToUnIndexedMesh();

                    const r = 1;
                    const g = 1;
                    const b = 1;

                    const color = new BABYLON.Color3(r, g, b);

                    const mat = new BABYLON.StandardMaterial('mat', this.scene);
                    mat.diffuseColor = color;
                    mat.specularColor = new BABYLON.Color3(r * .1, g * .1, b * .1);
                    mat.ambientColor = new BABYLON.Color3(r * .25, g * .25, b * .25);
                    mat.backFaceCulling = true;
                    mat.alpha = 1;

                    thing.material = mat;

                    this.objects.push(thing);
                }
            }
        }

        master.dispose();
    }

    update() {

        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta  += this.cameraMoveDir;
        // console.log(Math.sin ((new Date).getTime()/5000));


        // let osc = Math.sin ((new Date).getTime()/5000)/4 + .5;  // -1 to 1   oscillation
        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = Math.PI * osc;


        // (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha += .002;

        if ((this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha >= Math.PI * 2) {
            (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha -= Math.PI * 2;
        }

        // if (this.cameraMoveDir > 0 && (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta >= 3*Math.PI/4){  //      3.13
        //   this.cameraMoveDir *= -1;
        // }
        // else
        // if (this.cameraMoveDir < 0 && (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta <= Math.PI/4){  //       .01
        //   this.cameraMoveDir *= -1;
        // }



        // console.log('updating');
        this.objects.forEach((o, i) => {

            const yy = this.audioService.sample1[i] * 1.05;
            // yy = (yy / 200 * yy / 200) * 300;

            o.scaling.x = yy / 160; //  + .01;
            o.scaling.y = yy / 160; //  + .01;
            o.scaling.z = yy / 160; //  + .01;

            const r = 128 - yy; // * .8;
            const b = yy;
            const g = 128 - yy;

            o.material.diffuseColor.r = r / 255;
            o.material.diffuseColor.g = g / 255;
            o.material.diffuseColor.b = b / 255;

            o.material.alpha = ((yy / 255) * (yy / 255)); //  + .01; //   - .05;
            // o.material.alpha = yy/255 > .25 ? 1 : 0;
            // console.log('updating');

        });
    }

    remove() {
        this.objects.forEach(o => o.dispose());
        this.objects = null;

        this.master.dispose();
        this.master = null;
    }

}
