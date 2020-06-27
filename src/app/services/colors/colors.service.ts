import { Injectable } from '@angular/core';

// import { MessageService } from '../message/message.service';
// import { AudioService } from '../audio/audio.service';
import { OptionsService } from '../options/options.service';
// import { EngineService } from '../engine/engine.service';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  // private audioService: AudioService;
  // private optionsService: OptionsService;
  // private messageService: MessageService;
  // private engineService: EngineService;

  colorTime = 0;
  colorTimeInc = .016;
  startingColorSet = 0;
  endingColorSet = 1;

  constructor(
    // public audioService: AudioService,
    private optionsService: OptionsService
    // public messageService: MessageService,
    // public engineService: EngineService
  ) {
    // this.audioService = audioService;
    // this.optionsService = optionsService;
    // this.messageService = messageService;
    // this.engineService = engineService;

    setInterval(() => {
      let randnum;
      this.colorTime += this.colorTimeInc;

      if (this.colorTime >= 1) {
        this.colorTime = 1;
        this.colorTimeInc *= -1;
        do {
          randnum = Math.floor(Math.random() * 11);
        } while (randnum === this.startingColorSet ||
          randnum === this.endingColorSet);
        this.startingColorSet = randnum;
      }

      if (this.colorTime <= 0) {
        this.colorTime = 0;
        this.colorTimeInc *= -1;
        do {
          randnum = Math.floor(Math.random() * 11);
        } while (randnum === this.startingColorSet ||
          randnum === this.endingColorSet);
        this.endingColorSet = randnum;
      }

    }, 128);
  }



  colors(yy) {
    let r;
    let g;
    let b;

    const midLoc = this.optionsService.midLoc;

    const minVal = this.optionsService.options.minColor.value;
    const minR = parseInt(minVal.substring(1, 3), 16);
    const minG = parseInt(minVal.substring(3, 5), 16);
    const minB = parseInt(minVal.substring(5), 16);

    const midVal = this.optionsService.options.midColor.value;
    const midR = parseInt(midVal.substring(1, 3), 16);
    const midG = parseInt(midVal.substring(3, 5), 16);
    const midB = parseInt(midVal.substring(5), 16);

    const maxVal = this.optionsService.options.maxColor.value;
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

    // const getOptionColor = (name, c) => {
    //   const val = this.optionsService.options[name].value;

    //   if (c === 'r') {
    //     return (val.substring(1, 3));
    //   }

    //   if (c === 'g') {
    //     return (val.substring(3, 5));
    //   }

    //   if (c === 'b') {
    //     return (val.substring(5));
    //   }

    // };

    if (this.optionsService.options.customColors.value === false) {
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

      // if (yy <= midLoc) {
      //   r = parseInt(getOptionColor('minColor', 'r'), 16) +
      //     (parseInt(getOptionColor('midColor', 'r'), 16) -
      //       parseInt(getOptionColor('minColor', 'r'), 16)) *
      //     yy / midLoc;
      //   g = parseInt(getOptionColor('minColor', 'g'), 16) +
      //     (parseInt(getOptionColor('midColor', 'g'), 16) -
      //       parseInt(getOptionColor('minColor', 'g'), 16)) *
      //     yy / midLoc;
      //   b = parseInt(getOptionColor('minColor', 'b'), 16) +
      //     (parseInt(getOptionColor('midColor', 'b'), 16) -
      //       parseInt(getOptionColor('minColor', 'b'), 16)) *
      //     yy / midLoc;
      // } else {
      //   r = parseInt(getOptionColor('midColor', 'r'), 16) +
      //     (parseInt(getOptionColor('maxColor', 'r'), 16) -
      //       parseInt(getOptionColor('midColor', 'r'), 16)) *
      //     (yy - midLoc) / (255 - midLoc);
      //   g = parseInt(getOptionColor('midColor', 'g'), 16) +
      //     (parseInt(getOptionColor('maxColor', 'g'), 16) -
      //       parseInt(getOptionColor('midColor', 'g'), 16)) *
      //     (yy - midLoc) / (255 - midLoc);
      //   b = parseInt(getOptionColor('midColor', 'b'), 16) +
      //     (parseInt(getOptionColor('maxColor', 'b'), 16) -
      //       parseInt(getOptionColor('midColor', 'b'), 16)) *
      //     (yy - midLoc) / (255 - midLoc);
      // }

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



