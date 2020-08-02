
import { Injectable, Inject } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { MessageService } from '../message/message.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  env = 'prod'; // dev or prod

  resizeObservable: Observable<Event>;
  resizeSubscription: Subscription;

  visuals = [
    'singleSPS',
    'starManager',
    'spectrograph',
    'spherePlaneManagerSPS',
    'rings',
    'hex',
    'waveRibbon',
  ];

  SPSs = [
    'blockPlane',
    'thing1',
    'blockSpiral',
    'thing2',
    'equation',
    'thing3',
    'cube',
    'sphere',
    'pole',
    'heart',
    'sineLoop'
  ];

  notes = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'None'
  ];

  baseOptions = {

    version: 3.3,

    // general options
    showTitle: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Title',
      value: true,
    },
    showBars: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Freq Bars',
      value: false
    },
    showWaveform: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Waveform',
      value: false
    },
    waveformMultiplier: {
      group: 'General',
      type: 'waveslider',
      label: 'Waveform Multiplier',
      value: 1,
      min: 1,
      max: 10,
      step: .1
    },

    singleSPS: {
      group: '3DVisual',
      type: 'radio',
      label: 'Exploding SPS',
      value: 0,
      checked: true,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 1,
      smoothingConstant: 5,
      autoRotate: true,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: 1.57,
      cradius: 1000
    },
    singleSPSDelay: {
      group: '3DVisual',
      type: 'slider',
      label: 'Change Delay (sec)',
      value: 10,
      min: 5,
      max: 60,
      step: 5,
    },
    singleSPSExplosionSize: {
      group: '3DVisual',
      type: 'slider',
      label: 'Explosion Size',
      value: 10,
      min: 0,
      max: 150,
      step: 10,
    },




    blockPlane: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Block Plane',
      value: true,
    },
    thing1: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Thing 1',
      value: true,
    },
    blockSpiral: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Block Spiral',
      value: true,
    },
    thing2: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Thing 2',
      value: true,
    },
    equation: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Equation',
      value: true,
    },
    thing3: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Thing 3',
      value: true,
    },
    cube: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Cube',
      value: true,
    },
    sphere: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Sphere',
      value: true,
    },
    pole: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Pole',
      value: true,
    },

    heart: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Heart',
      value: true,
    },

    sineLoop: {
      group: 'SPS',
      type: 'checkbox',
      label: 'Sine Loop',
      value: true,
    },





    starManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Stars',
      value: 1,
      checked: false,
      colorOptions: false,
      cameraOptions: false,
      sampleGain: 1,
      smoothingConstant: 5,
      autoRotate: false,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .01,
      cradius: 800
    },
    spectrograph: {
      group: '3DVisual',
      type: 'radio',
      label: 'Spectrograph',
      value: 2,
      checked: false,
      colorOptions: false,
      cameraOptions: false,
      sampleGain: 1,
      smoothingConstant: 5,
      autoRotate: false,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .85,
      cradius: 1000
    },
    spherePlaneManagerSPS: {
      group: '3DVisual',
      type: 'radio',
      label: 'Sphere Plane',
      value: 3,
      checked: false,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 1,
      smoothingConstant: 5,
      autoRotate: true,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .81,
      cradius: 1200
    },
    rings: {
      group: '3DVisual',
      type: 'radio',
      label: 'Rings',
      value: 4,
      checked: false,
      colorOptions: true,
      cameraOptions: false,
      sampleGain: 1,
      smoothingConstant: 5,
      autoRotate: false,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .81,
      cradius: 1900
    },
    hex: {
      group: '3DVisual',
      type: 'radio',
      label: 'Hex',
      value: 5,
      checked: false,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 1,
      smoothingConstant: 5,
      autoRotate: true,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .91,
      cradius: 1400
    },
    waveRibbon: {
      group: '3DVisual',
      type: 'radio',
      label: 'WaveRibbon',
      value: 6,
      checked: false,
      colorOptions: false,
      cameraOptions: false,
      sampleGain: 1,
      smoothingConstant: 5,
      autoRotate: false,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .85,
      cradius: 1000
    },
    sampleGain: {
      group: '3DVisual',
      type: 'slider',
      label: 'Visual Effect Strength',
      value: 1,
      min: 1,
      max: 10,
      step: 1,
      visualCustom: true
    },
    smoothingConstant: {
      group: '3DVisual',
      type: 'slider',
      label: 'Smoothing Constant',
      value: 5,
      min: 1,
      max: 9.9,
      step: .1,
      visualCustom: true
    },
    autoRotate: {
      group: '3DVisual',
      type: 'checkbox',
      label: 'Auto Rotate',
      value: true,
      cameraCustom: true
    },

    customColors: {
      group: '3DVisual',
      type: 'checkbox',
      label: 'Custom Colors',
      value: true,
      visualCustom: true
    },
    minColor: {
      group: '3DVisual',
      type: 'color',
      label: 'Minimum Color',
      value: '#0000ff',
      visualCustom: true
    },
    midColor: {
      group: '3DVisual',
      type: 'color',
      label: 'Middle Color',
      value: '#000000',
      visualCustom: true
    },
    maxColor: {
      group: '3DVisual',
      type: 'color',
      label: 'Maximum Color',
      value: '#ff0000',
      visualCustom: true
    },
    midLoc: {
      group: '3DVisual',
      type: 'colorslider',
      label: 'Midpoint Value',
      value: 128,
      min: 20,
      max: 235,
      step: 5,
      visualCustom: true
    },

    // key highlight options
    currentNote: {
      group: 'Hidden',
      type: 'string',
      label: 'currentNote',
      value: 'None'
    },
    None: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'None',
      hertz: 0,
      value: 0,
      checked: true
    },
    C: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'C',
      hertz: 32.703,
      value: 33,
      checked: false
    },
    'C#': {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'C#',
      hertz: 34.648,
      value: 39,
      checked: false
    },
    D: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'D',
      hertz: 36.708,
      value: 45,
      checked: false
    },
    'D#': {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'D#',
      hertz: 38.891,
      value: 52,
      checked: false
    },
    E: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'E',
      hertz: 41.2035,
      value: 58,
      checked: false
    },
    F: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'F',
      hertz: 43.654,
      value: 65,
      checked: false
    },
    'F#': {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'F#',
      hertz: 46.249,
      value: 69,
      checked: false
    },
    G: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'G',
      hertz: 48.999,
      value: 73,
      checked: false
    },
    'G#': {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'G#',
      hertz: 51.913,
      value: 77,
      checked: false
    },
    A: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'A',
      hertz: 55,
      value: 82,
      checked: false
    },
    'A#': {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'A#',
      hertz: 58.270,
      value: 87,  /////////////
      checked: false
    },
    B: {
      group: 'KeyHighlight',
      type: 'numeric',
      label: 'B',
      hertz: 61.735,
      value: 92,
      checked: false
    },

  };

  options = JSON.parse(JSON.stringify(this.baseOptions));

  state = {
    showPanel: { value: false },
    showPlayer: { value: false },
    showSplash: { value: true },
    currentVisual: { value: 0 },
    windowHeight: { value: 0 },
    playerHeight: { value: 0 },
    pixelRatio: { value: 0 },
    playerTopHTML: { value: 0 },
    playerTopCanvas: { value: 0 },
    playlist: { value: [] },
    currentTrack: { value: 0 },
    playing: { value: false },
    microphone: { value: false },
    renderPlayer: { value: false },
    showTrackTitle: { value: true },
    input: { value: 'site' },

    volume: {
      group: 'Hidden',
      type: 'slider',
      label: 'Volume',
      min: 0,
      max: 10,
      step: 1,
      value: 5
    }
  };

  constructor(
    @Inject(MessageService) public messageService: MessageService,
    @Inject(StorageService) public storageService: StorageService,
  ) {
    console.log('Options Service Constructor');

    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(evt => {
      this.windowResize();
    });

    const lOptions = storageService.loadOptions();
    if (lOptions.version) {
      if (lOptions.version !== this.baseOptions.version) {
        storageService.deleteOptions();
        alert('Options have changed.  Clearing saved settings.');
      } else {
        // load user options
        for (const [key, value] of Object.entries(lOptions)) {
          if (key in this.baseOptions) {
            // console.log(`${key}: ${value}`);
            if (typeof value === 'object' && value !== null) {

              for (const [ikey, ivalue] of Object.entries(value)) {
                this.options[key][ikey] = ivalue;
              }

            } else {
              this.options[key] = value;
            }
          }
        }
        this.updateCustomOptions(this.state.currentVisual.value);
      }
    } else {
      console.log('local options error');
    }
  }

  toggleOption(itemName: string) {
    this.options[itemName].value = !this.options[itemName].value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
    this.storageService.saveOptions(this.options);
  }

  toggleState(itemName: string) {
    this.state[itemName].value = !this.state[itemName].value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.state[itemName].value);
    this.storageService.saveOptions(this.options);
  }

  toggleVisualRadio(itemName: string, index: number) {
    this.visuals.forEach(v => {
      this.options[v].checked = (itemName === v);
    });

    this.updateCustomOptions(index);
    this.storageService.saveOptions(this.options);
  }

  updateCustomOptions(visualIndex) {

    this.options.smoothingConstant.value =
      this.options[this.visuals[visualIndex]].smoothingConstant;

    this.options.sampleGain.value =
      this.options[this.visuals[visualIndex]].sampleGain;

    this.options.autoRotate.value =
      this.options[this.visuals[visualIndex]].autoRotate;

    this.options.customColors.value =
      this.options[this.visuals[visualIndex]].customColors;

    this.options.minColor.value =
      this.options[this.visuals[visualIndex]].minColor;

    this.options.midColor.value =
      this.options[this.visuals[visualIndex]].midColor;

    this.options.maxColor.value =
      this.options[this.visuals[visualIndex]].maxColor;

    this.options.midLoc.value =
      this.options[this.visuals[visualIndex]].midLoc;

    this.announceChange('smoothingConstant');
    this.announceChange('sampleGain');

  }

  toggleNoteRadio(itemName: string, index: number) {
    this.notes.forEach(n => {
      this.options[n].checked = (itemName === n);
    });
    this.storageService.saveOptions(this.options);
  }

  setOption(itemName: string, value) {
    this.options[itemName].value = value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
    this.storageService.saveOptions(this.options);
  }

  getOptions() {
    return this.options;
  }

  getOption(option) {
    return this.options[option].value;
  }

  updateState(itemName: string, value) {
    this.state[itemName].value = value;
    this.announceChange('State was changed: ' + itemName + ' to ' + this.state[itemName].value);
  }

  getState() {
    return this.state;
  }

  announceChange(message: string) {
    this.messageService.announceMessage(message);
  }

  windowResize() {
    const playerDiv = document.getElementById('playerDiv') as HTMLElement;
    if (playerDiv == null) {
      return;
    }

    this.updateState('windowHeight', window.outerHeight);
    this.updateState('playerHeight', playerDiv.clientHeight);
    this.updateState('pixelRatio', window.devicePixelRatio);
    this.updateState('playerTopHTML', playerDiv.offsetTop);
    this.updateState('playerTopCanvas', playerDiv.offsetTop * window.devicePixelRatio);
  }

  public getSelectedSPSCount() {
    let count = 0;
    for (let index = 0; index < this.SPSs.length; index++) {
      count += (this.options[this.SPSs[index]].value ? 1 : 0);
    }
    return count;
  }

  get showTitle(): boolean {
    return this.options.showTitle.value;
  }

  set showTitle(value: boolean) {
    this.options.showTitle.value = value;
    this.storageService.saveOptions(this.options);
  }

  get showWaveform() {
    return this.options.showWaveform.value;
  }

  set showWaveform(value) {
    this.options.showWaveform.value = value;
    this.storageService.saveOptions(this.options);
  }

  get waveformDelay(): number {
    return this.options.waveformDelay.value;
  }

  set waveformDelay(value: number) {
    this.options.waveformDelay.value = value;
    this.storageService.saveOptions(this.options);
  }

  get waveformMultiplier(): number {
    return this.options.waveformMultiplier.value;
  }

  set waveformMultiplier(value: number) {
    this.options.waveformMultiplier.value = value;
    this.storageService.saveOptions(this.options);
  }

  get showBars(): boolean {
    return this.options.showBars.value;
  }

  set showBars(value: boolean) {
    this.options.showBars.value = value;
    this.storageService.saveOptions(this.options);
  }

  get renderPlayer(): boolean {
    return this.state.renderPlayer.value;
  }

  set renderPlayer(value: boolean) {
    this.state.renderPlayer.value = value;
    this.storageService.saveOptions(this.options);
  }

  get showTrackTitle(): boolean {
    return this.state.showTrackTitle.value;
  }

  set showTrackTitle(value: boolean) {
    this.state.showTrackTitle.value = value;
    this.storageService.saveOptions(this.options);
  }

  get volume(): number {
    return this.state.volume.value;
  }

  set volume(value: number) {
    this.state.volume.value = value as number;
    this.storageService.saveOptions(this.options);
  }

  get sampleGain(): number {
    return this.options.sampleGain.value;
  }

  set sampleGain(value: number) {
    this.options.sampleGain.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].sampleGain = value;
    this.storageService.saveOptions(this.options);
  }

  get smoothingConstant(): number {
    return this.options.smoothingConstant.value;
  }

  set smoothingConstant(value: number) {
    this.options.smoothingConstant.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].smoothingConstant = value;
    this.storageService.saveOptions(this.options);
  }

  get singleSPSDelay(): number {
    return this.options.singleSPSDelay.value;
  }

  set singleSPSDelay(value: number) {
    this.options.singleSPSDelay.value = value;
    this.storageService.saveOptions(this.options);
  }


  get singleSPSExplosionSize(): number {
    return this.options.singleSPSExplosionSize.value;
  }

  set singleSPSExplosionSize(value: number) {
    this.options.singleSPSExplosionSize.value = value;
    this.storageService.saveOptions(this.options);
  }

  get blockPlane(): boolean {
    return this.options.blockPlane.value;
  }

  set blockPlane(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.blockPlane.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.blockPlane.value = !value;
      (document.getElementById('blockPlane') as HTMLInputElement).checked = true;
    }
  }

  get thing1(): boolean {
    return this.options.thing1.value;
  }

  set thing1(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.thing1.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.thing1.value = !value;
      (document.getElementById('thing1') as HTMLInputElement).checked = true;
    }
  }

  get blockSpiral(): boolean {
    return this.options.blockSpiral.value;
  }

  set blockSpiral(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.blockSpiral.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.blockSpiral.value = !value;
      (document.getElementById('blockSpiral') as HTMLInputElement).checked = true;
    }
  }

  get thing2(): boolean {
    return this.options.thing2.value;
  }

  set thing2(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.thing2.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.thing2.value = !value;
      (document.getElementById('thing2') as HTMLInputElement).checked = true;
    }
  }

  get equation(): boolean {
    return this.options.equation.value;
  }

  set equation(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.equation.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.equation.value = !value;
      (document.getElementById('equation') as HTMLInputElement).checked = true;
    }
  }


  get thing3(): boolean {
    return this.options.thing3.value;
  }

  set thing3(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.thing3.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.thing3.value = !value;
      (document.getElementById('thing3') as HTMLInputElement).checked = true;
    }
  }


  get cube(): boolean {
    return this.options.cube.value;
  }

  set cube(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.cube.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.cube.value = !value;
      (document.getElementById('cube') as HTMLInputElement).checked = true;
    }
  }

  get sphere(): boolean {
    return this.options.sphere.value;
  }

  set sphere(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.sphere.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.sphere.value = !value;
      (document.getElementById('sphere') as HTMLInputElement).checked = true;
    }
  }

  get pole(): boolean {
    return this.options.pole.value;
  }

  set pole(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.pole.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.pole.value = !value;
      (document.getElementById('pole') as HTMLInputElement).checked = true;
    }
  }

  get heart(): boolean {
    return this.options.heart.value;
  }

  set heart(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.heart.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.heart.value = !value;
      (document.getElementById('heart') as HTMLInputElement).checked = true;
    }
  }


  get sineLoop(): boolean {
    return this.options.sineLoop.value;
  }

  set sineLoop(value: boolean) {
    if ((!value && this.getSelectedSPSCount() > 1) || value) {
      this.options.sineLoop.value = value;
      this.announceChange('sps change');
      this.storageService.saveOptions(this.options);
    } else {
      this.options.sineLoop.value = !value;
      (document.getElementById('sineLoop') as HTMLInputElement).checked = true;
    }
  }







  get showPanel(): boolean {
    return this.state.showPanel.value;
  }

  // set showPanel(value: boolean) {
  //   this.state.showPanel.value = value;
  // }

  get showPlayer(): boolean {
    return this.state.showPlayer.value;
  }

  // set showPlayer(value: boolean) {
  //   this.state.showPlayer.value = value;
  // }

  get showSplash(): boolean {
    return this.state.showSplash.value;
  }

  // set showSplash(value: boolean) {
  //   this.state.showSplash.value = value;
  // }

  get currentVisual(): number {
    return this.state.currentVisual.value;
  }

  set currentVisual(value: number) {
    this.state.currentVisual.value = value;
    this.storageService.saveOptions(this.options);

  }

  // get blockPlaneManager(): boolean {
  //   return this.options.blockPlaneManager.checked;
  // }

  // set blockPlaneManager(value: boolean) {
  //   this.options.blockPlaneManager.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  // get blockSpiralManager(): boolean {
  //   return this.options.blockSpiralManager.checked;
  // }

  // set blockSpiralManager(value: boolean) {
  //   this.options.blockSpiralManager.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  // get spectrograph(): boolean {
  //   return this.options.spectrograph.checked;
  // }

  // set spectrograph(value: boolean) {
  //   this.options.spectrograph.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  // get equationManager(): boolean {
  //   return this.options.equationManager.checked;
  // }

  // set equationManager(value: boolean) {
  //   this.options.equationManager.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  // get cubeManager(): boolean {
  //   return this.options.cubeManager.checked;
  // }

  // set cubeManager(value: boolean) {
  //   this.options.cubeManager.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  // get starManager(): boolean {
  //   return this.options.starManager.checked;
  // }

  // set starManager(value: boolean) {
  //   this.options.starManager.checked = value;
  //   this.storageService.saveOptions(this.options);
  // }

  get customColors(): boolean {
    return this.options.customColors.value;
  }

  set customColors(value: boolean) {
    this.options.customColors.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].customColors = value;
    this.storageService.saveOptions(this.options);
  }

  get autoRotate(): boolean {
    return this.options.autoRotate.value;
  }

  set autoRotate(value: boolean) {
    this.options.autoRotate.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].autoRotate = value;
    this.storageService.saveOptions(this.options);
  }

  get minColor(): string {
    return this.options.minColor.value;
  }

  set minColor(value: string) {
    this.options.minColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].minColor = value;

    this.storageService.saveOptions(this.options);
  }


  get midColor(): string {
    return this.options.midColor.value;
  }

  set midColor(value: string) {
    this.options.midColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].midColor = value;
    this.storageService.saveOptions(this.options);
  }


  get maxColor(): string {
    return this.options.maxColor.value;
  }

  set maxColor(value: string) {
    this.options.maxColor.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].maxColor = value;
    this.storageService.saveOptions(this.options);
  }


  get midLoc(): number {
    return this.options.midLoc.value;
  }

  set midLoc(value: number) {
    this.options.midLoc.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].midLoc = value;
    this.storageService.saveOptions(this.options);
  }


  get currentTrack(): number {
    return this.state.currentTrack.value;
  }

  // set currentTrack(value: number) {
  //   this.state.currentTrack.value = value;
  //   this.storageService.saveOptions(this.options);
  // }

  get input(): string {
    return this.state.input.value;
  }

  set input(value: string) {
    this.state.input.value = value;
    this.storageService.saveOptions(this.options);
  }

  get playing(): boolean {
    return this.state.playing.value;
  }

  set playing(value: boolean) {
    this.state.playing.value = value;
    this.storageService.saveOptions(this.options);
  }

  get microphone(): boolean {
    return this.state.microphone.value;
  }

  set microphone(value: boolean) {
    this.state.microphone.value = value;
    this.storageService.saveOptions(this.options);
  }

}
