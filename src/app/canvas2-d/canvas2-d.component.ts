import { Component, OnInit, OnDestroy } from '@angular/core';

import { OptionsService } from '../options.service';
import { AudioService } from '../Audio.service';

import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas2-d',
  templateUrl: './canvas2-d.component.html',
  styleUrls: ['./canvas2-d.component.css']
})
export class Canvas2DComponent implements OnInit, OnDestroy {

  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  subscription: Subscription;

  options;

  constructor(
    public optionsService: OptionsService,
    public audioService: AudioService,
    public messageService: MessageService) {

    messageService.messageAnnounced$.subscribe(
      message => {
        console.log("Canvas2D: Message received from service is :  " + message);
        this.options = this.optionsService.getOptions();
      });
  }

  ngOnInit(): void {
    this.options = this.optionsService.getOptions();
  }

  ngAfterViewInit(): void {
    this.canvas = <HTMLCanvasElement>document.getElementById('canvas2d');
    this.ctx = this.canvas.getContext('2d');

    console.log('2D canvas');
    console.log(this.canvas);

    console.log("2D ctx: ");
    console.log(this.ctx);

    this.ctx.fillStyle = "blue";
    this.ctx.fillRect(this.canvas.width / 2 - 50, 0, 100, this.canvas.height);
  }


  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
