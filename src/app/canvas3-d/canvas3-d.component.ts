
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { OptionsService } from '../options.service';
import { AudioService } from '../audio.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-canvas3-d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.css']
})

export class Canvas3DComponent implements OnInit, OnDestroy, AfterViewInit {

  private canvas: HTMLCanvasElement;
  subscription: Subscription;

  options;

  constructor(
    public optionsService: OptionsService,
    public audioService: AudioService,
    public messageService: MessageService) {

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        // console.log('Canvas3D: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
      });
  }

  ngOnInit(): void {
    this.options = this.optionsService.getOptions();
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas3d') as HTMLCanvasElement;
    // console.log('3D canvas');
    // console.log(this.canvas);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
