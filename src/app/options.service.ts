import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OptionsService {

  env: string = "dev"; // dev or prod

  options = {
    showTitle:  {
      group: "General",
      type: "checkbox",
      label: "Show Title",
      value: true
    },
    showConsole: {
      group: "Developer",
      type: "checkbox",
      label: "Show Console",
      value: true
    },
    showPlayer: {
      group: "Developer",
      type: "checkbox",
      label: "Show Player",
      value: true
    }
  }

  constructor() { 
  }

  toggle(itemName: string){
    this.options[itemName].value = !this.options[itemName].value;
  }

}
