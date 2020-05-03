
import { Component, OnInit, Input } from '@angular/core';

import { OptionsService } from '../options.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.css']
})

export class SplashScreenComponent implements OnInit {
  @Input('title') title: string;

  constructor(
    public optionsService: OptionsService,
    public messageService: MessageService
  ) { }

  ngOnInit() {}

  splashScreenOK() {
    this.optionsService.toggleOption('showPlayer');
    this.optionsService.toggleOption('showBars');
    this.optionsService.toggleOption('showWaveform');
    this.optionsService.toggleOption('showPanel');
    this.optionsService.toggleOption('showSplash');
  }
}
