import { Component, OnInit, OnDestroy } from '@angular/core';
import { OptionsService } from '../options.service';

import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css'],

})
export class OptionsPanelComponent implements OnInit, OnDestroy {

  objectKeys = Object.keys;

  subscription: Subscription;

  options;

  constructor(
    public optionsService: OptionsService,
    public messageService: MessageService) {

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        console.log('Options Panel: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
      });
  }

  ngOnInit() {
    // setTimeout(() => {
    //   this.optionsService.options['showPlayer'].value = false;
    // }, 10);
    setTimeout(() => {
      this.optionsService.options.showPlayer.value = true;
    }, 11);


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
