
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { OptionsService } from '../options/options.service';
import { MessageService } from '../message/message.service';

import { WindowRefService } from '../window-ref/window-ref.service';

@Injectable({
  providedIn: 'root'
})

export class AudioService {

  audio: HTMLAudioElement = null;
  audioSrc: any;
  audioCtx: any;
  micSrc;
  streams;
  lastVolume;

  minDecibels = -100;
  maxDecibels = 0;  // -30;
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

  tdAnalyser: any;
  tdBufferLength: any;
  tdDataLength: any;
  tdDataArray;
  tdDataArrayNormalized: any;

  highTD = 0;
  lowTD = 256;

  lastHigh = 0;

  highFreq = 0;

  tdHistory = [];

  tdHistoryArraySize = 150;

  sample1: Uint8Array = new Uint8Array(576);
  sample1Normalized: Uint8Array = new Uint8Array(576);
  sample1BufferHistory = [];

  sampleAve: Uint8Array = new Uint8Array(576);

  soundArrays: any;
  analyzersArray: any;

  constructor(
    public optionsService: OptionsService,
    public messageService: MessageService,
    private windowRef: WindowRefService) {

    messageService.messageAnnounced$.subscribe(
      message => {
        // console.log('Audio Service: Message received from service is :  ' + message);
        if (this.audio != null && message === 'volume change') {
          this.audio.volume = (this.optionsService.volume) / 10;
        }
        if (this.audio != null && message === 'sampleGain') {
          this.setGain();
        }
        if (this.audio != null && message === 'smoothingConstant') {
          // console.log(this.optionsService.smoothingConstant);
          this.smoothingConstant = this.optionsService.smoothingConstant / 10;
          this.setSmoothingConstant();
        }
      });

    this.clearSampleArrays();

  }

