
// Used as a base class for Star.  Was intended to assist in star customizations.

export class BaseObject {

    name;
    parent;
    palette;
    material;
    resolution;
    reflect;
    scene;
    dataSource;
    mesh;
    paths;
    sideO;

    constructor(name, parent, palette, material, resolution, reflect, scene, dataSource) {

        this.name = name;
        this.parent = parent;
        this.palette = palette;
        this.material = material;
        this.resolution = resolution;
        this.reflect = reflect;
        this.scene = scene;
        this.dataSource = dataSource;

        this.mesh = null;
        this.paths = [];
        this.sideO = BABYLON.Mesh.DOUBLESIDE;

    }

    create(): string {
        return `${this.name} reports create from BaseObject: ${this.mesh}`;
    }

    update(oo): string {
        return `${this.name} reports update from BaseObject: ${this.mesh}`;
    }

    remove(): void {
        if (this.mesh) {
            this.mesh.dispose();
        }
    }

}
