
import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';
import { AudioService } from '../../services/audio/audio.service';
import { EngineService } from '../../services/engine/engine.service';
import { convertCompilerOptionsFromJson } from 'typescript';

@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class OptionsPanelComponent implements OnInit, OnDestroy {
  @ViewChild('graduate', { static: true }) graduate: ElementRef;

  objectKeys = Object.keys;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(AudioService) public audioService: AudioService,
    @Inject(MessageService) private messageService: MessageService,
    @Inject(EngineService) private engineService: EngineService
  ) {
  }

  ngOnInit() {
    const percent = Math.round((this.optionsService.options.midLoc.value / 255) * 100);

    // tslint:disable-next-line: max-line-length
    this.graduate.nativeElement.style.background = 'linear-gradient(to right, ' + this.optionsService.options.minColor.value + ',' + this.optionsService.options.midColor.value + ' ' + percent + '% ,' + this.optionsService.options.maxColor.value + ')';
  }

  randomizeList() {
    this.messageService.announceMessage('randomize list');
  }

  lightColorChange(e) {
    console.log('light color change: ');
    console.log(e.target.value);  // #00ff00
    console.log('e.target.id: ');  // #00ff00
    console.log(e.target.id);  // #00ff00



    switch (e.target.id) {
      case 'light0Color':
        console.log('Hex Convert:');
        console.log(BABYLON.Color3.FromHexString(e.target.value));
        this.engineService.scene.lights[0].diffuse = BABYLON.Color3.FromHexString(e.target.value);

        console.log('Light Color:');
        console.log(this.engineService.scene.lights[0].diffuse);

        break;

      case 'light0Specular':
        console.log('Hex Convert:');
        console.log(BABYLON.Color3.FromHexString(e.target.value));
        this.engineService.scene.lights[0].specular = BABYLON.Color3.FromHexString(e.target.value);

        console.log('Light Specular:');
        console.log(this.engineService.scene.lights[0].specular);

        break;

      case 'light0Intensity':
        this.engineService.scene.lights[0].intensity = e.target.value/100;

        console.log(this.engineService.scene.lights[0].intensity);

        break;


      case 'light1Color':
        this.engineService.scene.lights[1].diffuse = BABYLON.Color3.FromHexString(e.target.value);

        console.log(this.engineService.scene.lights[1].diffuse);

        break;

      case 'light1Specular':
        this.engineService.scene.lights[1].specular = BABYLON.Color3.FromHexString(e.target.value);

        console.log(this.engineService.scene.lights[1].specular);

        break;

      case 'light1Intensity':
        this.engineService.scene.lights[1].intensity = e.target.value/100;

        console.log(this.engineService.scene.lights[1].intensity);

        break;



      case 'light2Color':
        this.engineService.scene.lights[2].diffuse = BABYLON.Color3.FromHexString(e.target.value);

        console.log(this.engineService.scene.lights[2].diffuse);

        break;

      case 'light2Specular':
        this.engineService.scene.lights[2].specular = BABYLON.Color3.FromHexString(e.target.value);

        console.log(this.engineService.scene.lights[2].specular);

        break;

      case 'light2Intensity':
        this.engineService.scene.lights[2].intensity = e.target.value/100;

        console.log(this.engineService.scene.lights[2].intensity);

        break;


      case 'groundLightColor':
        this.engineService.scene.lights[3].diffuse = BABYLON.Color3.FromHexString(e.target.value);
        (this.engineService.scene.lights[3] as unknown as BABYLON.HemisphericLight).groundColor = BABYLON.Color3.FromHexString(e.target.value);

        console.log(this.engineService.scene.lights[3].diffuse);

        break;

      case 'groundLightSpecular':
        this.engineService.scene.lights[3].specular = BABYLON.Color3.FromHexString(e.target.value);

        console.log(this.engineService.scene.lights[3].specular);

        break;

      case 'groundLightIntensity':
        this.engineService.scene.lights[3].intensity = e.target.value/100;

        console.log(this.engineService.scene.lights[3].intensity);

        break;



      default:
        break;
    }



  }


  colorChange(e) {
    // let element = document.querySelector('#graduate');
    // var style = window.getComputedStyle ? getComputedStyle(element, null) : element.currentStyle;

    // tslint:disable-next-line: max-line-length
    // console.log('linear-gradient(to right, "' + this.optionsService.options.minColor.value + '","' + this.optionsService.options.maxColor.value + '")');
    // this.graduate.nativeElement.innerHTML = 'Changed';
    const percent = Math.round((this.optionsService.options.midLoc.value / 255) * 100);
    // console.log(percent);
    // tslint:disable-next-line: max-line-length
    this.graduate.nativeElement.style.background = 'linear-gradient(to right, ' + this.optionsService.options.minColor.value + ',' + this.optionsService.options.midColor.value + ' ' + percent + '% ,' + this.optionsService.options.maxColor.value + ')';
    // console.log(this.optionsService.options);
    // console.log((this.optionsService.options.midLoc.value - 20 ) / 215);
    // this.graduate.nativeElement.style.background = 'linear-gradient(to right,#0000ff 20%, #000000)';
    // console.log(this.graduate.nativeElement.style);

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
