
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
      showInConsole: false,
      group: 'General',
      type: 'checkbox',
      label: 'Show Title',
      value: true,
      tooltip: 'Show or hide the Analyzer title'
    },
    showWaveform: {
      showInConsole: false,
      group: 'General',
      type: 'checkbox',
      label: 'Show Waveform',
      value: false
    },
    waveformDelay: {
      showInConsole: false,
      group: 'General',
      type: 'slider',
      label: 'Waveform Delay',
      value: 1,
      min: 1,
      max: 5
    },
    showBars: {
      showInConsole: false,
      group: 'General',
      type: 'checkbox',
      label: 'Show Eq Bars',
      value: false
    },
    renderPlayer: {
      showInConsole: false,
      group: 'General',
      type: 'checkbox',
      label: 'Show Main Player',
      value: false
    },
    showTrackTitle: {
      showInConsole: false,
      group: 'Hidden',
      type: 'checkbox',
      label: 'Show Track Title',
      value: true
    },
    volume: {
      showInConsole: false,
      group: 'Hidden',
      type: 'slider',
      label: 'Volume',
      value: 7,
      min: 0,
      max: 10
    },


    sampleGain: {
      showInConsole: false,
      group: '3DVisual',
      type: 'slider',
      label: 'Visual Effect Strength',
      value: 3,
      min: 1,
      max: 20
    },



    blockPlaneManager: {
      showInConsole: true,
      group: '3DVisual',
      type: 'radio',
      label: 'Block Plane',
      value: 0,
      checked: false
    },
    blockSpiralManager: {
      showInConsole: true,
      group: '3DVisual',
      type: 'radio',
      label: 'Block Spiral',
      value: 1,
      checked: false
    },
    equationManager: {
      showInConsole: true,
      group: '3DVisual',
      type: 'radio',
      label: 'Equation',
      value: 2,
      checked: true
    },
    cubeManager: {
      showInConsole: true,
      group: '3DVisual',
      type: 'radio',
      label: 'Cube',
      value: 3,
      checked: false
    },
    starManager: {
      showInConsole: true,
      group: '3DVisual',
      type: 'radio',
      label: 'Stars',
      value: 4,
      checked: false
    },









    // showConsole: {
    //   showInConsole: false,
    //   group: 'Developer',
    //   type: 'checkbox',
    //   label: 'Show Console',
    //   value: false
    // },

    showPanel: {
      showInConsole: false,
      group: 'Hidden',
      type: 'checkbox',
      label: 'Show Panel',
      value: false
    },
    showPlayer: {
      showInConsole: false,
      group: 'Hidden',
      type: 'checkbox',
      label: 'Show Player',
      value: false
    },
    showSplash: {
      showInConsole: false,
      group: 'Hidden',
      type: 'checkbox',
      label: 'Show Splash',
      value: true
    },
    currentScene: {
      showInConsole: false,
      group: 'Hidden',
      type: 'numeric',
      label: 'Current Scene',
      value: 2
    }

  };

  state = {
    windowHeight: {
      showInConsole: true,
      group: 'Console',
      type: 'numeric',
      label: 'Window Height',
      value: 0
    },
    playerHeight: {
      showInConsole: true,
      group: 'Console',
      type: 'numeric',
      label: 'Player Height',
      value: 0
    },
    pixelRatio: {
      showInConsole: true,
      group: 'Console',
      type: 'numeric',
      label: 'Pixel Ratio',
      value: 0
    },
    playerTopHTML: {
      showInConsole: true,
      group: 'Console',
      type: 'numeric',
      label: 'Player Top HTML',
      value: 0
    },
    playerTopCanvas: {
      showInConsole: true,
      group: 'Console',
      type: 'numeric',
      label: 'Player Top Canvas',
      value: 0
    },
    playlist: {
      showInConsole: false,
      group: 'Console',
      type: 'list',
      label: 'Playlist',
      value: []
    },
    currentTrack: {
      showInConsole: false,
      group: 'Console',
      type: 'numeric',
      label: 'Current Index',
      value: 0
    },
    playing: {
      showInConsole: false,
      group: 'Console',
      type: 'boolean',
      label: 'Playing',
      value: false
    },
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

    this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
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

  get currentScene(): number {
    return this.options.currentScene.value;
  }

  set currentScene(value: number) {
    this.options.currentScene.value = value;
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


}
