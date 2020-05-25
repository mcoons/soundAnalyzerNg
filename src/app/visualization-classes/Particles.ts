
import * as BABYLON from 'babylonjs';
import { AudioService } from '../services/audio/audio.service';
import { OptionsService } from '../services/options/options.service';
import { MessageService } from '../services/message/message.service';

export class Particles {

    private scene: BABYLON.Scene;
    private audioService: AudioService;
    private optionsService: OptionsService;
    private messageService: MessageService;

    SPS;
    mat;

    constructor(scene, audioService, optionsService, messageService) {

        this.scene = scene;
        this.audioService = audioService;
        this.optionsService = optionsService;
        this.messageService = messageService;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = 1.00;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 500;
    }

    create() {
        const url = "http://jerome.bousquie.fr/BJS/images/rock.jpg";
        this.mat = new BABYLON.StandardMaterial('mat1', this.scene);
        const texture = new BABYLON.Texture(url, this.scene);
        this.mat.diffuseTexture = texture;
        this.mat.backFaceCulling = false;


        // custom vertex function
        function myVertexFunction(particle, vertex, i) {
            vertex.x *= (Math.random() + 1);
            vertex.y *= (Math.random() + 1);
            vertex.z *= (Math.random() + 1);
        }

        // custom position function
        function myPositionFunction(particle, i, s) {
            const fact = 300;   // density

            let grey = 0.0;
            const scaleX = Math.random() * 2 + 0.8;
            const scaleY = Math.random() + 0.8;
            const scaleZ = Math.random() * 2 + 0.8;
            particle.scale.x = scaleX;
            particle.scale.y = scaleY;
            particle.scale.z = scaleZ;
            particle.position.x = (Math.random() - 0.5) * fact;
            particle.position.y = (Math.random() - 0.5) * fact;
            particle.position.z = (Math.random() - 0.5) * fact;
            particle.rotation.x = Math.random() * 3.5;
            particle.rotation.y = Math.random() * 3.5;
            particle.rotation.z = Math.random() * 3.5;
            grey = 1.0 - Math.random() * 0.3;
            particle.color = new BABYLON.Color4(grey, grey, grey, 1);
        }

        this.SPS = new BABYLON.SolidParticleSystem('SPS', this.scene, { updatable: true });
        const sphere = BABYLON.MeshBuilder.CreateSphere('s', { diameter: 6, segments: 8 }, this.scene);
        this.SPS.addShape(sphere, 2000, { positionFunction: myPositionFunction, vertexFunction: myVertexFunction });
        const mesh = this.SPS.buildMesh();
        mesh.material = this.mat;
        // dispose the model
        sphere.dispose();
        // let k = Date.now();

        this.scene.registerBeforeRender(this.beforeRender);
        this.SPS.updateParticle = (particle) => {
            particle.rotation.x += .03;
            // console.log('p');
            // particle.velocity--;
            // if (particle.velocity < 0) {
            //   particle.alive = false;
            //   this.SPS.recycleParticle(particle); // call to your own recycle function
            // }
          };
    }

    update() {

    }

    remove() {
        this.SPS.mesh.dispose();
        this.scene.unregisterBeforeRender(this.beforeRender);
    }

    beforeRender = () => {
        this.SPS.setParticles();
        // this.SPS.mesh.rotation.y += 0.001;
        // this.SPS.mesh.position.y = Math.sin((15 - Date.now()) / 1000) * 2; // 15 was k
        // k += 0.02;
    }


}
