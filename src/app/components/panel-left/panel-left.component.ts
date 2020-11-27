
import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';
import { AudioService } from '../../services/audio/audio.service';
import { EngineService } from '../../services/engine/engine.service';
import { ColorsService } from '../../services/colors/colors.service';

@Component({
  selector: 'app-panel-left',
  templateUrl: './panel-left.component.html',
  styleUrls: ['./panel-left.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class PanelLeftComponent implements OnInit, OnDestroy {

  constructor(@Inject(OptionsService) public optionsService: OptionsService,
    @Inject(AudioService) public audioService: AudioService,
    @Inject(MessageService) private messageService: MessageService,
    @Inject(EngineService) private engineService: EngineService,
    @Inject(ColorsService) private colorService: ColorsService) {

  }

 
  ngOnInit() {
    const percent = Math.round((this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.midLoc.value / 255) * 100);

    // tslint:disable-next-line: max-line-length
    // setTimeout(() => {
    //   this.graduate.nativeElement.style.background = 'linear-gradient(to right, ' + this.optionsService.minColor + ',' + this.optionsService.midColor + ' ' + percent + '% ,' + this.optionsService.maxColor + ')';
    // }, 10);
  }

  randomizeList() {
    this.messageService.announceMessage('randomize list');
  }

  logCurrentVisual(e) {
    console.log(this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual]);
  }

  logScene(e)
  {
    console.log(this.engineService.scene);
  }

  logOptions(e) {
    console.log(this.optionsService.newBaseOptions);
  }

  logFavorites(e) {
    console.log(this.optionsService.favorites);
  }

  showAxis(e) {
    this.optionsService.newBaseOptions.general.showAxis = !this.optionsService.newBaseOptions.general.showAxis;
  }

  favoriteChange(e) {
    Object.assign(this.optionsService.newBaseOptions, this.optionsService.favorites[e.target.value].options);

    this.optionsService.updateState('currentVisual', this.optionsService.favorites[ e.target.value ].state.currentVisual.value);
    this.messageService.announceMessage('scene change');
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
