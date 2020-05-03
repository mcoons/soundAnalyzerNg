
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { OptionsService } from './options.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class AudioService {

  audio: HTMLAudioElement = null;
  audioSrc: any;
  audioCtx: any;

  minDecibels = -100;
  maxDecibels = 0;
  smoothingConstant = .9;
  maxAverages = 50;

  fr64Analyser: any;
  fr64DataArray: Uint8Array = new Uint8Array(64);
  fr64DataArrayNormalized: Uint8Array = new Uint8Array(64);

  fr128Analyser: any;
  fr128DataArray: Uint8Array = new Uint8Array(128);
  fr128DataArrayNormalized: Uint8Array = new Uint8Array(128);

  fr256Analyser: any;
  fr256DataArray: Uint8Array = new Uint8Array(256);
  fr256DataArrayNormalized: Uint8Array = new Uint8Array(256);

  fr512Analyser: any;
  fr512DataArray: Uint8Array = new Uint8Array(512);
  fr512DataArrayNormalized: Uint8Array = new Uint8Array(512);

  fr1024Analyser: any;
  fr1024DataArray: Uint8Array = new Uint8Array(1024);
  fr1024DataArrayNormalized: Uint8Array = new Uint8Array(1024);

  fr2048Analyser: any;
  fr2048DataArray: Uint8Array = new Uint8Array(2048);
  fr2048DataArrayNormalized: Uint8Array = new Uint8Array(2048);

  fr4096Analyser: any;
  fr4096DataArray: Uint8Array = new Uint8Array(4096);
  fr4096DataArrayNormalized: Uint8Array = new Uint8Array(4096);

  fr8192Analyser: any;
  fr8192DataArray: Uint8Array = new Uint8Array(8192);
  fr8192DataArrayNormalized: Uint8Array = new Uint8Array(8192);

  fr16384Analyser: any;
  fr16384DataArray: Uint8Array = new Uint8Array(16384);
  fr16384DataArrayNormalized: Uint8Array = new Uint8Array(16384);

  gainNode: any;
  splitter: any;

  frAnalyser: any;
  frBufferLength: any;
  frDataLength: any;
  frDataArray;
  frDataArrayNormalized: any;

  frAnalyserAll: any;
  frBufferLengthAll: any;
  frDataLengthAll: any;
  frDataArrayAll;
  frDataArrayNormalizedAll: any;

  tdAnalyser: any;
  tdBufferLength: any;
  tdDataLength: any;
  tdDataArray;
  tdDataArrayNormalized: any;

  highTD = 0;
  lowTD = 256;

  tdHistory: any;

  tdHistoryArraySize = 64;

  sample1: Uint8Array = new Uint8Array(576);
  sample1Normalized: Uint8Array = new Uint8Array(576);
  // sample1Totals: any;
  // sample1Averages: any;

  soundArrays: any;
  analyzerArrays: any;

  options;

  constructor(
    public optionsService: OptionsService,
    public messageService: MessageService) {

    this.options = this.optionsService.getOptions();

    messageService.messageAnnounced$.subscribe(
      message => {
        // console.log("Audio Service: Message received from service is :  " + message);
        this.options = this.optionsService.getOptions();
        if (this.audio != null) {
          this.audio.volume = (this.options.volume.value) / 10;
          this.setGain();
        }
      });

    this.clearSampleArrays();
  }

  public setAudio = (audio: HTMLAudioElement) => {

    if (audio == null) {
      return;
    }

    this.audio = audio;

    // this.audio.volume = .7;
    this.audio.volume = (this.options.volume.value) / 10;

    // this.smoothingConstant = .9;
    // // this.maxAverages = 50;
    // this.minDecibels = -100;  // -100
    // this.maxDecibels = 0;   // -30
    // this.tdHistoryArraySize = 64;  // 4096

    this.audioCtx = new AudioContext();

    this.audioSrc = this.audioCtx.createMediaElementSource(this.audio); /* <<<<<<<<<<<<<<<<<<< */


    this.gainNode = this.audioCtx.createGain();
    this.splitter = this.audioCtx.createChannelSplitter(2);

    this.fr64Analyser = this.audioCtx.createAnalyser();
    this.fr64Analyser.fftSize = 128;
    this.fr64Analyser.minDecibels = this.minDecibels;
    this.fr64Analyser.maxDecibels = this.maxDecibels;
    this.fr64Analyser.smoothingTimeConstant = this.smoothingConstant;


    this.fr128Analyser = this.audioCtx.createAnalyser();
    this.fr128Analyser.fftSize = 256;
    this.fr128Analyser.minDecibels = this.minDecibels;
    this.fr128Analyser.maxDecibels = this.maxDecibels;
    this.fr128Analyser.smoothingTimeConstant = this.smoothingConstant;


    this.fr256Analyser = this.audioCtx.createAnalyser();
    this.fr256Analyser.fftSize = 512;
    this.fr256Analyser.minDecibels = this.minDecibels;
    this.fr256Analyser.maxDecibels = this.maxDecibels;
    this.fr256Analyser.smoothingTimeConstant = this.smoothingConstant;


    this.fr512Analyser = this.audioCtx.createAnalyser();
    this.fr512Analyser.fftSize = 1024;
    this.fr512Analyser.minDecibels = this.minDecibels;
    this.fr512Analyser.maxDecibels = this.maxDecibels;
    this.fr512Analyser.smoothingTimeConstant = this.smoothingConstant;


    this.fr1024Analyser = this.audioCtx.createAnalyser();
    this.fr1024Analyser.fftSize = 2048;
    this.fr1024Analyser.minDecibels = this.minDecibels;
    this.fr1024Analyser.maxDecibels = this.maxDecibels;
    this.fr1024Analyser.smoothingTimeConstant = this.smoothingConstant;


    this.fr2048Analyser = this.audioCtx.createAnalyser();
    this.fr2048Analyser.fftSize = 4096;
    this.fr2048Analyser.minDecibels = this.minDecibels;
    this.fr2048Analyser.maxDecibels = this.maxDecibels;
    this.fr2048Analyser.smoothingTimeConstant = this.smoothingConstant;


    this.fr4096Analyser = this.audioCtx.createAnalyser();
    this.fr4096Analyser.fftSize = 8192;
    this.fr4096Analyser.minDecibels = this.minDecibels;
    this.fr4096Analyser.maxDecibels = this.maxDecibels;
    this.fr4096Analyser.smoothingTimeConstant = this.smoothingConstant;


    this.fr8192Analyser = this.audioCtx.createAnalyser();
    this.fr8192Analyser.fftSize = 16384;
    this.fr8192Analyser.minDecibels = this.minDecibels;
    this.fr8192Analyser.maxDecibels = this.maxDecibels;
    this.fr8192Analyser.smoothingTimeConstant = this.smoothingConstant - .05;


    this.fr16384Analyser = this.audioCtx.createAnalyser();
    this.fr16384Analyser.fftSize = 32768;
    this.fr16384Analyser.minDecibels = this.minDecibels;
    this.fr16384Analyser.maxDecibels = this.maxDecibels;
    this.fr16384Analyser.smoothingTimeConstant = this.smoothingConstant - .1;



    this.frAnalyser = this.audioCtx.createAnalyser();
    this.frAnalyser.fftSize = 256;
    this.frAnalyser.minDecibels = this.minDecibels;
    this.frAnalyser.maxDecibels = this.maxDecibels;
    this.frAnalyser.smoothingTimeConstant = this.smoothingConstant;
    this.frBufferLength = this.frAnalyser.frequencyBinCount;
    this.frDataLength = this.frBufferLength;
    this.frDataArray = new Uint8Array(this.frBufferLength);
    this.frDataArrayNormalized = new Uint8Array(this.frBufferLength);

    this.frAnalyserAll = this.audioCtx.createAnalyser();
    this.frAnalyserAll.fftSize = 32768;
    this.frAnalyserAll.minDecibels = this.minDecibels;
    this.frAnalyserAll.maxDecibels = this.maxDecibels;
    this.frAnalyserAll.smoothingTimeConstant = this.smoothingConstant;
    this.frBufferLengthAll = this.frAnalyserAll.frequencyBinCount;
    this.frDataLengthAll = this.frBufferLengthAll;
    this.frDataArrayAll = new Uint8Array(this.frBufferLengthAll);
    this.frDataArrayNormalizedAll = new Uint8Array(this.frBufferLengthAll);


    this.tdAnalyser = this.audioCtx.createAnalyser();
    this.tdAnalyser.fftSize = 8192;
    // this.tdAnalyser.fftSize = 2048;
    this.tdAnalyser.minDecibels = this.minDecibels;
    this.tdAnalyser.maxDecibels = this.maxDecibels;
    this.tdAnalyser.smoothingTimeConstant = this.smoothingConstant;
    this.tdBufferLength = this.tdAnalyser.frequencyBinCount;
    this.tdDataLength = this.tdBufferLength;
    this.tdDataArray = new Uint8Array(this.tdBufferLength);
    this.tdDataArrayNormalized = new Uint8Array(this.frBufferLength);

    // this.tdHistory = [];
    this.tdHistory = Array(this.tdHistoryArraySize).fill(0);

    // this.sample1 = [];
    // this.sample1Normalized = [];
    // this.sample1Totals = [];
    // this.sample1Averages = [];

    this.clearSampleArrays();

    this.soundArrays = [
      this.fr64DataArray,
      this.fr128DataArray,
      this.fr256DataArray,
      this.fr512DataArray,
      this.fr1024DataArray,
      this.fr2048DataArray,
      this.fr4096DataArray,
      this.fr8192DataArray,
      this.fr16384DataArray
    ];

    this.analyzerArrays = [
      this.fr64Analyser,
      this.fr128Analyser,
      this.fr256Analyser,
      this.fr512Analyser,
      this.fr1024Analyser,
      this.fr2048Analyser,
      this.fr4096Analyser,
      this.fr8192Analyser,
      this.fr16384Analyser,
      this.frAnalyser,
      this.frAnalyserAll
    ];

    this.audioSrc.connect(this.tdAnalyser);
    this.tdAnalyser.connect(this.splitter);

    this.splitter.connect(this.gainNode, 0);
    this.splitter.connect(this.audioCtx.destination, 1);

    this.gainNode.connect(this.fr16384Analyser);
    this.fr16384Analyser.connect(this.fr8192Analyser);
    this.fr8192Analyser.connect(this.fr4096Analyser);
    this.fr4096Analyser.connect(this.fr2048Analyser);
    this.fr2048Analyser.connect(this.fr1024Analyser);
    this.fr1024Analyser.connect(this.fr512Analyser);
    this.fr512Analyser.connect(this.fr256Analyser);
    this.fr256Analyser.connect(this.fr128Analyser);
    this.fr128Analyser.connect(this.fr64Analyser);
    this.fr64Analyser.connect(this.frAnalyserAll);
    this.frAnalyserAll.connect(this.frAnalyser);

    // setInterval(this.analyzeData, 120);

  }

  analyzeData = () => {
    ////////////////////////////////////
    // get FREQUENCY data for this frame

    this.frAnalyser.getByteFrequencyData(this.frDataArray);
    this.frAnalyserAll.getByteFrequencyData(this.frDataArrayAll);

    this.fr64Analyser.getByteFrequencyData(this.fr64DataArray);
    this.fr128Analyser.getByteFrequencyData(this.fr128DataArray);
    this.fr256Analyser.getByteFrequencyData(this.fr256DataArray);
    this.fr512Analyser.getByteFrequencyData(this.fr512DataArray);
    this.fr1024Analyser.getByteFrequencyData(this.fr1024DataArray);
    this.fr2048Analyser.getByteFrequencyData(this.fr2048DataArray);
    this.fr4096Analyser.getByteFrequencyData(this.fr4096DataArray);
    this.fr8192Analyser.getByteFrequencyData(this.fr8192DataArray);
    this.fr16384Analyser.getByteFrequencyData(this.fr16384DataArray);

    // normalize the data   0..1
    this.frDataArrayNormalized = this.normalizeData(this.frDataArray);
    this.frDataArrayNormalizedAll = this.normalizeData(this.frDataArrayAll);

    // combine sample set
    for (let index = 0; index < 64; index++) { //  64*9 = 576

      this.sample1[index] = (this.soundArrays[8])[index];
      this.sample1[index + 64] = (this.soundArrays[8])[index + 64];
      this.sample1[index + 128] = (this.soundArrays[7])[index + 64];
      this.sample1[index + 192] = (this.soundArrays[6])[index + 64];
      this.sample1[index + 256] = (this.soundArrays[5])[index + 64];
      this.sample1[index + 320] = (this.soundArrays[4])[index + 64];
      this.sample1[index + 384] = (this.soundArrays[3])[index + 64];
      this.sample1[index + 448] = (this.soundArrays[2])[index + 64];
      this.sample1[index + 512] = (this.soundArrays[1])[index + 64];

    }

    // get highest,lowest and average FREQUENCIES for this frame
    let frCurrentHigh = 0;
    let frCurrentLow = 255;

    this.sample1.forEach((f, i) => {
      if (f > frCurrentHigh) {
        frCurrentHigh = f;
      }

      if (f < frCurrentLow) {
        frCurrentLow = f;
      }

      // this.sample1Totals[i].values.push(f / 10); //  /255
      // if (this.sample1Totals[i].values.length > this.maxAverages) {
      //   this.sample1Totals[i].values.shift()
      // };

      // let total = 0;
      // this.sample1Totals[i].values.forEach(v => {
      //   total += v;
      // })
      // this.sample1Averages[i].value = total / this.sample1Totals[i].values.length;
    });

    // this.sample1Normalized = this.normalizeData(this.sample1);


    //////////////////////////////////////
    // get TIME DOMAIN data for this frame

    this.tdAnalyser.getByteTimeDomainData(this.tdDataArray);

    // get the highest for this frame
    // this.highTD = 0;
    // this.lowTD = 256;
    // this.tdDataArray.forEach(d => {
    //   if (d > this.highTD) {
    //     this.highTD = d;
    //   }
    //   if (d < this.lowTD) {
    //     this.lowTD = d;
    //   }
    // });

    // normalize the data   0..1
    this.tdDataArrayNormalized = this.normalizeData(this.tdDataArray);

    // TODO: historical data for wave form       TODO:    TODO:
    this.tdHistory.push(this.highTD);
    if (this.tdHistory.length > this.tdHistoryArraySize) {
      this.tdHistory.shift();
    }
  }

  normalizeData(sourceData) {
    const multiplier = Math.pow(Math.max(...sourceData), -1) || 0;
    return sourceData.map(n => n * multiplier * 255);
  }

  clearSampleArrays() {

    for (let index = 0; index < 576; index++) {
      this.sample1[index] = 0;
      this.sample1Normalized[index] = 0;
      // this.sample1Totals[index] = {
      //   index: index,
      //   values: []
      // };
      // this.sample1Averages[index] = {
      //   index: index,
      //   values: []
      // };
    }
  }

  buildSampleArrays() {
    this.sample1.fill(0, 0, 575);
    // for (let index = 0; index < 576; index++) {
    //   this.sample1Normalized[index] = 0;
    //   this.sample1Totals[index] = {
    //     index: index,
    //     values: []
    //   };
    //   this.sample1Averages[index] = {
    //     index: index,
    //     values: []
    //   };
    // }
  }

  // getNormalizedSample() {
  //   return this.sample1Normalized;
  // }

  getSample() {
    // return this.sample1;
    if (this.sample1) {
      return [...this.sample1];
    } else {
      return null;
    }
  }

  getTDData() {
    if (this.tdDataArray) {
      return [...this.tdDataArray];
    } else {
      return null;
    }
  }

  setGain() {
    this.gainNode.gain.setValueAtTime(this.optionsService.options.sampleGain.value, this.audioCtx.currentTime);
  }
}
