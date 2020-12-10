
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

    const timestamp = new Date();
    // const month = timestamp.getMonth() ;
    const month = ('0' + timestamp.getMonth()).slice (-2);
    // const day = timestamp.getDate();
    const day = ('0' + timestamp.getDate()).slice (-2);
    const year = timestamp.getFullYear();
    const hours = ('0' + timestamp.getHours()).slice (-2);
    const minutes = ('0' + timestamp.getMinutes()).slice (-2);
    const seconds = ('0' + timestamp.getSeconds()).slice (-2);

    // const timeString = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].label + ` ${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
    const timeString = ` ${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
    console.log(timeString);

    this.optionsService.favorites.push(
      // {
      //   label: 'Favorite ' + (this.optionsService.favorites.length + 1),
      //   value: this.optionsService.favorites.length,
      //   name: 'Favorite ' + (this.optionsService.favorites.length + 1),
      //   checked: false,
      //   options:  JSON.parse(JSON.stringify(this.optionsService.newBaseOptions)) ,
      //   state:    JSON.parse(JSON.stringify(this.optionsService.state))
      // });
      {
        label: 'Favorite ' + timeString,
        value: this.optionsService.favorites.length,
        name: 'Favorite ' + timeString,
        checked: false,
        options:  JSON.parse(JSON.stringify(this.optionsService.newBaseOptions)) ,
        state:    JSON.parse(JSON.stringify(this.optionsService.state))
      });

    console.log(JSON.stringify(this.optionsService.newBaseOptions));

    this.storageService.saveFavorites(this.optionsService.favorites);

  }

}
