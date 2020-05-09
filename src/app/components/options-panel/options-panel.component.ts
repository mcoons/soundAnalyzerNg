
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';
import { Subscription } from 'rxjs';

import {MatTooltipModule} from '@angular/material/tooltip';
import {TooltipPosition} from '@angular/material/tooltip';


@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css'],
  encapsulation: ViewEncapsulation.None
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

  radioChange(e) {
    // console.log(e.target);
    // console.log(this.options);
    this.optionsService.toggleVisualRadio(e.target.id, e.target.value);
    this.optionsService.updateOption('currentScene', e.target.value);

    // (document.querySelector('#playerDIV > mat-advanced-audio-player > mat-card.mat-card.mat-focus-indicator.d-flex.justify-content-center.ngx-advanced-audio-player.z-depth-1.mat-elevation-z2 > button.mat-focus-indicator.p-1.play-pause.mat-button.mat-button-base')  ).click();
    // (document.querySelector('#cdk-accordion-child-0 > div > table > tbody > tr:nth-child(1) > td.mat-cell.cdk-cell.cdk-column-title.mat-column-title.ng-star-inserted')  ).click();
  
  }

  trackChange(e) {
    console.log(e.target);
    this.optionsService.updateState('currentTrack', e.target.value);
    this.messageService.announceMessage('track change');
  }

  siteListSelection() {
    this.messageService.announceMessage('site list selection');
  }

  localListSelection() {
    this.messageService.announceMessage('local list selection');
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