  public setAudio = (audio: HTMLAudioElement) => {

    if (audio == null) {
      return;
    }

    this.audio = audio;
    this.audio.volume = (this.optionsService.volume) / 10;

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
    this.fr4096Analyser.smoothingTimeConstant = this.smoothingConstant * .8;


    this.fr8192Analyser = this.audioCtx.createAnalyser();
    this.fr8192Analyser.fftSize = 16384;
    this.fr8192Analyser.minDecibels = this.minDecibels;
    this.fr8192Analyser.maxDecibels = this.maxDecibels;
    this.fr8192Analyser.smoothingTimeConstant = this.smoothingConstant * .6;


    this.fr16384Analyser = this.audioCtx.createAnalyser();
    this.fr16384Analyser.fftSize = 32768;
    this.fr16384Analyser.minDecibels = this.minDecibels;
    this.fr16384Analyser.maxDecibels = this.maxDecibels;
    this.fr16384Analyser.smoothingTimeConstant = this.smoothingConstant * .4;

    this.tdAnalyser = this.audioCtx.createAnalyser();
    // this.tdAnalyser.fftSize = 16384;
    this.tdAnalyser.fftSize = 1024;
    this.tdAnalyser.minDecibels = this.minDecibels;
    this.tdAnalyser.maxDecibels = this.maxDecibels;
    this.tdAnalyser.smoothingTimeConstant = this.smoothingConstant;
    this.tdBufferLength = this.tdAnalyser.frequencyBinCount;
    this.tdDataLength = this.tdBufferLength;
    this.tdDataArray = new Uint8Array(this.tdBufferLength);
    this.tdDataArrayNormalized = new Uint8Array(this.tdBufferLength);

    // this.tdHistory = Array(this.tdHistoryArraySize).fill(0);

    this.clearSampleArrays();

    this.analyzersArray = [
      this.fr64Analyser,
      this.fr128Analyser,
      this.fr256Analyser,
      this.fr512Analyser,
      this.fr1024Analyser,
      this.fr2048Analyser,
      this.fr4096Analyser,
      this.fr8192Analyser,
      this.fr16384Analyser
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

    for (let index = 0; index < 151; index++) {

      let frTemp = [];
      frTemp = Array(572).fill(0);
      this.sample1BufferHistory.push(frTemp);
    }

    for (let index = 0; index < this.tdHistoryArraySize; index++) {
      let tdTemp = [];
      tdTemp = Array(this.tdBufferLength).fill(0);
      this.tdHistory.push(tdTemp);
    }

    this.soundArrays = [
      this.fr64DataArray,  // 0
      this.fr128DataArray, // 1
      this.fr256DataArray,
      this.fr512DataArray,
      this.fr1024DataArray,
      this.fr2048DataArray,
      this.fr4096DataArray,
      this.fr8192DataArray,
      this.fr16384DataArray // 8
    ];

    // setInterval( () => {
    //   if (this.audio != null) {
    //     this.analyzeData();
    //   }
    // }, 10);
    this.setGain();

    this.smoothingConstant = this.optionsService.smoothingConstant / 10;
    this.setSmoothingConstant();

  }


  analyzeData = () => {
    ////////////////////////////////////
    // get FREQUENCY data for this frame
    if (true) {
      this.fr64Analyser.getByteFrequencyData(this.fr64DataArray);
      this.fr128Analyser.getByteFrequencyData(this.fr128DataArray);
      this.fr256Analyser.getByteFrequencyData(this.fr256DataArray);
      this.fr512Analyser.getByteFrequencyData(this.fr512DataArray);
      this.fr1024Analyser.getByteFrequencyData(this.fr1024DataArray);
      this.fr2048Analyser.getByteFrequencyData(this.fr2048DataArray);
      this.fr4096Analyser.getByteFrequencyData(this.fr4096DataArray);
      this.fr8192Analyser.getByteFrequencyData(this.fr8192DataArray);
      this.fr16384Analyser.getByteFrequencyData(this.fr16384DataArray);
    }
    // combine sample set

    for (let index = 0; index < 64; index++) { //  64*9 = 576
      this.sample1[index + 0] = (this.soundArrays[8])[index];        // 16384
      this.sample1[index + 64] = (this.soundArrays[8])[index + 64];   // 16384
      this.sample1[index + 128] = (this.soundArrays[7])[index + 64];   // 8192
      this.sample1[index + 192] = (this.soundArrays[6])[index + 64];   // 4096
      this.sample1[index + 256] = (this.soundArrays[5])[index + 64];   // 2048
      this.sample1[index + 320] = (this.soundArrays[4])[index + 64];   // 1024
      this.sample1[index + 384] = (this.soundArrays[3])[index + 64];   // 512
      this.sample1[index + 448] = (this.soundArrays[2])[index + 64];   // 256 buckets
      this.sample1[index + 512] = (this.soundArrays[1])[index + 64];   // 128 buckets
    }

    // const averageBuckets = (s, e) => {
    //   let total = 0;
    //   for (let i = s; i <= e; i++) {
    //     total += this.fr16384DataArray[i];
    //   }
    //   return total / (e - s + 1);
    // };

    // const windowSize = 64;   // will be 64
    // const windowCount = 8;  // will be 8

    // let targetIndex = 0;
    // let startIndex = 0;
    // let endIndex = 0;

    // for (let span = 0; span < windowCount; span++) {

    //   for (let seq = 0; seq < windowSize; seq++) {

    //     endIndex = startIndex + Math.pow(2, span) - 1;
    //     this.sampleAve[targetIndex] = averageBuckets(startIndex, endIndex);
    //     startIndex += Math.pow(2, span);
    //     targetIndex++;
    //   }
    // }




    this.sample1BufferHistory.push(this.sample1.slice(0));
    if (this.sample1BufferHistory.length > 150) {
      this.sample1BufferHistory.shift();
    }

    // get highest,lowest and average FREQUENCIES for this frame
    let frCurrentHigh = 0;
    let frCurrentLow = 255;
    let frHighIndex = 0;

    this.sample1.forEach((f, i) => {
      if (f > frCurrentHigh) {
        frCurrentHigh = f;
        frHighIndex = i;
      }

      if (f < frCurrentLow) {
        frCurrentLow = f;
      }

    });

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
    // this.tdDataArrayNormalized = this.normalizeData(this.tdDataArray);

    // TODO: historical data for wave form       TODO:    TODO:
    this.tdHistory.push(this.tdDataArray.slice(0));
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
      this.sampleAve[index] = 0;
      this.sample1Normalized[index] = 0;
    }
  }

