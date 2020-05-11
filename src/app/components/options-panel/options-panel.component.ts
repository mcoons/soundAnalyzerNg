
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
    this.optionsService.setOption(e.target.name, e.target.value);
  }

  radioChange(e) {
    // console.log(e.target);
    // console.log(this.options);
    this.optionsService.toggleVisualRadio(e.target.id, e.target.value);
    this.optionsService.setOption('currentScene', e.target.value);
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

  previousTrack() {
    this.messageService.announceMessage('previousTrack');
  }

  nextTrack() {
    this.messageService.announceMessage('nextTrack');
  }

  playPause() {
    this.messageService.announceMessage('playPause');
  }

  onSliderChangeVolume(e) {
    this.setVolume(e.target.value);
  }

  setVolume(volume) {
    // this.audio.volume = volume / 10;
    // this.currentVolume = volume;
    this.optionsService.setOption('volume', volume);
    this.messageService.announceMessage('volume change');
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
