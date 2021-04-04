
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, animate, transition, AnimationEvent } from '@angular/animations';
import { ActivatedRoute, Params} from '@angular/router';

import { OptionsService } from './services/options/options.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('optionsPanelOpenClose', [
      state('optionsPanelOpen', style({
        marginRight: '0px'
      })),
      state('optionsPanelClosed', style({
        marginRight: '-270px',
      })),
      transition('optionsPanelOpen => optionsPanelClosed', [
        animate('.75s')
      ]),
      transition('optionsPanelClosed => optionsPanelOpen', [
        animate('.75s')
      ])
    ]),

    trigger('favoritesPanelOpenClose', [
      state('favoritesPanelOpen', style({
        marginLeft: '0px'
      })),
      state('favoritesPanelClosed', style({
        marginLeft: '-270px',
      })),
      transition('favoritesPanelOpen => favoritesPanelClosed', [
        animate('.75s')
      ]),
      transition('favoritesPanelClosed => favoritesPanelOpen', [
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

export class AppComponent implements OnInit, OnDestroy {
  private _title = 'MP3 Visualyzer Ng';
  private _isIframe = false;

  public dest;
  public sub;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(ActivatedRoute) private _ActivatedRoute: ActivatedRoute,
  ) { 
    window.addEventListener('message', this.acknowledge);
  }

  acknowledge(event): void{
    if (typeof(event.data) !== 'undefined'){
      console.log('message received in player' + event.data);
      console.log(event.data);
         // handle message
      }
  }

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params: Params) => {
      if (!(Object.keys(params).length === 0 && params.constructor === Object)) {
        if (params['fromIframe'] === 'true')
        {
          this._isIframe = true;
        }
        console.log('from Iframe:');
        console.log(this.isIframe);
      }
    });


  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.acknowledge);
  }

  get title(): string {
    return this._title;
  }

  get isIframe(): boolean {
    return this._isIframe;
  }

  togglePanel(): void {
    this.optionsService.toggleState('showPanel');
    if (this.optionsService.showFavorites && this.optionsService.showPanel) {
      console.log('need to close Favorites');
      this.optionsService.toggleState('showFavorites');

    }
  }


  toggleFavorites(): void {
    this.optionsService.toggleState('showFavorites');
    if (this.optionsService.showFavorites && this.optionsService.showPanel) {
      console.log('need to close Panel');
      this.optionsService.toggleState('showPanel');

    }
  }

  onAnimationEvent( event: AnimationEvent ): void {
    console.log(event);
        // in our example, fromState is either open or closed
        console.log(`From: ${event.fromState}`);

        // in our example, toState either open or closed
        console.log(`To: ${event.toState}`);
    
        // the HTML element itself, the button in this case
        console.log(`Element: ${event.element}`);
  }

}
