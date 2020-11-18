
import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';
import { AudioService } from '../../services/audio/audio.service';
import { EngineService } from '../../services/engine/engine.service';
// import { SmartArrayNoDuplicate } from 'babylonjs';

@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OptionsPanelComponent implements OnInit, OnDestroy {
  // @ViewChild('graduate', { static: true }) graduate: ElementRef;

  objectKeys = Object.keys;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(AudioService) public audioService: AudioService,
    @Inject(MessageService) private messageService: MessageService,
    @Inject(EngineService) private engineService: EngineService
  ) {
  }

  ngOnInit() {
    // const percent = Math.round((this.optionsService.midLoc / 255) * 100);

    // tslint:disable-next-line: max-line-length
    // this.graduate.nativeElement.style.background = 'linear-gradient(to right, ' + this.optionsService.minColor + ',' + this.optionsService.midColor + ' ' + percent + '% ,' + this.optionsService.maxColor + ')';
  }

  // randomizeList() {
  //   this.messageService.announceMessage('randomize list');
  // }

  lightColorChange(e) {
    // console.log('light color change: ');
    // console.log(e.target.value);  // #00ff00
    // console.log('e.target.id: ');  // #00ff00
    // console.log(e.target.id);  // #00ff00

    switch (e.target.id) {
      case 'light0Color':
        this.engineService.scene.lights[0].diffuse = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light0Specular':
        break;
      case 'light0Intensity':
        this.engineService.scene.lights[0].intensity = e.target.value / 100;
        break;
      case 'light0GroundColor':
        (this.engineService.scene.lights[0] as unknown as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(e.target.value);
        break;

      case 'light1Color':
        this.engineService.scene.lights[1].diffuse = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light1Specular':
        this.engineService.scene.lights[1].specular = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light1Intensity':
        this.engineService.scene.lights[1].intensity = e.target.value / 100;
        break;
      case 'light1GroundColor':
        (this.engineService.scene.lights[1] as unknown as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(e.target.value);
        break;

      case 'light2Color':
        this.engineService.scene.lights[2].diffuse = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light2Specular':
        this.engineService.scene.lights[2].specular = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light2Intensity':
        this.engineService.scene.lights[2].intensity = e.target.value / 100;
        break;
      case 'light2GroundColor':
        (this.engineService.scene.lights[2] as unknown as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(e.target.value);
        break;

      case 'light3Color':
        this.engineService.scene.lights[3].diffuse = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light3Specular':
        this.engineService.scene.lights[3].specular = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light3Intensity':
        this.engineService.scene.lights[3].intensity = e.target.value / 100;
        break;
      case 'light3GroundColor':
        // tslint:disable-next-line: max-line-length
        (this.engineService.scene.lights[3] as unknown as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(e.target.value);
        break;

      case 'light4Color':
        this.engineService.scene.lights[4].diffuse = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light4Specular':
        this.engineService.scene.lights[4].specular = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light4Intensity':
        this.engineService.scene.lights[4].intensity = e.target.value / 100;
        break;
      case 'light4GroundColor':
        (this.engineService.scene.lights[4] as unknown as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(e.target.value);
        break;

      case 'light5Color':
        this.engineService.scene.lights[5].diffuse = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light5Specular':
        this.engineService.scene.lights[5].specular = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light5Intensity':
        this.engineService.scene.lights[5].intensity = e.target.value / 100;
        break;
      case 'light5GroundColor':
        (this.engineService.scene.lights[5] as unknown as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(e.target.value);
        break;

      case 'light6Color':
        this.engineService.scene.lights[6].diffuse = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light6Specular':
        this.engineService.scene.lights[6].specular = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light6Intensity':
        this.engineService.scene.lights[6].intensity = e.target.value / 100;
        break;
      case 'light6GroundColor':
        (this.engineService.scene.lights[6] as unknown as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(e.target.value);
        break;

      case 'light7Color':
        this.engineService.scene.lights[7].diffuse = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light7Specular':
        this.engineService.scene.lights[7].specular = BABYLON.Color3.FromHexString(e.target.value);
        break;
      case 'light7Intensity':
        this.engineService.scene.lights[7].intensity = e.target.value / 100;
        break;
      case 'light7GroundColor':
        (this.engineService.scene.lights[7] as unknown as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(e.target.value);
        break;

      default:
        break;
    }

  }

  addToFavorites(e) {
    this.optionsService.favorites.push(
      {
        name: 'Favorite ' + (this.optionsService.favorites.length + 1),
        options:  JSON.parse(JSON.stringify(this.optionsService.options)) ,
        state:    JSON.parse(JSON.stringify(this.optionsService.state))
      });

    console.log(JSON.stringify(this.optionsService.newBaseOptions));

    // var encodedUri = encodeURI(JSON.stringify(this.optionsService.newBaseOptions));
    // window.open(encodedUri);
  }


  // colorChange(e) {

  //   const percent = Math.round((this.optionsService.midLoc / 255) * 100);
  //   // tslint:disable-next-line: max-line-length
  //   this.graduate.nativeElement.style.background = 'linear-gradient(to right, ' + this.optionsService.minColor + ',' + this.optionsService.midColor + ' ' + percent + '% ,' + this.optionsService.maxColor + ')';

  // }

  updateItem(e) {
    this.messageService.announceMessage(e.target.id);
  }

  radioChange(e) {
    this.optionsService.toggleVisualRadio(e.target.id, e.target.value);
    this.optionsService.updateState('currentVisual', e.target.value);
    this.messageService.announceMessage('scene change');
  }

  // radioNoteChange(e) {
  //   this.optionsService.toggleNoteRadio(e.target.id, e.target.value);
  //   this.optionsService.setOption('currentNote', e.target.value);
  // }

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

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // this.subscription.unsubscribe();
  }
}
