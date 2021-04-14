import { Injectable, Inject, OnDestroy } from '@angular/core';

import { OptionsService } from '../options/options.service';

@Injectable({
  providedIn: 'root'
})
export class ColorsService implements OnDestroy {

  colorTime = 0;
  colorTimeInc = .05;
  startingColorSet = 0;
  endingColorSet = 1;
  randnum;

  private interval;

  constructor(
    @Inject(OptionsService) private optionsService: OptionsService
  ) {
    console.log('Color Service Constructor');

    this.interval = setInterval(() => {
      this.colorTime += this.colorTimeInc;

      if (this.colorTime >= 1) {
        this.colorTime = 1;
        this.colorTimeInc *= -1;
        do {
          this.randnum = Math.floor(Math.random() * 11);
        } while (this.randnum === this.startingColorSet ||
          this.randnum === this.endingColorSet);
        this.startingColorSet = this.randnum;
      }

      if (this.colorTime <= 0) {
        this.colorTime = 0;
        this.colorTimeInc *= -1;
        do {
          this.randnum = Math.floor(Math.random() * 11);
        } while (this.randnum === this.startingColorSet ||
          this.randnum === this.endingColorSet);
        this.endingColorSet = this.randnum;
      }

    }, 500); 
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  colors(yy) {
    let r;
    let g;
    let b;

    const midLoc = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.midLoc.value;

    const minVal = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.color[2].value;
    const minR = parseInt(minVal.substring(1, 3), 16);
    const minG = parseInt(minVal.substring(3, 5), 16);
    const minB = parseInt(minVal.substring(5), 16);

    const midVal = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.color[1].value;
    const midR = parseInt(midVal.substring(1, 3), 16);
    const midG = parseInt(midVal.substring(3, 5), 16);
    const midB = parseInt(midVal.substring(5), 16);

    const maxVal = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.color[0].value;
    const maxR = parseInt(maxVal.substring(1, 3), 16);
    const maxG = parseInt(maxVal.substring(3, 5), 16);
    const maxB = parseInt(maxVal.substring(5), 16);

    const colorSets = [
      { r: 128 - yy / 2, g: yy, b: 200 - yy * 2 },
      { r: yy, g: 128 - yy / 2, b: 200 - yy * 2 },
      { r: 128 - yy / 2, g: 200 - yy * 2, b: yy },
      { r: 200 - yy * 2, g: yy, b: 128 - yy / 2 },
      { r: yy, g: 200 - yy * 2, b: 128 - yy / 2 },
      { r: 200 - yy * 2, g: 128 - yy / 2, b: yy },
      { r: 255 - (128 - yy / 2), g: 255 - yy, b: 255 - (200 - yy * 2) },
      { r: 255 - yy, g: 255 - (128 - yy / 2), b: 255 - (200 - yy * 2) },
      { r: 255 - (128 - yy / 2), g: 255 - (200 - yy * 2), b: 255 - yy },
      { r: 255 - (200 - yy * 2), g: 255 - yy, b: 255 - (128 - yy / 2) },
      { r: 255 - yy, g: 255 - (200 - yy * 2), b: 255 - (128 - yy / 2) },
      { r: 255 - (200 - yy * 2), g: 255 - (128 - yy / 2), b: 255 - yy }
    ];

    // if (this.optionsService.options.customColors.value === false) {
    if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.value === false) {
      r = colorSets[this.startingColorSet].r +
        (colorSets[this.endingColorSet].r - colorSets[this.startingColorSet].r) *
        this.colorTime;
      g = colorSets[this.startingColorSet].g +
        (colorSets[this.endingColorSet].g - colorSets[this.startingColorSet].g) *
        this.colorTime;
      b = colorSets[this.startingColorSet].b +
        (colorSets[this.endingColorSet].b - colorSets[this.startingColorSet].b) *
        this.colorTime;
    } else {

      if (yy <= midLoc) {
        r = minR + (midR - minR) * yy / midLoc;
        g = minG + (midG - minG) * yy / midLoc;
        b = minB + (midB - minB) * yy / midLoc;
      } else {
        r = midR + (maxR - midR) * (yy - midLoc) / (255 - midLoc);
        g = midG + (maxG - midG) * (yy - midLoc) / (255 - midLoc);
        b = midB + (maxB - midB) * (yy - midLoc) / (255 - midLoc);
      }

    }
    return { r, g, b };
  }

}
