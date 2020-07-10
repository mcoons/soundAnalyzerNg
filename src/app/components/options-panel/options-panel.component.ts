
import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject } from '@angular/core';
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

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(AudioService) public audioService: AudioService,
    @Inject(MessageService) private messageService: MessageService
  ) { }

  ngOnInit() {
  }

  randomizeList() {
    this.messageService.announceMessage('randomize list');
  }


  updateItem(e) {
    this.messageService.announceMessage(e.target.id);
  }

  radioChange(e) {
    this.optionsService.toggleVisualRadio(e.target.id, e.target.value);
    this.optionsService.updateState('currentVisual', e.target.value);
    this.messageService.announceMessage('scene change');
  }

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

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // this.subscription.unsubscribe();
  }
}
