
import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';
import { AudioService } from '../../services/audio/audio.service';
import { EngineService } from '../../services/engine/engine.service';
// import { ColorsService } from '../../services/colors/colors.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-panel-left',
  templateUrl: './panel-left.component.html',
  styleUrls: ['./panel-left.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class PanelLeftComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(AudioService) public audioService: AudioService,
    @Inject(MessageService) private messageService: MessageService,
    @Inject(EngineService) public engineService: EngineService,
    @Inject(StorageService) private storageService: StorageService
  ) { }


  ngOnInit(): void {
    if (this.optionsService.favorites.length > 0) {
      this.favoriteChange({target: {value: this.optionsService.favorites.length-1}}); 
      this.optionsService.favorites[this.optionsService.favorites.length-1].checked = true;
    }
  }

  randomizeList(): void {
    this.messageService.announceMessage('randomize list');
  }

  favoriteDelete(e): void {
    console.log(e);
    this.optionsService.favorites = this.optionsService.favorites.filter( (v, i, a) => {
      // console.log(v);
      return v.value.toString() !== e.target.id.toString();
    });

    this.optionsService.favorites.forEach( (v, i, a) => {
      v.value = i;
    });

    this.storageService.saveFavorites(this.optionsService.favorites);

  }

  favoriteChange(e): void {
    this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].calpha = this.engineService.camera1.alpha;
    this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].cbeta = this.engineService.camera1.beta;
    this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].cradius = this.engineService.camera1.radius;

    Object.assign(this.optionsService.newBaseOptions, JSON.parse(JSON.stringify(this.optionsService.favorites[e.target.value].options)));
  
    this.optionsService.updateState('currentVisual', this.optionsService.favorites[ e.target.value ].state.currentVisual.value);
    this.messageService.announceMessage('scene change');
    this.messageService.announceMessage('set lights');
    this.messageService.announceMessage('set camera');

// TODO: Run update on all customized values as proc that can be used other places

  }

  updateItem(e) {
    this.messageService.announceMessage(e.target.id);
  }

  // radioChange(e) {
  //   this.optionsService.toggleVisualRadio(e.target.id, e.target.value);
  //   this.optionsService.updateState('currentVisual', e.target.value);
  //   this.messageService.announceMessage('scene change');
  // }

  radioNoteChange(e): void {
    this.optionsService.toggleNoteRadio(e.target.id, e.target.value);
    this.optionsService.setOption('currentNote', e.target.value);
  }

  trackChange(e): void {
    this.optionsService.updateState('currentTrack', e.target.value);
    this.messageService.announceMessage('track change');
  }

  siteListSelection(): void {
    this.audioService.disableMic();
    this.messageService.announceMessage('site list selection');
  }

  localListSelection(): void {
    this.audioService.disableMic();
    this.messageService.announceMessage('local list selection');
  }


  previousTrack(): void {
    this.messageService.announceMessage('previousTrack');
  }

  nextTrack(): void {
    this.messageService.announceMessage('nextTrack');
  }

  playPause(): void {
    this.messageService.announceMessage('playPause');
  }

  onSliderChangeVolume(e): void {
    this.messageService.announceMessage('volume change');
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    // this.subscription.unsubscribe();
  }

}
