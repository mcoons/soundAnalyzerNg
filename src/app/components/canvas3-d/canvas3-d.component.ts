
import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { MessageService } from '../../services/message/message.service';
import { EngineService } from '../../services/engine/engine.service';

@Component({
  selector: 'app-canvas3-d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.css']
})

export class Canvas3DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererCanvas', { static: true })
  private rendererCanvas: ElementRef<HTMLCanvasElement>;

  private canvas;
  private subscription: Subscription;

  constructor(
    public messageService: MessageService,
    private engineService: EngineService) {

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        // console.log('Canvas3D: Message received from service is :  ' + message);
      });
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('rendererCanvas') as HTMLCanvasElement;
    this.fixDpi();
    this.engineService.createScene(this.rendererCanvas);
    this.engineService.animate();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  fixDpi = () => {
    const dpi = window.devicePixelRatio;
    const styles = window.getComputedStyle(this.canvas);

    // create a style object that returns width and height
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
