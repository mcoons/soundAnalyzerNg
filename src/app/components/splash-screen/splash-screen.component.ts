
import { Component, Input, Inject } from '@angular/core';

import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})

export class SplashScreenComponent {
  // tslint:disable-next-line: no-input-rename
  @Input('title') title: string;

  constructor(
    @Inject(OptionsService) private optionsService: OptionsService,
    public messageService: MessageService
  ) { }

  splashScreenOK() {
    // this.optionsService.toggleOption('showPlayer');
    // this.optionsService.toggleOption('showSplash');
    this.optionsService.toggleState('showPlayer');
    this.optionsService.toggleState('showSplash');
    this.optionsService.currentVisual = 4;
    this.optionsService.toggleVisualRadio('singleSPS', 4);

    this.messageService.announceMessage('scene change');

    setTimeout(() => {
      this.optionsService.toggleState('showPanel');
      this.optionsService.toggleState('renderPlayer');
    }, 5);
  }
}
