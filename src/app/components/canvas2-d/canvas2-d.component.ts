
import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { OptionsService } from '../../services/options/options.service';
import { AudioService } from '../../services/audio/audio.service';
import { MessageService } from '../../services/message/message.service';

import { map } from '../../visualization-classes/utilities.js';

@Component({
  selector: 'app-canvas2-d',
  templateUrl: './canvas2-d.component.html',
  styleUrls: ['./canvas2-d.component.css']
})
export class Canvas2DComponent implements OnDestroy, AfterViewInit {

  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private subscription: Subscription;

  waveformDelayCounter = 0;
  waveFormDataSource;

  constructor(
    public optionsService: OptionsService,
    public audioService: AudioService,
    public messageService: MessageService) {

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        // console.log('Canvas2D: Message received from service is :  ' + message);
      });
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('canvas2d') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.width = this.canvas.width.toString();
    this.canvas.style.height = this.canvas.height.toString();
    this.ctx.globalAlpha = .5;

    window.requestAnimationFrame(this.render2DFrame);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  render2DFrame = () => {
    if (this.audioService.audio != null) {
      this.audioService.analyzeData();
    }

    this.fixDpi();
    this.optionsService.windowResize();


    if (this.optionsService.getOptions().showBars.value === true) {
      this.draw2DBars();
    }

    this.waveformDelayCounter++;
    if (this.waveformDelayCounter >= this.optionsService.getOptions().waveformDelay.value) {
      this.waveformDelayCounter = 0;
      this.waveFormDataSource = this.audioService.getTDData();
    }

    if (this.optionsService.getOptions().showWaveform.value === true) {
      this.drawWaveform();
    }

    window.requestAnimationFrame(this.render2DFrame);
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

  draw2DBars() {
    let dataSource = this.audioService.getSample();
    if (dataSource == null) {
      return;
    }

    const WIDTH = this.canvas.width - 50;
    const HEIGHT = this.canvas.height;
    let barWidth = (WIDTH / dataSource.length); // - 1; // -80

    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    let x = 0;
    for (let i = 0; i < dataSource.length; i++) { // -80
      const barHeight = dataSource[i] * .5 + 1;

      const r = barHeight * 2 - 1;
      const g = 255 * i / 576;
      const b = 255 - 128 * i / 550;

      this.ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',.7)';
      this.ctx.fillRect(x + 25, this.getTopOfPlayer() - barHeight - 30, barWidth, barHeight);

      // if (i%10 === 0) {
      //   this.ctx.fillStyle = 'rgba(255,255,255 ,.7)';
      //   this.ctx.fillRect(x + 25, this.getTopOfPlayer() - barHeight -10, barWidth, barHeight);
      // }

      // if (i%100 === 0) {
      //   this.ctx.fillStyle = 'rgba(255,0,0 ,.7)';
      //   this.ctx.fillRect(x + 25, this.getTopOfPlayer() - barHeight -10, barWidth, barHeight);
      // }

      // if (i % 64 === 0) {
      //   this.ctx.fillStyle = 'rgba(0,255,0 ,.7)';
      //   this.ctx.fillRect(x + 25, (this.getTopOfPlayer()+10), barWidth, -20);
      // }

      const ch = this.optionsService.getOptions().currentNote.value;
      if (ch !== 'None') {
        const keyOffset = this.optionsService.getOptions()[ch].value;
        const hertz = this.optionsService.getOptions()[ch].hertz * Math.pow(2, ((i - keyOffset) / 64 + 2) - 1);
        const label = this.optionsService.getOptions()[ch].label;
        // console.log("key selected is: "+ch);
        // console.log("key offset is: "+keyOffset);

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

    ////////////////////////////

    dataSource = this.audioService.fr512DataArray;
    barWidth = (WIDTH / dataSource.length);
    x = 0;
    for (let i = 0; i < dataSource.length; i++) { // -80
      const barHeight = dataSource[i] * .5 + 1;

      const r = barHeight * 2 - 1;
      const g = 255 * i / 576;
      const b = 255 - 128 * i / 550;

      this.ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',.7)';
      this.ctx.fillRect(x + 25, this.getTopOfPlayer() - barHeight - 210, barWidth, barHeight);

      x += barWidth; // + 1;
    }

    ////////////////////////////

    dataSource = this.audioService.sampleAve;
    barWidth = (WIDTH / dataSource.length);
    x = 0;
    for (let i = 0; i < dataSource.length; i++) { // -80
      const barHeight = dataSource[i] * .5 + 1;

      const r = barHeight * 2 - 1;
      const g = 255 * i / 576;
      const b = 255 - 128 * i / 550;

      this.ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',.7)';
      this.ctx.fillRect(x + 25, this.getTopOfPlayer() - barHeight - 120, barWidth, barHeight);

      x += barWidth; // + 1;
    }



    // dataSource = this.audioService.fr1024DataArray;
    // barWidth = (WIDTH / dataSource.length);
    // x = 0;
    // for (let i = 0; i < dataSource.length; i++) { // -80
    //   const barHeight = dataSource[i] * .5 + 1;

    //   const r = barHeight * 2 - 1;
    //   const g = 255 * i / 576;
    //   const b = 255 - 128 * i / 550;

    //   this.ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',.7)';
    //   this.ctx.fillRect(x + 25, this.getTopOfPlayer() - barHeight -230, barWidth, barHeight);

    //   x += barWidth; // + 1;
    // }






  }

  drawWaveform() {
    if (this.waveFormDataSource == null) {
      return;
    }

    // const width = this.canvas.width - 50;
    const width = 1024;

    const PI = Math.PI;
    const TwoPI = PI * 2;
    const PId2 = PI / 2;
    const PId32 = PI / 32;

    this.ctx.lineWidth = 3;
    this.ctx.moveTo(this.canvas.width / 2 - 512, 120);
    this.ctx.beginPath();
    for (let i = 0; i < width; i++) {

      const multiplier = Math.sin(map(i, 0, width - 1, 0, PI));
      const y = (this.waveFormDataSource[i] - 128) * multiplier * this.optionsService.waveformMultiplier;

      this.ctx.lineTo(i + this.canvas.width / 2 - 512, y + 120);
    }

    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();

  }

  getTopOfPlayer(): number {
    const playerDiv = document.getElementById('playerDIV') as HTMLElement;

    if (playerDiv.offsetTop * window.devicePixelRatio <= this.canvas.height) {
      return playerDiv.offsetTop * window.devicePixelRatio - 60;
    } else {
      return this.canvas.height - 60;
    }
  }

}
