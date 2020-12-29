
import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, Inject, NgZone } from '@angular/core';

import { OptionsService } from '../../services/options/options.service';
import { AudioService } from '../../services/audio/audio.service';

import { map } from '../../visualization-classes/utilities.js';

@Component({
  selector: 'app-canvas2-d',
  templateUrl: './canvas2-d.component.html',
  styleUrls: ['./canvas2-d.component.css']
})
export class Canvas2DComponent implements OnDestroy, AfterViewInit {
  @ViewChild('canvas2d', { static: true }) canvas2d: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;
  private waveFormDataSource;
  private playerDiv;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(AudioService) public audioService: AudioService,
    private ngZone: NgZone,
  ) { }

  ngAfterViewInit(): void {
    this.ctx = this.canvas2d.nativeElement.getContext('2d');
    this.canvas2d.nativeElement.style.width = this.canvas2d.nativeElement.width.toString();
    this.canvas2d.nativeElement.style.height = this.canvas2d.nativeElement.height.toString();
    this.ctx.globalAlpha = .5;

    this.animate();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // this.subscription.unsubscribe();
  }

  animate(): void {
    this.ngZone.runOutsideAngular(() => {
      const render2DFrame = () => {

        this.fixDpi();
        this.optionsService.windowResize();

        if (this.optionsService.newBaseOptions.general.showBars.value && !this.optionsService.showSplash) {
          this.draw2DBars(this.audioService.sample1, 0);
          // this.draw2DBars(this.audioService.fr128DataArray, 200);
          // this.draw2DBars(this.audioService.fr16DataArray, 200);
          // this.draw2DBars(this.audioService.fr32DataArray, 340);
          // this.draw2DBars(this.audioService.fr64DataArray, 340);
          this.draw2DBars(this.audioService.fr256DataArray, 200);
          this.draw2DBars(this.audioService.sample2, 340);
          // this.draw2DBars(this.audioService.fr512DataArray, 900);
        }

        if (this.optionsService.newBaseOptions.general.showSoundWave && !this.optionsService.showSplash) {
          this.drawSoundWav();
        }

        if (this.optionsService.newBaseOptions.general.showWaveform && !this.optionsService.showSplash) {
          this.waveFormDataSource = this.audioService.tdDataArray;
          this.drawWaveform();
        }

        window.requestAnimationFrame(render2DFrame);
      };

      render2DFrame();
    });
  }

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

  draw2DBars(dataSource, height) {
    if (dataSource == null) {
      return;
    }

    const WIDTH = this.canvas2d.nativeElement.width - 50;
    const HEIGHT = this.canvas2d.nativeElement.height;
    const barWidth = (WIDTH / dataSource.length); // - 1; // -80

    // Clear on first 0 height element call only, Prepare to draw the topper
    if (height === 0) {
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
      this.ctx.beginPath();
      this.ctx.moveTo(25, this.getTopOfPlayer() - this.audioService.sample1Topper[0].value - height - 42);
    }

    let x = 0;

    this.ctx.strokeStyle = 'rgba(0, 247, 255,.7)';
    let maxDiff = 0;

    // loop data

    for (let i = 0; i < dataSource.length; i++) { // -80

      // draw bar chart
      const barHeight = dataSource[i] * .5 + 1;

      const r = barHeight * 2 - 1;
      const g = 255 * i / 576;
      const b = 255 - 128 * i / 550;

      this.ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',.7)';
      this.ctx.fillRect(x + 25, this.getTopOfPlayer() - barHeight - height - 40, barWidth, barHeight);

      // calculate and draw topper and diff bar
      // only if for bar 0
      if (height === 0) {

        this.bumpTopper(i, barHeight, x);

        // draw diff bar
        const diff = this.audioService.sample1Topper[i].value - dataSource[i] / 2;
        if (diff > maxDiff) {
          maxDiff = diff;
        }

        this.ctx.fillStyle = 'rgba(0, 247, 255,.7)';
        this.ctx.fillRect(x + 25, this.getTopOfPlayer() - (diff <= 1 ? 1 : (diff)) / 2 - height - 190, barWidth, (diff <= 1 ? 1 : (diff)));

        // // draw topper
        this.ctx.lineTo(x + 25, this.getTopOfPlayer() - this.audioService.sample1Topper[i].value - height - 42);
      }

      // draw key/freq designators
      const ch = this.optionsService.newBaseOptions.general.showBars.currentNote;
      this.ctx.font = '16px Arial';
      this.ctx.fillStyle = 'white';

      if (Number(ch) !== 12 && height === 0) {
        const keyOffset = this.optionsService.newBaseOptions.general.showBars.note[Number(ch)].value;
        // tslint:disable-next-line: max-line-length
        const hertz = this.optionsService.newBaseOptions.general.showBars.note[Number(ch)].hertz * Math.pow(2, ((i - keyOffset) / 64 + 2) - 1);
        const label = this.optionsService.newBaseOptions.general.showBars.note[Number(ch)].label;

        this.ctx.font = '16px Arial';
        if (i <= 480 && i >= 58 && (i - keyOffset) % 64 === 0) {

          this.ctx.fillStyle = 'white';
          this.ctx.fillRect(x + 25, (this.getTopOfPlayer() - 40), barWidth, 10);

          this.ctx.fillText(label + ((i - keyOffset) / 64 + 2), x + 25 - 9, (this.getTopOfPlayer() - 10));
          // tslint:disable-next-line: max-line-length
          this.ctx.fillText('~' + hertz.toString() + 'Hz', x + 25 - 45 + (ch === 0 || ch === 1 ? 17 : 0), (this.getTopOfPlayer() + 10));
        }

      }

      x += barWidth; // + 1;
    }  //  end loop

    if (height === 0) {
      this.ctx.stroke();
    }

  }

  bumpTopper(i, height, x) {
    if (this.audioService.sample1Topper[i].value <= height) {
      this.audioService.sample1Topper[i].value = height;
      this.audioService.sample1Topper[i].age = 0;
    } else {
      this.audioService.sample1Topper[i].value -= (this.audioService.sample1Topper[i].age++) / 10;
    }

    if (this.audioService.sample1Topper[i].value < 0) {
      this.audioService.sample1Topper[i].value = 0;
    }

    this.ctx.lineTo(x + 25, this.getTopOfPlayer() - this.audioService.sample1Topper[i].value - 42);
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
      const y = (this.waveFormDataSource[i] - 128) * multiplier;

      this.ctx.lineTo(i * 2 + this.canvas2d.nativeElement.width / 2 - 512, y + 120);
    }

    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();
  }

  drawSoundWav() {
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 5;
    this.audioService.tdMaxHistory.forEach((d, i) => {
      this.ctx.beginPath();
      this.ctx.moveTo((i * 8) + this.canvas2d.nativeElement.width / 2 - 500, 250 - (d - 128));
      this.ctx.lineTo((i * 8) + this.canvas2d.nativeElement.width / 2 - 500, 250 + (d - 128));
      this.ctx.stroke();
    });
  }

  getTopOfPlayer(): number {
    this.playerDiv = document.getElementById('playerDiv');

    if (this.playerDiv.offsetTop * window.devicePixelRatio <= this.canvas2d.nativeElement.height) {
      return this.playerDiv.offsetTop * window.devicePixelRatio - 60;
    } else {
      return this.canvas2d.nativeElement.height - 60;
    }
  }

}
