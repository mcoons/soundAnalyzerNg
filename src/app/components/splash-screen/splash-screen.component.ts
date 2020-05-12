
import { Component, Input } from '@angular/core';

import { OptionsService } from '../../services/options/options.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})

export class SplashScreenComponent {
  @Input('title') title: string;

  constructor(
    public optionsService: OptionsService
  ) { }

  splashScreenOK() {
    this.optionsService.toggleOption('showPlayer');
    this.optionsService.toggleOption('showBars');
    this.optionsService.toggleOption('showWaveform');
    this.optionsService.toggleOption('showSplash');
    setTimeout(() => {
      this.optionsService.toggleOption('showPanel');
      this.optionsService.toggleOption('renderPlayer'); 
    }, 5);
  }
}
