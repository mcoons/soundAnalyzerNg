
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { OptionsService } from '../../services/options/options.service';
import { AudioService } from '../../services/audio/audio.service';
import { MessageService } from '../../services/message/message.service';

import { EngineService } from '../../services/engine/engine.service';


@Component({
  selector: 'app-canvas3-d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.css']
})

export class Canvas3DComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;
  
  canvas;

  subscription: Subscription;

  options;

  constructor(
    public optionsService: OptionsService,
    public audioService: AudioService,
    public messageService: MessageService,
    private engServ: EngineService) {

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        // console.log('Canvas3D: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
      });
  }

  ngOnInit(): void {
    this.options = this.optionsService.getOptions();
    this.canvas = document.getElementById('rendererCanvas') as HTMLCanvasElement;

    this.engServ.createScene(this.rendererCanvas);
    this.fixDpi();
    this.engServ.animate();
  }

  ngAfterViewInit(): void {
    // this.canvas = document.getElementById('canvas3d') as HTMLCanvasElement;
    // console.log('3D canvas');
    // console.log(this.canvas);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }


  fixDpi = () => {
    // create a style object that returns width and height
    const dpi = window.devicePixelRatio;

    const styles = window.getComputedStyle(this.canvas);

    const style = {
      height() {
        return +styles.height.slice(0, -2);
      },
      width() {
        return +styles.width.slice(0, -2);
      }
    };
    // set the correct canvas attributes for device dpi
    this.canvas.setAttribute('width', (style.width() * dpi).toString());
    this.canvas.setAttribute('height', (style.height() * dpi).toString());
  }
}
