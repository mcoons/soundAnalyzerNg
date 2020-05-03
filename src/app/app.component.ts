
import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { OptionsService } from './options.service';
import { MessageService } from './message.service';

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
        marginRight: '-260px'
      })),
      transition('panelOpen => panelClosed', [
        animate('.2s')
      ]),
      transition('panelClosed => panelOpen', [
        animate('.2s')
      ])
    ]),

    trigger('splashOpenClose', [
      state('splashOpen', style({
        opacity: 1
      })),
      state('splashClosed', style({
        opacity: 0
      })),
      transition('splashOpen => splashClosed', [
        animate('1s')
      ]),
      transition('splashClosed => splashOpen', [
        animate('1s')
      ])
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
        // console.log('Audio Player: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
      });
  }

  ngOnInit() {
  }

  togglePanel() {
    this.optionsService.toggleOption('showPanel');
  }

}
