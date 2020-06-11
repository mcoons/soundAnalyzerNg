import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }


  loadOptions() {

    const retrievedOptions = localStorage.getItem('options');
    if (retrievedOptions) {
      return JSON.parse(retrievedOptions);
    } else {
      return {error: 'local storage error'};
    }


    // let restLength;
    // let muted;
    // let state;

    // const sRestLength = localStorage.getItem('restlength');
    // if (sRestLength) { restLength = Number(sRestLength); }

    // const sMuted = localStorage.getItem('muted');
    // if (sMuted) { muted = sMuted === 'true' ? true : false; }

    // const sState = localStorage.getItem('state');
    // if (sState) { state = JSON.parse(sState); }

  }

  saveOptions(options) {

    localStorage.setItem('options', JSON.stringify(options));


    // const restLength = '';
    // const muted = '';
    // const state = {a: 1, b: 2};

    // localStorage.setItem('restlength', restLength);
    // localStorage.setItem('muted', muted);
    // localStorage.setItem('state', JSON.stringify(state));
  }

}
