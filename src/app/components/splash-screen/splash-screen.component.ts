
import { Component, Input } from '@angular/core';

import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})

export class SplashScreenComponent {
  @Input('title') title: string;

  constructor(
    public optionsService: OptionsService,
    public messageService: MessageService
  ) { }

  splashScreenOK() {
    this.optionsService.toggleOption('showPlayer');
    this.optionsService.toggleOption('showBars');
    this.optionsService.toggleOption('showWaveform');
    this.optionsService.toggleOption('showSplash');
    this.optionsService.currentVisual = 0;
    this.optionsService.toggleVisualRadio('equationManager', 2);
    this.optionsService.toggleVisualRadio('blockPlaneManager', 0);

    this.messageService.announceMessage('scene change');

    setTimeout(() => {
      this.optionsService.toggleOption('showPanel');
      this.optionsService.toggleState('renderPlayer');
    }, 5);
  }
}
