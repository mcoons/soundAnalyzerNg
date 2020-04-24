import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  optionsBool = {
    showTitle:  {
      label: "Show Title",
      value: true
    },
    showConsole: {
      label: "Show Console",
      value: true
    },
    showPlayer: {
      label: "Show Player",
      value: true
    }
  }

  constructor() { 
  }

}
