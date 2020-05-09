
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

  options = {
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
      value: 3,
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
      label: 'Show Full Player',
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
      group: 'General',
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
      value: 7,
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
    cubeManager: {
      showInConsole: true,
      group: '3DVisual',
      type: 'radio',
      label: 'Cube',
      value: 2,
      checked: false
    },
    equationManager: {
      showInConsole: true,
      group: '3DVisual',
      type: 'radio',
      label: 'Equation',
      value: 3,
      checked: true
    },









    showConsole: {
      showInConsole: false,
      group: 'Developer',
      type: 'checkbox',
      label: 'Show Console',
      value: false
    },
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
      value: 3
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

  updateOption(itemName: string, value) {
    this.options[itemName].value = value;
    this.windowResize();
    this.announceChange('Item was changed: ' + itemName + ' to ' + this.options[itemName].value);
  }

  getOptions() {
    return this.options;
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

}