  buildSampleArrays() {
    this.sample1.fill(0, 0, 575);
  }

  // getNormalizedSample() {
  //   return this.sample1Normalized;
  // }

  getSample() {
    if (this.sample1) {
      return [...this.sample1];
    } else {
      return null;
    }
  }


  getSampleAve() {
    if (this.sampleAve) {
      return [...this.sampleAve];
    } else {
      return null;
    }
  }

  getSample512() {
    if (this.fr512DataArray) {
      return [...this.fr512DataArray];
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
    this.gainNode.gain.setValueAtTime(this.optionsService.sampleGain, this.audioCtx.currentTime);
  }

  setSmoothingConstant() {
    // this.analyzersArray.forEach(aa => {
    //   aa.smoothingTimeConstant = this.optionsService.smoothingConstant / 10;
    // });
    this.fr64Analyser.smoothingTimeConstant = this.smoothingConstant;
    this.fr128Analyser.smoothingTimeConstant = this.smoothingConstant;
    this.fr256Analyser.smoothingTimeConstant = this.smoothingConstant;
    this.fr512Analyser.smoothingTimeConstant = this.smoothingConstant;
    this.fr1024Analyser.smoothingTimeConstant = this.smoothingConstant;
    this.fr2048Analyser.smoothingTimeConstant = this.smoothingConstant;
    this.fr4096Analyser.smoothingTimeConstant = this.smoothingConstant * .8;
    this.fr8192Analyser.smoothingTimeConstant = this.smoothingConstant * .6;
    this.fr16384Analyser.smoothingTimeConstant = this.smoothingConstant * .4;

  }

  disableMic() {

    // console.log('in disable mic');

    if (!this.optionsService.microphone) {
      return;
    }

    this.streams.getTracks().forEach((track) => {
      track.stop();
    });

    this.micSrc.disconnect(this.tdAnalyser);
    this.audioSrc.connect(this.tdAnalyser);

    this.optionsService.microphone = false;
    this.optionsService.volume = this.lastVolume;
    this.audio.volume = this.lastVolume / 10;

    this.optionsService.renderPlayer = true;
    this.splitter.connect(this.audioCtx.destination, 1);

  }

  enableMic = () => {

    if (this.optionsService.microphone) {
      return;
    }

    if (!hasGetUserMedia()) {
      alert('getUserMedia() is not supported by your browser');
      return;
    }

    function errorMsg(msg, error) {
      alert('Error: ' + msg);
      if (typeof error !== 'undefined') {
        console.error(error);
      }
    }

    function hasGetUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    this.audio.pause();
    this.optionsService.playing = false;

    const constraints = { audio: true };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((streams) => {
        this.streams = streams;
        this.micSrc = this.audioCtx.createMediaStreamSource(streams);

        this.optionsService.microphone = true;
        this.optionsService.input = 'mic';

        this.lastVolume = this.optionsService.volume;
        this.optionsService.volume = 0;
        this.audio.volume = 0;
        this.optionsService.renderPlayer = false;

        this.splitter.disconnect(this.audioCtx.destination, 1);
        this.audioSrc.disconnect(this.tdAnalyser);
        this.micSrc.connect(this.tdAnalyser);
      })
      .catch((error) => {
        if (error.name === 'PermissionDeniedError') {
          errorMsg('Permissions have not been granted to use your camera and ' +
            'microphone, you need to allow the page access to your devices in ' +
            'order for the demo to work.', 'PermissionDeniedError');
        }
        errorMsg('getUserMedia error: ' + error.name, error);

      });

  }
}

// 12th root of 2 for 1 key


// Low f           64                 +               64              High f          64-128 of 128
//         64      +       64         +        64      +       64                     64-128 of 256
//     64  +   64  +   64  +   64     +    64  +   64  +   64  +   64                 64-128 of 512
//   64+64 + 64+64 + 64+64 + 64+64    +  64+64 + 64+64 + 64+64 + 64+64                64-128 of 1024
//                                                                                    64-128 of 2048
//                                                                                    64-128 of 4096
//                                                                                    64-128 of 8182
//                                                                                    0-128 of 16384

//                                                                             32*9  =  288

//                                                                             0-287 objects
