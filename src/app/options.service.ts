import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  env = 'dev'; // dev or prod

  options = {
    showTitle: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Title',
      value: true
    },
    renderPlayer: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Player',
      value: true
    },
    showBars: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Bars',
      value: false
    },
    showWaveform: {
      group: 'General',
      type: 'checkbox',
      label: 'Show Waveform',
      value: false
    },
    volume: {
      group: 'General',
      type: 'slider',
      label: 'Volume',
      value: 7,
      min: 0,
      max: 10
    },
    sampleGain: {
      group: 'General',
      type: 'slider',
      label: 'Sample Gain',
      value: 1,
      min: 1,
      max: 20
    },
    showConsole: {
      group: 'Developer',
      type: 'checkbox',
      label: 'Show Console',
      value: true
    },
    showPanel: {
      group: 'Developer',
      type: 'checkbox',
      label: 'Show Panel',
      value: false
    },
    showPlayer: {
      group: 'Developer',
      type: 'checkbox',
      label: 'Show Player',
      value: false
    },
    showSplash: {
      group: 'Developer',
      type: 'checkbox',
      label: 'Show Splash',
      value: true
    }
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
