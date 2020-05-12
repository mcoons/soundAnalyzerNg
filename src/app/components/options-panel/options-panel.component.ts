
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

  private _subscription: Subscription;

  constructor(
    public optionsService: OptionsService,
    public _messageService: MessageService) {

    this._subscription = _messageService.messageAnnounced$.subscribe(
      message => {
        // console.log('Options Panel: Message received from service is :  ' + message);
      });

  }

  ngOnInit() {
  }

  toggleItem(e) {
    this.optionsService.toggleOption(e.target.name);
  }

  updateItem(e) {
    this._messageService.announceMessage('Item was changed: ' + e.target.id + ' to ' + this.optionsService.getOptions()[e.target.id].value);
  }

  radioChange(e) {
    this.optionsService.toggleVisualRadio(e.target.id, e.target.value);
    this.optionsService.setOption('currentScene', e.target.value);
  }

  trackChange(e) {
    console.log(e.target);
    this.optionsService.updateState('currentTrack', e.target.value);
    this._messageService.announceMessage('track change');
  }

  siteListSelection() {
    this._messageService.announceMessage('site list selection');
  }

  localListSelection() {
    this._messageService.announceMessage('local list selection');
  }

  previousTrack() {
    this._messageService.announceMessage('previousTrack');
  }

  nextTrack() {
    this._messageService.announceMessage('nextTrack');
  }

  playPause() {
    this._messageService.announceMessage('playPause');
  }

  onSliderChangeVolume(e) {
    this._messageService.announceMessage('volume change');
  }

  setVolume(volume) {
    this._messageService.announceMessage('volume change');
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this._subscription.unsubscribe();
  }
}
