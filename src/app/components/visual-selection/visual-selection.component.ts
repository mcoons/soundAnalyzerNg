import { Component, Inject } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { EngineService } from 'src/app/services/engine/engine.service';

@Component({
  selector: 'app-visual-selection',
  templateUrl: './visual-selection.component.html',
  styleUrls: ['./visual-selection.component.css']
})
export class VisualSelectionComponent {

  saveName = 'Test';
  subscription;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService,
    @Inject(EngineService) private engineService: EngineService,
    @Inject(StorageService) private storageService: StorageService
  ) {
    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        if (message === 'scene change') {
          this.saveName = this.optionsService.newBaseOptions.visual[this.optionsService.currentVisual].label;
        }
      });
  }


  spsChange(e: MouseEvent): void {
    const value = (e.target as HTMLInputElement).checked;

    const isMatch = (element) => element.label === (e.target as HTMLInputElement).id ;
    const typeIndex = this.optionsService.newBaseOptions.visual[0].types.findIndex(isMatch);

    if ((!value && this.optionsService.getSelectedCubeSPSCount() > 1) || value) {
      this.optionsService.newBaseOptions.visual[0].types[typeIndex].value = value;
      this.messageService.announceMessage('sps change');
    } else {
      this.optionsService.newBaseOptions.visual[0].types[typeIndex].value = !value;
      (document.getElementById((e.target as HTMLInputElement).id) as HTMLInputElement).checked = true;
    }

    this.messageService.announceMessage('sps change');

  }



  radioChange(e: MouseEvent): void {

    this.optionsService.newBaseOptions.visual.forEach(v => {
      v.checked = ((e.target as HTMLInputElement).id === v.label);
    });

    this.optionsService.updateState('currentVisual', (e.target as HTMLInputElement).value);
    this.optionsService.newBaseOptions.currentVisual = Number((e.target as HTMLInputElement).value);

    this.saveName = this.optionsService.newBaseOptions.visual[this.optionsService.currentVisual].label;

    this.messageService.announceMessage('scene change');
    this.messageService.announceMessage('set lights');
    this.messageService.announceMessage('set camera');
    this.messageService.announceMessage('Smoothing Constant');
    this.messageService.announceMessage('Visual Effect Strength');
  }

  addToFavorites(e: MouseEvent): void {

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
    // console.log(timeString);

    this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].calpha = this.engineService.camera1.alpha;
    this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].cbeta = this.engineService.camera1.beta;
    this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].cradius = this.engineService.camera1.radius;
    

    const t = JSON.parse(JSON.stringify(this.optionsService.newBaseOptions));
    // this.removeProps(t, 'label');
    // this.removeProps(t, 'hertz');
    // this.removeProps(t, 'label');
    
    this.optionsService.favorites.push(
      {
        // label: this.optionsService.newBaseOptions.visual[this.optionsService.currentVisual].label,
        label: this.saveName,
        value: this.optionsService.favorites.length,
        name: this.saveName + ' - ' + timeString,
        checked: false,
        options:  t,
        state:    JSON.parse(JSON.stringify(this.optionsService.state))
      });

    // console.log(JSON.stringify(this.optionsService.newBaseOptions));

    this.storageService.saveFavorites(this.optionsService.favorites);

    this.optionsService.favorites[this.optionsService.favorites.length-1].checked = true;

    
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
