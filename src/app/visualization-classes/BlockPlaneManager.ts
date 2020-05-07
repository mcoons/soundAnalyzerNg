export class BlockPlaneManager {

    private objects;
    private scene;
    private audioService;

    constructor(scene, audioService) {
        this.scene = scene;
        this.audioService = audioService;
        this.objects = [];
    }

    create() {
        const width = 30;
        const depth = 60;

        for (let z = 8; z >= 0; z--) {
            for (let x = 0; x < 64; x++) { // 9 * 64 = 576

                const thing = BABYLON.MeshBuilder.CreateBox(('box'), {
                    width: width,
                    depth: depth
                }, this.scene);

                thing.position.x = (x - 31.5) * 30;
                thing.position.z = (z - 5) * 60;
                thing.position.y = 0;

                thing.doNotSyncBoundingInfo = true;
                thing.convertToUnIndexedMesh();

                const r = 0;
                const g = 0.1;
                const b = 0.0;

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

    update() {
        this.objects.forEach((o, i) => {
            let yy = this.audioService.sample1[i];
            yy = (yy / 200 * yy / 200) * 255;

            o.scaling.y = yy * .5 + .01;
            o.position.y = o.scaling.y / 2;

            const r = yy;
            const b = 200 - yy * 2;
            const g = 128 - yy / 2;

            o.material.diffuseColor.r = r / 255;
            o.material.diffuseColor.g = g / 255;
            o.material.diffuseColor.b = b / 255;
        });
    }

    remove() {
        this.objects.forEach(o => o.dispose());
        this.objects = null;
    }

}
