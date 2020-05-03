
import { Component, OnInit, OnDestroy } from '@angular/core';

import { OptionsService } from '../options.service';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css']
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
        // console.log('Options Panel: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
      });

  }

  ngOnInit() {
    this.options = this.optionsService.getOptions();
  }

  toggleItem(e) {
    this.optionsService.toggleOption(e.target.name);
  }

  updateItem(e) {
    this.optionsService.updateOption(e.target.name, e.target.value);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
