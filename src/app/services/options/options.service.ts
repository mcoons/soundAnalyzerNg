
import { Injectable } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { MessageService } from '../message/message.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  env = 'prod'; // dev or prod

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  colorTime = 0;
  colorTimeInc = .002;
  startingColorSet = 0;
  endingColorSet = 1;

  visuals = [
    'blockPlaneManager',
    'blockSpiralManager',
    'equationManager',
    'cubeManager',
    'starManager',
    'spectrograph',
    'spherePlaneManagerSPS',
    'rings',
    'hex',
    'waveRibbon'
  ];

  notes = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'None'
  ];

   options = {

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
    waveformDelay: {
      group: 'General',
      type: 'waveslider',
      label: 'Waveform Delay',
      value: 1,
      min: 1,
      max: 5,
      step: 1
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


    // visual options
    blockPlaneManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Block Plane',
      value: 0,
      checked: false,
      colorOptions: true,
      cameraOptions: false,
      sampleGain: 10,
      smoothingConstant: 5,
      animateCamera: false,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: 1.00,
      cradius: 1000
    },
    blockSpiralManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Block Spiral',
      value: 1,
      checked: false,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 10,
      smoothingConstant: 5,
      animateCamera: true,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: 1.00,
      cradius: 1000
    },
    equationManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Equation',
      value: 2,
      checked: true,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 10,
      smoothingConstant: 5,
      animateCamera: true,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 4.72,
      cbeta: .01,
      cradius: 1000
    },
    cubeManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Cube',
      value: 3,
      checked: false,
      colorOptions: false,
      cameraOptions: false,
      sampleGain: 10,
      smoothingConstant: 5,
      animateCamera: false,
      customColors: false,
      minColor: '#0000ff',
      midColor: '#00ff00',
      maxColor: '#ff0000',
      midLoc: 128,
      calpha: 1.57,
      cbeta: 1.57,
      cradius: 1000
    },
    starManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Stars',
      value: 4,
      checked: false,
      colorOptions: false,
      cameraOptions: false,
      sampleGain: 10,
      smoothingConstant: 5,
      animateCamera: false,
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
      value: 5,
      checked: false,
      colorOptions: false,
      cameraOptions: false,
      sampleGain: 10,
      smoothingConstant: 5,
      animateCamera: false,
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
      value: 6,
      checked: false,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 10,
      smoothingConstant: 5,
      animateCamera: true,
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
      value: 7,
      checked: false,
      colorOptions: true,
      cameraOptions: false,
      sampleGain: 10,
      smoothingConstant: 5,
      animateCamera: false,
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
      value: 8,
      checked: false,
      colorOptions: true,
      cameraOptions: true,
      sampleGain: 10,
      smoothingConstant: 5,
      animateCamera: true,
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
      value: 9,
      checked: false,
      colorOptions: false,
      cameraOptions: false,
      sampleGain: 10,
      smoothingConstant: 5,
      animateCamera: false,
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
      value: 10,
      min: 1,
      max: 20,
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

    animateCamera: {
      group: '3DVisual',
      type: 'checkbox',
      label: 'Animate Camera',
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

   state = {
    showPanel: { value: false },
    showPlayer: { value: false },
    showSplash: { value: true },
    currentVisual: { value: 2 },
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
    public messageService: MessageService,
    public storageService: StorageService,
    ) {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.windowResize();
    });

    const lOptions = storageService.loadOptions();
    if (lOptions.showTitle) {
      // console.log('found showtitle');
      // this.options = lOptions;

      for (const [key, value] of Object.entries(lOptions)) {
        console.log(`${key}: ${value}`);
        this.options[key] = value;
      }



      this.updateCustomOptions(this.state.currentVisual.value);
    } else {
      console.log('local options error');
    }

  }

  colors(yy) {
    let r;
    let g;
    let b;

    const midLoc = this.midLoc;

    const colorSets = [
      {
        r: 128 - yy / 2,
        g: yy,
        b: 200 - yy * 2
      },
      {
        r: yy,
        g: 128 - yy / 2,
        b: 200 - yy * 2
      },
      {
        r: 128 - yy / 2,
        g: 200 - yy * 2,
        b: yy
      },
      {
        r: 200 - yy * 2,
        g: yy,
        b: 128 - yy / 2
      },
      {
        r: yy,
        g: 200 - yy * 2,
        b: 128 - yy / 2
      },
      {
        r: 200 - yy * 2,
        g: 128 - yy / 2,
        b: yy
      },
      {
        r: 255 - (128 - yy / 2),
        g: 255 - yy,
        b: 255 - (200 - yy * 2)
      },
      {
        r: 255 - yy,
        g: 255 - (128 - yy / 2),
        b: 255 - (200 - yy * 2)
      },
      {
        r: 255 - (128 - yy / 2),
        g: 255 - (200 - yy * 2),
        b: 255 - yy
      },
      {
        r: 255 - (200 - yy * 2),
        g: 255 - yy,
        b: 255 - (128 - yy / 2)
      },
      {
        r: 255 - yy,
        g: 255 - (200 - yy * 2),
        b: 255 - (128 - yy / 2)
      },
      {
        r: 255 - (200 - yy * 2),
        g: 255 - (128 - yy / 2),
        b: 255 - yy
      }
    ];

    const getOptionColor = (name, c) => {
      const val = this.options[name].value;

      if (c === 'r') {
        return (val.substring(1, 3));
      }

      if (c === 'g') {
        return (val.substring(3, 5));
      }

      if (c === 'b') {
        return (val.substring(5));
      }

    };

    if (this.options.customColors.value === false) {
      r = colorSets[this.startingColorSet].r +
      (colorSets[this.endingColorSet].r - colorSets[this.startingColorSet].r) *
      this.colorTime;
      g = colorSets[this.startingColorSet].g +
      (colorSets[this.endingColorSet].g - colorSets[this.startingColorSet].g) *
      this.colorTime;
      b = colorSets[this.startingColorSet].b +
      (colorSets[this.endingColorSet].b - colorSets[this.startingColorSet].b) *
      this.colorTime;
    } else {

      if (yy <= midLoc) {
        r = parseInt(getOptionColor('minColor', 'r'), 16) +
            (parseInt(getOptionColor('midColor', 'r'), 16) -
             parseInt(getOptionColor('minColor', 'r'), 16)) *
            yy / midLoc;
        g = parseInt(getOptionColor('minColor', 'g'), 16) +
            (parseInt(getOptionColor('midColor', 'g'), 16) -
             parseInt(getOptionColor('minColor', 'g'), 16)) *
            yy / midLoc;
        b = parseInt(getOptionColor('minColor', 'b'), 16) +
            (parseInt(getOptionColor('midColor', 'b'), 16) -
             parseInt(getOptionColor('minColor', 'b'), 16)) *
            yy / midLoc;
     } else {
        r = parseInt(getOptionColor('midColor', 'r'), 16) +
            (parseInt(getOptionColor('maxColor', 'r'), 16) -
             parseInt(getOptionColor('midColor', 'r'), 16)) *
            (yy - midLoc) / (255 - midLoc);
        g = parseInt(getOptionColor('midColor', 'g'), 16) +
            (parseInt(getOptionColor('maxColor', 'g'), 16) -
             parseInt(getOptionColor('midColor', 'g'), 16)) *
            (yy - midLoc) / (255 - midLoc);
        b = parseInt(getOptionColor('midColor', 'b'), 16) +
            (parseInt(getOptionColor('maxColor', 'b'), 16) -
             parseInt(getOptionColor('midColor', 'b'), 16)) *
            (yy - midLoc) / (255 - midLoc);
     }
    }
    return { r, g, b };
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

    this.options.sampleGain.value =
    this.options[this.visuals[visualIndex]].sampleGain;

    this.options.smoothingConstant.value =
    this.options[this.visuals[visualIndex]].smoothingConstant;

    this.options.sampleGain.value =
    this.options[this.visuals[visualIndex]].sampleGain;

    this.options.animateCamera.value =
    this.options[this.visuals[visualIndex]].animateCamera;

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
    const playerDiv = document.getElementById('playerDIV') as HTMLElement;
    if (playerDiv == null) {
      return;
    }

    this.updateState('windowHeight', window.outerHeight);
    this.updateState('playerHeight', playerDiv.clientHeight);
    this.updateState('pixelRatio', window.devicePixelRatio);
    this.updateState('playerTopHTML', playerDiv.offsetTop);
    this.updateState('playerTopCanvas', playerDiv.offsetTop * window.devicePixelRatio);

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

  get showPanel(): boolean {
    return this.state.showPanel.value;
  }

  set showPanel(value: boolean) {
    this.state.showPanel.value = value;
  }

  get showPlayer(): boolean {
    return this.state.showPlayer.value;
  }

  set showPlayer(value: boolean) {
    this.state.showPlayer.value = value;
  }

  get showSplash(): boolean {
    return this.state.showSplash.value;
  }

  set showSplash(value: boolean) {
    this.state.showSplash.value = value;
  }

  get currentVisual(): number {
    return this.state.currentVisual.value;
  }

  set currentVisual(value: number) {
    this.state.currentVisual.value = value;
    this.storageService.saveOptions(this.options);
  }

  get blockPlaneManager(): boolean {
    return this.options.blockPlaneManager.checked;
  }

  set blockPlaneManager(value: boolean) {
    this.options.blockPlaneManager.checked = value;
    this.storageService.saveOptions(this.options);
  }

  get blockSpiralManager(): boolean {
    return this.options.blockSpiralManager.checked;
  }

  set blockSpiralManager(value: boolean) {
    this.options.blockSpiralManager.checked = value;
    this.storageService.saveOptions(this.options);
  }

  get spectrograph(): boolean {
    return this.options.spectrograph.checked;
  }

  set spectrograph(value: boolean) {
    this.options.spectrograph.checked = value;
    this.storageService.saveOptions(this.options);
  }

  get equationManager(): boolean {
    return this.options.equationManager.checked;
  }

  set equationManager(value: boolean) {
    this.options.equationManager.checked = value;
    this.storageService.saveOptions(this.options);
  }

  get cubeManager(): boolean {
    return this.options.cubeManager.checked;
  }

  set cubeManager(value: boolean) {
    this.options.cubeManager.checked = value;
    this.storageService.saveOptions(this.options);
  }

  get starManager(): boolean {
    return this.options.starManager.checked;
  }

  set starManager(value: boolean) {
    this.options.starManager.checked = value;
    this.storageService.saveOptions(this.options);
  }

  get customColors(): boolean {
    return this.options.customColors.value;
  }

  set customColors(value: boolean) {
    this.options.customColors.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].customColors = value;
    this.storageService.saveOptions(this.options);
  }

  get animateCamera(): boolean {
    return this.options.animateCamera.value;
  }

  set animateCamera(value: boolean) {
    this.options.animateCamera.value = value;
    this.options[this.visuals[this.state.currentVisual.value]].animateCamera = value;
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

  set currentTrack(value: number) {
    this.state.currentTrack.value = value;
    this.storageService.saveOptions(this.options);
  }

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
