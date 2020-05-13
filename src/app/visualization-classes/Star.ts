import {
    BaseObject
} from './BaseObject';


export class Star extends BaseObject {
    innerStartIndex;
    outerStartIndex;

    innerEndIndex;
    outerEndIndex;

    innerSlices;
    outerSlices;

    innerRadius;
    outerRadius;

    xRotationDelta;
    yRotationDelta;
    zRotationDelta;

    innerPath;
    outerPath;
    innerIndexDirection;
    outerIndexDirection;
    innerDataIndex;
    outerDataIndex;
    innerItemsDesired;
    outerItemsDesired;
    yOffset;


    constructor(name, parent, palette, material, resolution, reflect, scene, dataSource, yOffset) {
        // constructor(name, parent, palette, material, resolution, reflect, eventBus, scene, dataSource) {

        // super(name, parent, palette, material, resolution, reflect, eventBus, scene, dataSource);
        super(name, parent, palette, material, resolution, reflect, scene, dataSource);

        ////////////////////////////
        // class specific variables

        this.innerStartIndex = 0;
        this.outerStartIndex = 1;

        this.innerSlices = 8;
        this.outerSlices = 8;

        this.innerRadius = 90;
        this.outerRadius = 95;

        this.xRotationDelta = 0;
        this.yRotationDelta = 0;
        this.zRotationDelta = 0;

        this.innerPath = [];
        this.outerPath = [];

        // oscillates for the up/down of data points on each pie slice
        this.innerIndexDirection = -1;
        this.outerIndexDirection = -1;

        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray

        this.innerItemsDesired = 128 / this.innerSlices;
        this.outerItemsDesired = 128 / this.outerSlices;

        this.innerEndIndex = this.innerStartIndex + Math.round(this.innerItemsDesired);
        this.outerEndIndex = this.outerStartIndex + Math.round(this.outerItemsDesired);

        this.yOffset = yOffset/10;
        this.create();

        // var self = this;
        // this.eventBus.subscribe('eventTest', eventTestCallback);

        // function eventTestCallback() {
        //     // console.log('Event Received from ' + self.name);
        //     // console.log('My position is ' + self.mesh.position);
        //     self.testCallback();
        // }
        // this.eventBus.unsubscribe('eventTest', eventTestCallback);

    }

    // testCallback() {
    //     // console.log('method test from: ' + this.name);
    // }

    create() {
        for (let r = 1; r <= 2; r++) {
            const path = [];
            for (let theta = 0; theta < 2 * Math.PI; theta += 2 * Math.PI / this.resolution) {

                const x = r * Math.cos(theta);
                const z = r * Math.sin(theta);
                // const y = 0;
                const y = this.yOffset;

                path.push(new BABYLON.Vector3(x, y, z));
            }
            // path.push(path[0]);
            this.paths.push(path);
        }
        

        // this.mesh = BABYLON.Mesh.CreateRibbon('ribbon', this.paths, true, true, 0, this.scene, true, this.sideO);
        
        this.mesh = BABYLON.MeshBuilder.CreateRibbon('ribbon',
        { pathArray: this.paths, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true },
        this.scene);
        




        this.mesh.material = this.material;

        // this.mesh.doNotSyncBoundingInfo = true;
        // this.mesh.convertToUnIndexedMesh();


        if (this.reflect) {
            this.reflect.addToRenderList(this.mesh);
        }

        return this.mesh;
    }

    update(zindex) {

        const data = this.dataSource;

        // Rotation imposes the rotation order YXZ in local space using Euler angles.
        this.mesh.rotation.y += this.yRotationDelta;
        this.mesh.rotation.x += this.xRotationDelta;
        this.mesh.rotation.z += this.zRotationDelta;
        this.innerIndexDirection = -1; // this.innerIndexDirection to traverse the frDataArray, flips to positive at start
        this.outerIndexDirection = -1; // this.outerIndexDirection to traverse the frDataArray, flips to positive at start
        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray
        this.paths = [];
        this.innerPath = [];
        this.outerPath = [];

        for (let theta = 0; theta <= 2 * Math.PI; theta += 2 * Math.PI / this.resolution) {
            // inner range calculations
            if (this.innerDataIndex >= this.innerEndIndex || this.innerDataIndex <= this.innerStartIndex) {
                this.innerIndexDirection = -this.innerIndexDirection;
            }

            const innerX = data[this.innerDataIndex] * this.innerRadius * Math.cos(theta) / 100;
            const innerZ = data[this.innerDataIndex] * this.innerRadius * Math.sin(theta) / 100;
            const innerY = -.01 * zindex + this.yOffset;
            this.innerDataIndex += this.innerIndexDirection;

            this.innerPath.push(new BABYLON.Vector3(innerX, innerY, innerZ));

            // outer range calculations
            if (this.outerDataIndex >= this.outerEndIndex || this.outerDataIndex <= this.outerStartIndex) {
                this.outerIndexDirection = -this.outerIndexDirection;
            }

            const outerX = data[this.outerDataIndex] * this.outerRadius * Math.cos(theta) / 100;
            const outerZ = data[this.outerDataIndex] * this.outerRadius * Math.sin(theta) / 100;
            // const outerY = -.001 * zindex;
            const outerY = -.01 * zindex + this.yOffset;
            this.outerDataIndex += this.outerIndexDirection;

            this.outerPath.push(new BABYLON.Vector3(outerX, outerY, outerZ));
        }

        this.paths.push(this.innerPath);
        this.paths.push(this.outerPath);

        this.mesh = BABYLON.MeshBuilder.CreateRibbon(null, {
            pathArray: this.paths,
            instance: this.mesh
        });

        return `${this.name} says updated from star.`;
    }

    remove() {
        if (this.mesh) {
            this.mesh.dispose();
        }
        super.remove();
    }

    setOptions( PinnerStartIndex, PouterStartIndex, PinnerSlices, PouterSlices, PinnerRadius, PouterRadius,
                Presolution, Preflect, PxRotation, PyRotation, PzRotation) {
        // reset other things in here too like color, reset rotations

        // this.innerStartIndex = PinnerStartIndex ? PinnerStartIndex : this.innerStartIndex;
        // this.outerStartIndex = PouterStartIndex ? PouterStartIndex : this.outerStartIndex;

        this.innerSlices = PinnerSlices ? PinnerSlices : this.innerSlices;
        this.outerSlices = PouterSlices ? PouterSlices : this.outerSlices;

        // this.innerRadius = PinnerRadius ? PinnerRadius : this.innerRadius;
        // this.outerRadius = PouterRadius ? PouterRadius : this.outerRadius;

        this.resolution = Presolution ? Presolution : this.resolution;

        this.reflect = Preflect ? Preflect : this.reflect;

        this.xRotationDelta = PxRotation ? PxRotation : this.xRotationDelta;
        this.yRotationDelta = PyRotation ? PyRotation : this.yRotationDelta;
        this.zRotationDelta = PzRotation ? PzRotation : this.zRotationDelta;

        /////////////////////////////////////////////////////////

        this.innerDataIndex = this.innerStartIndex; // index into the frDataArray
        this.outerDataIndex = this.outerStartIndex; // index into the frDataArray

        this.innerItemsDesired = 128 / this.innerSlices;
        this.outerItemsDesired = 128 / this.outerSlices;

        this.innerEndIndex = this.innerStartIndex + Math.round(this.innerItemsDesired);
        this.outerEndIndex = this.outerStartIndex + Math.round(this.outerItemsDesired);
    }

}
