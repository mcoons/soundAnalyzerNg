import { Component, OnInit } from '@angular/core';
import { OptionsService } from '../options.service';
// import { MatSliderModule } from '@angular/material/slider';


@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css']
})
export class OptionsPanelComponent implements OnInit {

  objectKeys = Object.keys;

  constructor(public optionsService: OptionsService) { }

  ngOnInit() {
    setTimeout(() => {
      this.optionsService.options["showPlayer"].value = false;
    }, 10);
    setTimeout(() => {
      this.optionsService.options["showPlayer"].value = true;
    }, 11);

  }

  toggleItem(e){
    console.log(e.target.name);
    this.optionsService.options[e.target.name].value = !this.optionsService.options[e.target.name].value;
  }


  
}
