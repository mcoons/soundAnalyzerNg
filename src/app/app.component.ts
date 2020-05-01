import { Component, OnInit } from '@angular/core';

import { OptionsService } from './options.service';
import { MessageService } from './message.service';


import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('panelOpenClose', [
      state('panelOpen', style({
        marginRight: '0px'
      })),
      state('panelClosed', style({
        marginRight: '-200px'
      })),
      transition('panelOpen => panelClosed', [
        animate('.2s')
      ]),
      transition('panelClosed => panelOpen', [
        animate('.2s')
      ]),
    ])

  ]
})

export class AppComponent implements OnInit {
  title = 'Music Visualyzer Ng';

  options;

  constructor(public optionsService: OptionsService, public messageService: MessageService) {
    this.options = this.optionsService.getOptions();

    messageService.messageAnnounced$.subscribe(
      message => {
        console.log('Audio Player: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
      });

  }

  ngOnInit() {
  }

  togglePanel() {

    this.optionsService.toggleOption('showPanel');

  }

}
