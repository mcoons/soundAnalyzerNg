
import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, Inject, NgZone } from '@angular/core';
// import { Subscription } from 'rxjs';

import { OptionsService } from '../../services/options/options.service';
import { AudioService } from '../../services/audio/audio.service';
// import { MessageService } from '../../services/message/message.service';

import { map } from '../../visualization-classes/utilities.js';

@Component({
  selector: 'app-canvas2-d',
  templateUrl: './canvas2-d.component.html',
  styleUrls: ['./canvas2-d.component.css']
})
export class Canvas2DComponent implements OnDestroy, AfterViewInit {
  @ViewChild('canvas2d', { static: true }) canvas2d: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;
  // private subscription: Subscription;

  // private waveformDelayCounter = 0;
  private waveFormDataSource;

  private playerDiv;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(AudioService) public audioService: AudioService,
    private ngZone: NgZone,
    // @Inject(MessageService) public messageService: MessageService
  ) { }

  ngAfterViewInit(): void {
    this.ctx = this.canvas2d.nativeElement.getContext('2d');
    this.canvas2d.nativeElement.style.width = this.canvas2d.nativeElement.width.toString();
    this.canvas2d.nativeElement.style.height = this.canvas2d.nativeElement.height.toString();
    this.ctx.globalAlpha = .5;

    // window.requestAnimationFrame(this.render2DFrame);
    this.animate();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // this.subscription.unsubscribe();
  }

  animate(): void {
    this.ngZone.runOutsideAngular(() => {

      const render2DFrame = () => {
        // if (this.audioService.audio != null) {
        //   this.audioService.analyzeData();
        // }
    
        this.fixDpi();
        this.optionsService.windowResize();
    
        if (this.optionsService.showSplash === false) {
          if (this.optionsService.showBars === true) {
            this.draw2DBars();
          }
    
          if (this.optionsService.showWaveform === true) {
            this.waveFormDataSource = this.audioService.tdDataArray;
            this.drawWaveform();
          }
        }
        window.requestAnimationFrame(render2DFrame);
      };

      render2DFrame();

    });
  }

  // render2DFrame = () => {
  //   if (this.audioService.audio != null) {
  //     this.audioService.analyzeData();
  //   }

  //   this.fixDpi();
  //   this.optionsService.windowResize();

  //   if (this.optionsService.showSplash === false) {
  //     if (this.optionsService.showBars === true) {
  //       this.draw2DBars();
  //     }

  //     if (this.optionsService.showWaveform === true) {
  //       this.waveFormDataSource = this.audioService.tdDataArray;
  //       this.drawWaveform();
  //     }
  //   }
  //   window.requestAnimationFrame(this.render2DFrame);
  // }

  fixDpi = () => {
    const dpi = window.devicePixelRatio;
    const styles = window.getComputedStyle(this.canvas2d.nativeElement);

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
    this.canvas2d.nativeElement.setAttribute('width', (style.width() * dpi).toString());
    this.canvas2d.nativeElement.setAttribute('height', (style.height() * dpi).toString());
  }

  draw2DBars() {
    const dataSource = this.audioService.sample1;
    if (dataSource == null) {
      return;
    }

    const WIDTH = this.canvas2d.nativeElement.width - 50;
    const HEIGHT = this.canvas2d.nativeElement.height;
    const barWidth = (WIDTH / dataSource.length); // - 1; // -80

    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    let x = 0;
    for (let i = 0; i < dataSource.length; i++) { // -80
      const barHeight = dataSource[i] * .5 + 1;

      const r = barHeight * 2 - 1;
      const g = 255 * i / 576;
      const b = 255 - 128 * i / 550;

      this.ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',.7)';
      this.ctx.fillRect(x + 25, this.getTopOfPlayer() - barHeight - 30, barWidth, barHeight);

      const ch = this.optionsService.getOptions().currentNote.value;
      if (ch !== 'None') {
        const keyOffset = this.optionsService.getOptions()[ch].value;
        const hertz = this.optionsService.getOptions()[ch].hertz * Math.pow(2, ((i - keyOffset) / 64 + 2) - 1);
        const label = this.optionsService.getOptions()[ch].label;

        this.ctx.font = '16px Arial';
        if (i <= 480 && i >= 58 && (i - keyOffset) % 64 === 0) {

          this.ctx.fillStyle = 'white';
          this.ctx.fillRect(x + 25, (this.getTopOfPlayer() - 40), barWidth, 10);

          this.ctx.fillText(label + ((i - keyOffset) / 64 + 2), x + 25 - 9, (this.getTopOfPlayer() - 10));
          // tslint:disable-next-line: max-line-length
          this.ctx.fillText('~' + hertz.toString() + 'Hz', x + 25 - 45 + (ch === 'A' || ch === 'ASharp' ? 17 : 0), (this.getTopOfPlayer() + 10));
        }

      }

      x += barWidth; // + 1;
    }

  }

  drawWaveform() {
    if (this.waveFormDataSource == null) {
      return;
    }

    const width = 512;

    const PI = Math.PI;
    const TwoPI = PI * 2;
    const PId2 = PI / 2;
    const PId32 = PI / 32;

    this.ctx.lineWidth = 3;
    this.ctx.moveTo(this.canvas2d.nativeElement.width / 2 - 256, 120);
    this.ctx.beginPath();
    for (let i = 0; i < width; i++) {

      const multiplier = Math.sin(map(i, 0, width - 1, 0, PI));
      const y = (this.waveFormDataSource[i] - 128) * multiplier * this.optionsService.waveformMultiplier;

      this.ctx.lineTo(i * 2 + this.canvas2d.nativeElement.width / 2 - 512, y + 120);
    }

    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();

  }

  getTopOfPlayer(): number {
    // console.log(this.canvas2d.nativeElement);
    // console.log(this.playerDiv);
    this.playerDiv = document.getElementById('playerDiv');

    if (this.playerDiv.offsetTop * window.devicePixelRatio <= this.canvas2d.nativeElement.height) {
      return this.playerDiv.offsetTop * window.devicePixelRatio - 60;
    } else {
      return this.canvas2d.nativeElement.height - 60;
    }
  }

}
