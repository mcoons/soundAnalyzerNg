import { Component, OnInit, OnDestroy } from '@angular/core';
import { OptionsService } from '../options.service';

import { MessageService } from '../message.service';
import { Subscription, Observable, fromEvent } from 'rxjs';


@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css']
})
export class OptionsPanelComponent implements OnInit, OnDestroy {

  objectKeys = Object.keys;

  subscription: Subscription;

  resizeObservable$: Observable<Event>;
  resizeSubscription$: Subscription;

  options;

  constructor(
    public optionsService: OptionsService,
    public messageService: MessageService) {

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        // console.log('Options Panel: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
      });

    this.resizeObservable$ = fromEvent(window, 'resize');
    this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
      console.log('event: ', evt);
      const playerDiv = document.getElementById('playerDIV') as HTMLElement;

      console.log('playerDiv client height = ' + playerDiv.clientHeight);
      console.log('playerDiv offsetTop = ' + playerDiv.offsetTop);

      console.log('window.devicePixelRatio = ' + window.devicePixelRatio);
      console.log('window.innerHeight = ' + window.innerHeight );
      console.log('window.outerHeight = ' + window.outerHeight );

      this.optionsService.updateOption('windowHeight', window.innerHeight);
      this.optionsService.updateOption('playerHeight', playerDiv.clientHeight);
      this.optionsService.updateOption('pixelRatio', window.devicePixelRatio);
      this.optionsService.updateOption('playerTop', playerDiv.offsetTop * window.devicePixelRatio);


    });

  }

  ngOnInit() {
    this.options = this.optionsService.getOptions();
  }

  toggleItem(e) {
    this.optionsService.toggleOption(e.target.name);
    this.options = this.optionsService.getOptions();

    this.announceChange('Item was changed: ' + e.target.name + ' to ' + this.options[e.target.name].value);
  }

  updateItem(e) {

    this.optionsService.updateOption(e.target.name, e.target.value);
    this.options = this.optionsService.getOptions();

    this.announceChange('Item was changed: ' + e.target.name + ' to ' + this.options[e.target.name].value);
  }

  announceChange(message: string) {
    this.messageService.announceMessage(message);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
