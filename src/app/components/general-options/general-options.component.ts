import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-general-options',
  templateUrl: './general-options.component.html',
  styleUrls: ['./general-options.component.css']
})
export class GeneralOptionsComponent implements OnInit {

  public currentVisualIndex;
  public currentVisual;
  public general;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService
  ) { 
    this.currentVisualIndex = this.optionsService.newBaseOptions.currentVisual;
    this.currentVisual = this.optionsService.newBaseOptions.visual[this.currentVisualIndex];
    this.general = this.optionsService.newBaseOptions.general;
  }

  ngOnInit(): void {
  }

  radioNoteChange(e) {
    console.log(e.target); 
    this.optionsService.toggleNoteRadioNew(e.target.id, e.target.value);
    // this.optionsService.setOptionNew('currentNote', e.target.value);
    // this.optionsService.newBaseOptions.general[1].note
  }

  // trackChange(e) {
  //   this.optionsService.updateState('currentTrack', e.target.value);
  //   this.messageService.announceMessage('track change');
  // }

  // siteListSelection() {
  //   this.audioService.disableMic();
  //   this.messageService.announceMessage('site list selection');
  // }

  // localListSelection() {
  //   this.audioService.disableMic();
  //   this.messageService.announceMessage('local list selection');
  // }

  // previousTrack() {
  //   this.messageService.announceMessage('previousTrack');
  // }

  // nextTrack() {
  //   this.messageService.announceMessage('nextTrack');
  // }

  // playPause() {
  //   this.messageService.announceMessage('playPause');
  // }

  // onSliderChangeVolume(e) {
  //   this.messageService.announceMessage('volume change');
  // }

}
