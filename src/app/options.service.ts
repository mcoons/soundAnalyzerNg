
import { Injectable } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  env = 'dev'; // dev or prod

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  options = {
    showTitle: {
      showInConsole: false,
      group: 'General',
      type: 'checkbox',
      label: 'Show Title',
      value: true
    },

    renderPlayer: {
      showInConsole: false,
      group: 'Player',
      type: 'checkbox',
      label: 'Show Player',
      value: true
    },
    showTrackTitle: {
      showInConsole: false,
      group: 'Player',
      type: 'checkbox',
      label: 'Show Track Title',
      value: false
    },
    volume: {
      showInConsole: false,
      group: 'Player',
      type: 'slider',
      label: 'Volume',
      value: 7,
      min: 0,
      max: 10
    },

    showWaveform: {
      showInConsole: false,
      group: 'Visual',
      type: 'checkbox',
      label: 'Show Waveform',
      value: false
    },
    showBars: {
      showInConsole: false,
      group: 'Visual',
      type: 'checkbox',
      label: 'Show Bars',
      value: false
    },
    sampleGain: {
      showInConsole: false,
      group: 'Visual',
      type: 'slider',
      label: 'Sample Gain',
      value: 1,
      min: 1,
      max: 20
    },

    showConsole: {
      showInConsole: true,
      group: 'Developer',
      type: 'checkbox',
      label: 'Show Console',
      value: true
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
