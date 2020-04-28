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
    renderPlayer: {
      group: "General",
      type: "checkbox",
      label: "Render Player",
      value: true
    },
    volume: {
      group: "General",
      type: "slider",
      label: "Volume",
      value: 7
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

  toggleOption(itemName: string){
    this.options[itemName].value = !this.options[itemName].value;
  }

  updateOption(itemName: string, value){
    this.options[itemName].value = value;
  }

  getOptions(){
    return this.options;
  }

}
