
import { Injectable } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { MessageService } from '../message/message.service';
import { EngineService } from '../engine/engine.service';
import { InvokeFunctionExpr } from '@angular/compiler';

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
    // 'hills',
    'hex',
    'waveRibbon'
  ];

  notes = [
    'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'None'
  ];

  constructor(public messageService: MessageService) {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      this.windowResize();
    });
  }

  private options = {

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
    showWireframe: {
      group: 'Hidden',
      type: 'checkbox',
      label: 'Show Wireframe',
      value: false
    },
    // visual options
    blockPlaneManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Block Plane',
      value: 0,
      checked: false,
      colorOptions: true
    },
    blockSpiralManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Block Spiral',
      value: 1,
      checked: false,
      colorOptions: true
    },
    equationManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Equation',
      value: 2,
      checked: true,
      colorOptions: true
    },
    cubeManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Cube',
      value: 3,
      checked: false,
      colorOptions: false
    },
    starManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Stars',
      value: 4,
      checked: false,
      colorOptions: false
    },
    spectrograph: {
      group: '3DVisual',
      type: 'radio',
      label: 'Spectrograph',
      value: 5,
      checked: false,
      colorOptions: false
    },
    spherePlaneManagerSPS: {
      group: '3DVisual',
      type: 'radio',
      label: 'Sphere Plane',
      value: 6,
      checked: false,
      colorOptions: true
    },
    rings: {
      group: '3DVisual',
      type: 'radio',
      label: 'Rings',
      value: 7,
      checked: false,
      colorOptions: true
    },
    // hills: {
    //   group: '3DVisual',
    //   type: 'radio',
    //   label: 'Hills',
    //   value: 8,
    //   checked: false,
    //   colorOptions: true
    // },
    hex: {
      group: '3DVisual',
      type: 'radio',
      label: 'Hex',
      value: 8,
      checked: false,
      colorOptions: true
    },
    waveRibbon: {
      group: '3DVisual',
      type: 'radio',
      label: 'WaveRibbon',
      value: 9,
      checked: false,
      colorOptions: false
    },
    sampleGain: {
      group: '3DVisual',
      type: 'slider',
      label: 'Visual Effect Strength',
      value: 3,
      min: 1,
      max: 20,
      step: 1
    },
    smoothingConstant: {
      group: '3DVisual',
      type: 'slider',
      label: 'Smoothing Constant',
      value: 7,
      min: 1,
      max: 9.9,
      step: .1
    },
    randomizeColors: {
      group: '3DVisual',
      type: 'checkbox',
      label: 'Animate Colors',
      value: true,
    },
    minColor: {
      group: '3DVisual',
      type: 'color',
      label: 'Minimum Color',
      value: '#0000ff'
    },
    midColor: {
      group: '3DVisual',
      type: 'color',
      label: 'Middle Color',
      value: '#000000'
    },

    maxColor: {
      group: '3DVisual',
      type: 'color',
      label: 'Maximum Color',
      value: '#ff0000'
    },


    midLoc: {
      group: '3DVisual',
      type: 'colorslider',
      label: 'Midpoint Value',
      value: 128,
      min: 20,
      max: 235,
      step: 5
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
      value: 39,  ///////////////
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
      value: 52,  //////////////
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
      value: 69,  ///////////////
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
      value: 77,  ///////////////
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




    // move to state ?????
    showPanel: {
      group: 'Hidden',
      type: 'checkbox',
      label: 'Show Panel',
      value: false
    },
    showPlayer: {
      group: 'Hidden',
      type: 'checkbox',
      label: 'Show Player',
      value: false
    },
    showSplash: {
      group: 'Hidden',
      type: 'checkbox',
      label: 'Show Splash',
      value: true
    },
    currentVisual: {
      group: 'Hidden',
      type: 'numeric',
      label: 'Current Scene',
      value: 2
    }

  };

  private state = {
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
      value: 7
    }
  };

  colors(yy) {
    let r;
    let g;
    let b;

    let midLoc = this.midLoc;

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

      // return val;
    };

    if (this.options.randomizeColors.value === true) {
      // tslint:disable-next-line: max-line-length
      r = colorSets[this.startingColorSet].r + (colorSets[this.endingColorSet].r - colorSets[this.startingColorSet].r) * this.colorTime;
      // tslint:disable-next-line: max-line-length
      g = colorSets[this.startingColorSet].g + (colorSets[this.endingColorSet].g - colorSets[this.startingColorSet].g) * this.colorTime;
      // tslint:disable-next-line: max-line-length
      b = colorSets[this.startingColorSet].b + (colorSets[this.endingColorSet].b - colorSets[this.startingColorSet].b) * this.colorTime;
    } else {

      if (yy <= midLoc) {
        // tslint:disable-next-line: max-line-length
        r = parseInt(getOptionColor('minColor', 'r'), 16) + (parseInt(getOptionColor('midColor', 'r'), 16) - parseInt(getOptionColor('minColor', 'r'), 16)) * yy / midLoc;
        // tslint:disable-next-line: max-line-length
        g = parseInt(getOptionColor('minColor', 'g'), 16) + (parseInt(getOptionColor('midColor', 'g'), 16) - parseInt(getOptionColor('minColor', 'g'), 16)) * yy / midLoc;
        // tslint:disable-next-line: max-line-length
        b = parseInt(getOptionColor('minColor', 'b'), 16) + (parseInt(getOptionColor('midColor', 'b'), 16) - parseInt(getOptionColor('minColor', 'b'), 16)) * yy / midLoc;
        // console.log('test');
        // console.log(parseInt( getOptionColor('minColor', 'g'), 16));
      } else {
        // tslint:disable-next-line: max-line-length
        r = parseInt(getOptionColor('midColor', 'r'), 16) + (parseInt(getOptionColor('maxColor', 'r'), 16) - parseInt(getOptionColor('midColor', 'r'), 16)) * (yy - midLoc) / (255 - midLoc);
        // tslint:disable-next-line: max-line-length
        g = parseInt(getOptionColor('midColor', 'g'), 16) + (parseInt(getOptionColor('maxColor', 'g'), 16) - parseInt(getOptionColor('midColor', 'g'), 16)) * (yy - midLoc) / (255 - midLoc);
        // tslint:disable-next-line: max-line-length
        b = parseInt(getOptionColor('midColor', 'b'), 16) + (parseInt(getOptionColor('maxColor', 'b'), 16) - parseInt(getOptionColor('midColor', 'b'), 16)) * (yy - midLoc) / (255 - midLoc);
        // console.log('test');
        // console.log(parseInt( getOptionColor('minColor', 'g'), 16));
      }
    }
    return { r, g, b };
  }

  toggleOption(itemName: string) {
    this.options[itemName].value = !this.options[itemName].value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
  }

  toggleState(itemName: string) {
    this.state[itemName].value = !this.state[itemName].value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.state[itemName].value);
  }

  toggleVisualRadio(itemName: string, index: number) {
    this.visuals.forEach(v => {
      this.options[v].checked = (itemName === v);
    });
  }

  toggleNoteRadio(itemName: string, index: number) {
    this.notes.forEach(n => {
      this.options[n].checked = (itemName === n);
    });
  }

  setOption(itemName: string, value) {
    this.options[itemName].value = value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
  }

  getOptions() {
    return this.options;
  }

  getOption(option) {
    return this.options[option].value;
  }

  updateState(itemName: string, value) {
    this.state[itemName].value = value;
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
  }

  get showWaveform() {
    return this.options.showWaveform.value;
  }

  set showWaveform(value) {
    this.options.showWaveform.value = value;
  }

  get waveformDelay(): number {
    return this.options.waveformDelay.value;
  }

  set waveformDelay(value: number) {
    this.options.waveformDelay.value = value;
  }

  get waveformMultiplier(): number {
    return this.options.waveformMultiplier.value;
  }

  set waveformMultiplier(value: number) {
    this.options.waveformMultiplier.value = value;
  }

  get showBars(): boolean {
    return this.options.showBars.value;
  }

  set showBars(value: boolean) {
    this.options.showBars.value = value;
  }

  get showWireframe() {
    return this.options.showWireframe.value;
  }

  set showWireframe(value) {
    this.options.showWireframe.value = value;
  }

  get renderPlayer(): boolean {
    return this.state.renderPlayer.value;
  }

  set renderPlayer(value: boolean) {
    this.state.renderPlayer.value = value;
  }

  get showTrackTitle(): boolean {
    return this.state.showTrackTitle.value;
  }

  set showTrackTitle(value: boolean) {
    this.state.showTrackTitle.value = value;
  }

  get volume(): number {
    return this.state.volume.value;
  }

  set volume(value: number) {
    this.state.volume.value = value as number;
  }

  get sampleGain(): number {
    return this.options.sampleGain.value;
  }

  set sampleGain(value: number) {
    this.options.sampleGain.value = value;
  }

  get smoothingConstant(): number {
    return this.options.smoothingConstant.value;
  }

  set smoothingConstant(value: number) {
    this.options.smoothingConstant.value = value;
  }

  get showPanel(): boolean {
    return this.options.showPanel.value;
  }

  set showPanel(value: boolean) {
    this.options.showPanel.value = value;
  }

  get showPlayer(): boolean {
    return this.options.showPlayer.value;
  }

  set showPlayer(value: boolean) {
    this.options.showPlayer.value = value;
  }

  get showSplash(): boolean {
    return this.options.showSplash.value;
  }

  set showSplash(value: boolean) {
    this.options.showSplash.value = value;
  }

  get currentVisual(): number {
    return this.options.currentVisual.value;
  }

  set currentVisual(value: number) {
    this.options.currentVisual.value = value;
  }

  get blockPlaneManager(): boolean {
    return this.options.blockPlaneManager.checked;
  }

  set blockPlaneManager(value: boolean) {
    this.options.blockPlaneManager.checked = value;
  }

  get blockSpiralManager(): boolean {
    return this.options.blockSpiralManager.checked;
  }

  set blockSpiralManager(value: boolean) {
    this.options.blockSpiralManager.checked = value;
  }

  get spectrograph(): boolean {
    return this.options.spectrograph.checked;
  }

  set spectrograph(value: boolean) {
    this.options.spectrograph.checked = value;
  }

  get equationManager(): boolean {
    return this.options.equationManager.checked;
  }

  set equationManager(value: boolean) {
    this.options.equationManager.checked = value;
  }

  get cubeManager(): boolean {
    return this.options.cubeManager.checked;
  }

  set cubeManager(value: boolean) {
    this.options.cubeManager.checked = value;
  }

  get starManager(): boolean {
    return this.options.starManager.checked;
  }

  set starManager(value: boolean) {
    this.options.starManager.checked = value;
  }

  get randomizeColors(): boolean {
    return this.options.randomizeColors.value;
  }

  set randomizeColors(value: boolean) {
    this.options.randomizeColors.value = value;
  }

  get minColor(): string {
    return this.options.minColor.value;
  }

  set minColor(value: string) {
    this.options.minColor.value = value;
  }


  get midColor(): string {
    return this.options.midColor.value;
  }

  set midColor(value: string) {
    this.options.midColor.value = value;
  }


  get maxColor(): string {
    return this.options.maxColor.value;
  }

  set maxColor(value: string) {
    this.options.maxColor.value = value;
  }


  get midLoc(): number {
    return this.options.midLoc.value;
  }

  set midLoc(value: number) {
    this.options.midLoc.value = value;
  }


  get currentTrack(): number {
    return this.state.currentTrack.value;
  }

  set currentTrack(value: number) {
    this.state.currentTrack.value = value;
  }

  get input(): string {
    return this.state.input.value;
  }

  set input(value: string) {
    this.state.input.value = value;
  }

  get playing(): boolean {
    return this.state.playing.value;
  }

  set playing(value: boolean) {
    this.state.playing.value = value;
  }

  get microphone(): boolean {
    return this.state.microphone.value;
  }

  set microphone(value: boolean) {
    this.state.microphone.value = value;
  }

}
