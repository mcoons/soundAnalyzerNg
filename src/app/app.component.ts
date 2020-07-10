
import { Component, Inject } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { OptionsService } from './services/options/options.service';

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
        marginRight: '-260px',
      })),
      transition('panelOpen => panelClosed', [
        animate('.75s')
      ]),
      transition('panelClosed => panelOpen', [
        animate('.75s')
      ])
    ]),

    trigger('splashOpenClose', [
      state('splashOpen', style({
        opacity: 1,
        zIndex: 500
      })),
      state('splashClosed', style({
        opacity: 0,
        zIndex: -500
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

export class AppComponent {
  private _title = 'MP3 Visualyzer Ng';

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService
  ) { }

  get title() {
    return this._title;
  }

  togglePanel() {
    this.optionsService.toggleState('showPanel');
  }

}
