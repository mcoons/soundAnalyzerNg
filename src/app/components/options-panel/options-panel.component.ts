
import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';
import { AudioService } from '../../services/audio/audio.service';

@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OptionsPanelComponent implements OnInit, OnDestroy {

  objectKeys = Object.keys;

  // private subscription: Subscription;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(AudioService) public audioService: AudioService,
    @Inject(MessageService) private messageService: MessageService
  ) {

    // this.subscription = messageService.messageAnnounced$.subscribe(
    //   message => {
    //     // console.log('Options Panel: Message received from service is :  ' + message);
    //   });

  }

  ngOnInit() {
  }

  randomizeList() {
    this.messageService.announceMessage('randomize list');
  }

  // toggleItem(e) {
  //   this.optionsService.toggleOption(e.target.name);
  // }

  updateItem(e) {
    this.messageService.announceMessage(e.target.id);
  }

  radioChange(e) {
    this.optionsService.toggleVisualRadio(e.target.id, e.target.value);
    this.optionsService.updateState('currentVisual', e.target.value);
    this.messageService.announceMessage('scene change');

  }

  // colorChange(e) {
  //   if (e.type !== 'change') {
  //     return;
  //   }
  //   // console.log('colorchange');
  // }

  radioNoteChange(e) {
    this.optionsService.toggleNoteRadio(e.target.id, e.target.value);
    this.optionsService.setOption('currentNote', e.target.value);
  }

  trackChange(e) {
    this.optionsService.updateState('currentTrack', e.target.value);
    this.messageService.announceMessage('track change');
  }

  siteListSelection() {
    this.audioService.disableMic();
    this.messageService.announceMessage('site list selection');
  }

  localListSelection() {
    this.audioService.disableMic();
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
    this.messageService.announceMessage('volume change');
  }

  // setVolume(volume) {
  //   this.messageService.announceMessage('volume change');
  // }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // this.subscription.unsubscribe();
  }
}
