
import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';
import { AudioService } from '../../services/audio/audio.service';
import { EngineService } from '../../services/engine/engine.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-panel-right',
  templateUrl: './panel-right.component.html',
  styleUrls: ['./panel-right.component.css']
})
export class PanelRightComponent implements OnInit, OnDestroy  {

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService,
    @Inject(StorageService) private storageService: StorageService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {

  }

  addToFavorites(e) {
    this.optionsService.favorites.push(
      {
        label: 'Favorite ' + (this.optionsService.favorites.length + 1),
        value: this.optionsService.favorites.length,
        name: 'Favorite ' + (this.optionsService.favorites.length + 1),
        checked: false,
        options:  JSON.parse(JSON.stringify(this.optionsService.newBaseOptions)) ,
        state:    JSON.parse(JSON.stringify(this.optionsService.state))
      });

    console.log(JSON.stringify(this.optionsService.newBaseOptions));

    this.storageService.saveFavorites(this.optionsService.favorites);
    // var encodedUri = encodeURI(JSON.stringify(this.optionsService.newBaseOptions));
    // window.open(encodedUri);
  }

  // radioNoteChange(e) {
  //   this.optionsService.toggleNoteRadioNew(e.target.id, e.target.value);
  // }

  // updateItem(e) {
  //   // console.log(e.target.id);
  //   this.messageService.announceMessage(e.target.id);
  // }

}
