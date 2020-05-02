import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  env = 'dev'; // dev or prod

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


    showBars: {
      showInConsole: false,
      group: 'Visual',
      type: 'checkbox',
      label: 'Show Bars',
      value: false
    },
    showWaveform: {
      showInConsole: false,
      group: 'Visual',
      type: 'checkbox',
      label: 'Show Waveform',
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
      showInConsole: false,
      group: 'Developer',
      type: 'checkbox',
      label: 'Show Console',
      value: true
    },
    showPanel: {
      showInConsole: false,
      group: 'Developer',
      type: 'checkbox',
      label: 'Show Panel',
      value: false
    },
    showPlayer: {
      showInConsole: false,
      group: 'Developer',
      type: 'checkbox',
      label: 'Show Player',
      value: false
    },
    showSplash: {
      showInConsole: false,
      group: 'Developer',
      type: 'checkbox',
      label: 'Show Splash',
      value: true
    },

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
    playerTop: {
      showInConsole: true,
      group: 'Console',
      type: 'numeric',
      label: 'Player Top',
      value: 0
    },




  };

  constructor() {
  }

  toggleOption(itemName: string) {
    this.options[itemName].value = !this.options[itemName].value;
  }

  updateOption(itemName: string, value) {
    this.options[itemName].value = value;
  }

  getOptions() {
    return this.options;
  }

}
