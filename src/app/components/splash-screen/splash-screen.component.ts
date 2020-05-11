
import { Component,
  // OnInit,
  Input } from '@angular/core';

import { OptionsService } from '../../services/options/options.service';
// import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})

export class SplashScreenComponent {
  @Input('title') title: string;

  constructor(
    public optionsService: OptionsService
    // ,
    // public messageService: MessageService
  ) { }

  // ngOnInit() {}

  splashScreenOK() {
    this.optionsService.toggleOption('showPlayer');
    this.optionsService.toggleOption('showBars');
    this.optionsService.toggleOption('showWaveform');
    this.optionsService.toggleOption('showPanel');
    this.optionsService.toggleOption('showSplash');
    setTimeout(() => {this.optionsService.toggleOption('renderPlayer'); }, 5);
    // this.optionsService.toggleOption('renderPlayer');
  }
}
