
import { Injectable } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { MessageService } from '../message/message.service';
import { EngineService } from '../engine/engine.service';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  env = 'prod'; // dev or prod

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  private options = {
    showTitle: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Title',
      value: true,
    },
    showWaveform: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Waveform',
      value: false
    },
    waveformDelay: {
      group: 'General',
      type: 'slider',
      label: 'Waveform Delay',
      value: 1,
      min: 1,
      max: 5,
      step: 1
    },
    waveformMultiplier: {
      group: 'General',
      type: 'slider',
      label: 'Waveform Multiplier',
      value: 1,
      min: 1,
      max: 10,
      step: .1
    },
    showBars: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Eq Bars',
      value: false
    },
    renderPlayer: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Main Player',
      value: false
    },
    showTrackTitle: {
      group: 'Hidden',
      type: 'checkbox',
      label: 'Show Track Title',
      value: true
    },
    volume: {
      group: 'Hidden',
      type: 'slider',
      label: 'Volume',
      value: 7,
      min: 0,
      max: 10,
      step: 1
    },




    blockPlaneManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Block Plane',
      value: 0,
      checked: false
    },
    blockSpiralManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Block Spiral',
      value: 1,
      checked: false
    },
    equationManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Equation',
      value: 2,
      checked: true
    },
    cubeManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Cube',
      value: 3,
      checked: false
    },
    starManager: {
      group: '3DVisual',
      type: 'radio',
      label: 'Stars',
      value: 4,
      checked: false
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
      value: 9,
      min: 1,
      max: 9.9,
      step: .1
    },


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
    windowHeight: {
      group: 'Console',
      type: 'numeric',
      label: 'Window Height',
      value: 0
    },
    playerHeight: {
      group: 'Console',
      type: 'numeric',
      label: 'Player Height',
      value: 0
    },
    pixelRatio: {
      group: 'Console',
      type: 'numeric',
      label: 'Pixel Ratio',
      value: 0
    },
    playerTopHTML: {
      group: 'Console',
      type: 'numeric',
      label: 'Player Top HTML',
      value: 0
    },
    playerTopCanvas: {
      group: 'Console',
      type: 'numeric',
      label: 'Player Top Canvas',
      value: 0
    },
    playlist: {
      group: 'Console',
      type: 'list',
      label: 'Playlist',
      value: []
    },
    currentTrack: {
      group: 'Console',
      type: 'numeric',
      label: 'Current Index',
      value: 0
    },
    playing: {
      group: 'Console',
      type: 'boolean',
      label: 'Playing',
      value: false
    },
    microphone: {
      group: 'Console',
      type: 'boolean',
      label: 'Microphone',
      value: false
    }
  };

  constructor(public messageService: MessageService) {
    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      // console.log('event: ', evt);
      this.windowResize();
    });
  }

  toggleOption(itemName: string) {
    this.options[itemName].value = !this.options[itemName].value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
  }

  toggleVisualRadio(itemName: string, index: number) {
    this.options.blockPlaneManager.checked = (itemName === 'blockPlaneManager');
    this.options.blockSpiralManager.checked = (itemName === 'blockSpiralManager');
    this.options.cubeManager.checked = (itemName === 'cubeManager');
    this.options.equationManager.checked = (itemName === 'equationManager');

    // this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
    // this.engServ.selectScene(index);
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

  get renderPlayer(): boolean {
    return this.options.renderPlayer.value;
  }

  set renderPlayer(value: boolean) {
    this.options.renderPlayer.value = value;
  }

  get showTrackTitle(): boolean {
    return this.options.showTrackTitle.value;
  }

  set showTrackTitle(value: boolean) {
    this.options.showTrackTitle.value = value;
  }

  get volume(): number {
    return this.options.volume.value;
  }

  set volume(value: number) {
    this.options.volume.value = value as number;
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

  get currentTrack(): number {
    return this.state.currentTrack.value;
  }

  set currentTrack(value: number) {
    this.state.currentTrack.value = value;
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
