import { AudioService } from '../services/audio/audio.service';
import * as BABYLON from 'babylonjs';

export class BlockSpiralManager {

    private objects;
    private scene: BABYLON.Scene;
    private audioService: AudioService;

    private wheel1Master;

    constructor(scene, audioService) {

        this.scene = scene;
        this.audioService = audioService;
        this.objects = [];

        this.wheel1Master = new BABYLON.TransformNode('root');
        this.wheel1Master.position = new BABYLON.Vector3(0, 0, 0);
        this.wheel1Master.scaling.x = 4;
        this.wheel1Master.scaling.y = 4;
        this.wheel1Master.scaling.z = 4;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, -50, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = 1.00;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 1600;

    }

    create() {

        // let width = 8;
        let radius = 20;
        // let depth = 2.0;

        // const master = BABYLON.MeshBuilder.CreateBox(('box'), {
        //     width: width,
        //     depth: depth
        // }, this.scene);

        for (let theta = 0; theta < 18 * Math.PI; theta += Math.PI / 32) { // 512 items ---  256*2    128*4    64*8

            // width = 6;
            // depth = radius / 12;

            const thing = BABYLON.MeshBuilder.CreateBox(('box'), {
                width: 6,
                depth: radius / 12
            }, this.scene);

            // let thing = master.clone('clone');

            // thing.width = width;
            // thing.depth = depth;

            thing.position.x = radius * Math.cos(theta);
            thing.position.z = radius * Math.sin(theta);
            thing.position.y = 50;
            thing.rotation.y = -theta;

            thing.doNotSyncBoundingInfo = true;
            thing.convertToUnIndexedMesh();

            const r = .5;
            const g = .5;
            const b = .5;

            const color = new BABYLON.Color3(r, g, b);

            const mat = new BABYLON.StandardMaterial('matSpiral', this.scene);
            mat.diffuseColor = color;
            mat.specularColor = new BABYLON.Color3(0, 0, 0);

            mat.backFaceCulling = true;

            thing.material = mat;

            thing.parent = this.wheel1Master;
            this.objects.push(thing);
            radius += .12;
        }

        // master.dispose();

    }


    update() {
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha += .001;
        if ((this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha >= 2 * Math.PI) {
            (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha -= 2 * Math.PI;
        }


        this.objects.forEach((o, i) => {
            let y = (this.audioService.sample1[i]);
            y = (y / 255 * y / 255) * 255;

            o.scaling.y = .05 + y / 17;
            o.position.y = o.scaling.y / 2 - i / 10 + 50;

            const b = y * .9;
            const g = 128 - y * 1.5;
            const r = 128 - y / 2;

            o.material.diffuseColor.r = r / 255;
            o.material.diffuseColor.g = g / 255;
            o.material.diffuseColor.b = b / 255;

        });

    }

    remove() {
        this.objects.forEach(o => o.dispose());
        this.objects = null;

        this.wheel1Master.dispose();
    }

}
