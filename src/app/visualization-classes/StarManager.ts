import { AudioService } from '../services/audio/audio.service';
import * as BABYLON from 'babylonjs';

import {
    Star
} from './Star.js';

import {
    getBiasedGlowMaterial
} from './utilities.js';

export class StarManager {

    private objects;
    private scene: BABYLON.Scene;
    private audioService: AudioService;

    private pieResolution;
    starMasters;
    currentProcedure;

    masterTransform;

    // constructor(sceneManager, eventBus, audioService) {
    constructor(scene, audioService) {

        // this.sceneManager = sceneManager;
        this.scene = scene;

        // this.eventBus = eventBus;
        this.audioService = audioService;

        this.pieResolution = 256;
        this.objects = [];
        this.starMasters = [];

        this.currentProcedure = this.createStarGroupRandom5;

        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).target = new BABYLON.Vector3(0, 0, 0);
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).alpha = 4.72;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).beta = .01;
        (this.scene.cameras[0] as BABYLON.ArcRotateCamera).radius = 900;

        // $('#cameraTarget').removeClass('hidden');

    }

    create() {
        let starMaster;
        this.masterTransform = new BABYLON.TransformNode('root');
        this.masterTransform.position = new BABYLON.Vector3(0, 0, 0);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode('starMaster');

        this.currentProcedure({
            r: .95,
            g: .45,
            b: .95
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster,
            this.audioService.soundArrays[1]);

        starMaster.position = new BABYLON.Vector3(-225, 0, 75);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .3;
        starMaster.scaling.y = .3;
        starMaster.scaling.z = .3;
        starMaster.rotation.y = Math.PI / 2;

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode('starMaster');

        this.currentProcedure({
            r: .95,
            g: .45,
            b: .95
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster,
            this.audioService.soundArrays[2]);

        starMaster.position = new BABYLON.Vector3(-75, 0, 75);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .3;
        starMaster.scaling.y = .3;
        starMaster.scaling.z = .3;
        starMaster.rotation.y = Math.PI / 2;

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode('starMaster');

        // this.createStarGroupRandom4({
        this.currentProcedure({
            r: .45,
            g: .45,
            b: .75
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster,
            this.audioService.soundArrays[3]);

        starMaster.position = new BABYLON.Vector3(75, 0, 75);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .3;
        starMaster.scaling.y = .3;
        starMaster.scaling.z = .3;
        starMaster.rotation.y = Math.PI / 2;

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode('starMaster');

        // this.createStarGroupRandom4({
        this.currentProcedure({
            r: .45,
            g: .45,
            b: .75
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster,
            this.audioService.soundArrays[4]);

        starMaster.position = new BABYLON.Vector3(225, 0, 75);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .3;
        starMaster.scaling.y = .3;
        starMaster.scaling.z = .3;
        starMaster.rotation.y = Math.PI / 2;

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode('starMaster');

        // this.createStarGroupRandom3({
        this.currentProcedure({
            r: .45,
            g: .65,
            b: .45
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster,
            this.audioService.soundArrays[5]);

        starMaster.position = new BABYLON.Vector3(-225, 0, -75);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .3;
        starMaster.scaling.y = .3;
        starMaster.scaling.z = .3;
        starMaster.rotation.y = Math.PI / 2;

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode('starMaster');

        // this.createStarGroupRandom3({
        this.currentProcedure({
            r: .45,
            g: .65,
            b: .45
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster,
            this.audioService.soundArrays[6]);

        starMaster.position = new BABYLON.Vector3(-75, 0, -75);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .33;
        starMaster.scaling.y = .33;
        starMaster.scaling.z = .33;
        starMaster.rotation.y = Math.PI / 2;

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode('starMaster');

        // this.createStarGroupRandom2({
        this.currentProcedure({
            r: .75,
            g: .45,
            b: .45
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster,
            this.audioService.soundArrays[7]);

        starMaster.position = new BABYLON.Vector3(75, 0, -75);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .35;
        starMaster.scaling.y = .35;
        starMaster.scaling.z = .35;
        starMaster.rotation.y = Math.PI / 2;

        this.starMasters.push(starMaster);

        ////////////////////////////////////////////////////////

        starMaster = new BABYLON.TransformNode('starMaster');

        // this.createStarGroupRandom2({
        this.currentProcedure({
            r: .75,
            g: .45,
            b: .45
        }, {
            x: 0,
            y: 0,
            z: 0
        }, starMaster,
            this.audioService.soundArrays[8]);

        starMaster.position = new BABYLON.Vector3(225, 0, -75);
        starMaster.parent = this.masterTransform;
        starMaster.scaling.x = .3;
        starMaster.scaling.y = .3;
        starMaster.scaling.z = .3;
        starMaster.rotation.y = Math.PI / 2;

        this.starMasters.push(starMaster);

    }

    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////

    update() {
        this.objects.forEach((sObject, index) => {
            sObject.update(index);
        });
    }

    remove() {
        this.objects.forEach(obj => obj.remove());
        this.objects = [];

        this.starMasters.forEach(obj => obj.dispose());
        this.starMasters = [];

        this.masterTransform.dispose();
    }

    /***  FOR REFERENCE ONLY ***/
    //
    // this.soundArrays=[
    //     this.fr64DataArray,
    //     this.fr128DataArray,
    //     this.fr256DataArray,
    //     this.fr512DataArray,
    //     this.fr1024DataArray,
    //     this.fr2048DataArray,
    //     this.fr4096DataArray,
    //     this.fr8192DataArray,
    //     this.fr16384DataArray
    // ];

    createStarGroupRandom2(colorBias, rotationBias, parent, dataSource) {

        for (let index = 0; index < 5; index++) {

            const star = new Star('Random Star 2-' + index, 'star parent', null,
                getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.scene, dataSource, index*10);
            const rad = 20 * index + 10;
            star.setOptions(
                Math.round(Math.random() * 20),
                Math.round(Math.random() * 20),

                Math.pow(2, Math.round(Math.random() * 6)),
                Math.pow(2, Math.round(Math.random() * 6)),

                rad,
                rad + Math.round(Math.random() * 6) - 3,

                256,

                null,

                rotationBias.x === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            star.mesh.parent = parent;
            star.mesh.position.y = index/20;
            this.objects.push(star);
        }
    }

    createStarGroupRandom3(colorBias, rotationBias, parent, dataSource) {

        for (let index = 0; index < 5; index++) {

            const star = new Star('Random Star 3-' + index, 'star parent', null,
                getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.scene, dataSource, index*10);
            const rad = 20 * index + 10;
            const i = Math.round(Math.random() * 10);
            star.setOptions(
                i,
                i + Math.round(Math.random() * 2 + 1),

                Math.pow(2, Math.round(Math.random() * 6) + 1),
                Math.pow(2, Math.round(Math.random() * 6) + 1),

                rad,
                rad,

                256,

                null,

                rotationBias.x === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            star.mesh.parent = parent;
            star.mesh.position.y = index/20;
            this.objects.push(star);
        }
    }

    createStarGroupRandom4(colorBias, rotationBias, parent, dataSource) {

        for (let index = 0; index < 5; index++) {

            const star = new Star('Random Star 4-' + index, 'star parent', null,
                getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.scene, dataSource,index*10);
            const rad = 8 * (9 - index) + 40;
            const i = Math.round(Math.random() * 10);
            star.setOptions(
                i,
                i,

                Math.pow(2, Math.round(Math.random() * 1) + 2),
                Math.pow(2, Math.round(Math.random() * 1) + 4),

                rad,
                rad + 2,

                256,

                null,

                rotationBias.x === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            star.mesh.parent = parent;
            star.mesh.position.y = index/20;
            this.objects.push(star);
        }
    }

    createStarGroupRandom5(colorBias, rotationBias, parent, dataSource) {

        for (let index = 0; index < 5; index++) {

            const star = new Star('Random Star 5-' + index, 'star parent', null,
                getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.scene, dataSource, index*10);
            const rad = 10 * index + 80;
            const i = Math.round(Math.random() * 10 + 2);
            const s = Math.pow(2, Math.round(Math.random() * 1));
            star.setOptions(
                i,
                i - 1,

                Math.pow(2, index),
                Math.pow(2, index),

                rad,
                rad + 5,

                this.pieResolution,

                null,

                rotationBias.x === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            star.mesh.parent = parent;
            star.mesh.position.y = index/20;
            this.objects.push(star);
        }
    }

    createStarGroupRandom6(colorBias, rotationBias, parent, dataSource) {

        for (let index = 0; index < 15; index++) {

            const star = new Star('Random Star 6-' + index, 'star parent', null,
                getBiasedGlowMaterial(colorBias, this.scene), this.pieResolution, null, this.scene, dataSource, index*10);
            const rad = 30 * index + 20;
            const i = Math.round(Math.random() * 10 + 2);
            const s = Math.pow(2, Math.round(Math.random() * 1));
            star.setOptions(
                i + 2,
                i + 1,

                Math.pow(2, Math.round(Math.random() * 4) + 1),
                Math.pow(2, Math.round(Math.random() * 4) + 1),

                rad,
                rad + 1,

                256,

                null,

                rotationBias.x === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.y === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
                rotationBias.z === 1 ? (Math.round(Math.random() * 3) % 2 ? .01 * (Math.round(Math.random() * 2) - 1) : 0) : 0,
            );
            star.mesh.parent = parent;
            star.mesh.position.y = index/20;
            this.objects.push(star);
        }
    }

}
