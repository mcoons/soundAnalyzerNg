/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';
import { EngineService } from '../../services/engine/engine.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-panel-right',
  templateUrl: './panel-right.component.html',
  styleUrls: ['./panel-right.component.css']
})
export class PanelRightComponent implements OnInit, OnDestroy  {

  public _environment = environment;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService,
    @Inject(StorageService) private storageService: StorageService,
    @Inject(EngineService) private engineService: EngineService
  ) {

    console.log("In right panel.  Environment.production :");
    console.log(this._environment.production);
  }

  ngOnInit(): void {
    null;
  }

  ngOnDestroy(): void {
    null;
  }

  logCurrentVisual(e: MouseEvent): void {
    console.log(this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual]);
  }

  logScene(e: MouseEvent): void {
    console.log(this.engineService.scene);
  }

  logOptions(e: MouseEvent): void {
    console.log(this.optionsService.newBaseOptions);
  }

  logFavorites(e: MouseEvent): void {
    console.log(this.optionsService.favorites);
  }

  logCamera(e: MouseEvent): void {
    console.log(this.engineService.camera1);
  }

  axisChange(e: MouseEvent): void {
    if (this.optionsService.newBaseOptions.general.showAxis) {
      this.engineService.hideWorldAxis();
    } else {
      this.engineService.showWorldAxis();
     }
  }

  removeProps(obj,keys): void{
    if(obj instanceof Array){
      obj.forEach((item) =>{
        this.removeProps(item,keys)
      });
    }
    else if(typeof obj === 'object'){
      Object.getOwnPropertyNames(obj).forEach((key) => {
        if(keys.indexOf(key) !== -1)delete obj[key];
        else this.removeProps(obj[key],keys);
      });
    }
  }
}
