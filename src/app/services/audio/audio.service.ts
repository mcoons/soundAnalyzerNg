
import { Injectable } from '@angular/core';
// import { Subscription } from 'rxjs';

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

  // minDecibels = -100;
  // maxDecibels = -30; 

  minDecibels = -90;
  maxDecibels = -10; 

  smoothingConstant = .9;

  fr16Analyser: any;
  fr16DataArray: Uint8Array = new Uint8Array(16);

  fr32Analyser: any;
  fr32DataArray: Uint8Array = new Uint8Array(32);

  fr64Analyser: any;
  fr64DataArray: Uint8Array = new Uint8Array(64);

  fr128Analyser: any;
  fr128DataArray: Uint8Array = new Uint8Array(128);

  fr256Analyser: any;
  fr256DataArray: Uint8Array = new Uint8Array(256);

  fr512Analyser: any;
  fr512DataArray: Uint8Array = new Uint8Array(512);

  fr1024Analyser: any;
  fr1024DataArray: Uint8Array = new Uint8Array(1024);

  fr2048Analyser: any;
  fr2048DataArray: Uint8Array = new Uint8Array(2048);

  fr4096Analyser: any;
  fr4096DataArray: Uint8Array = new Uint8Array(4096);

  fr8192Analyser: any;
  fr8192DataArray: Uint8Array = new Uint8Array(8192);

  fr16384Analyser: any;
  fr16384DataArray: Uint8Array = new Uint8Array(16384);

  gainNode: any;
  splitter: any;
  splitter2: any;

  tdAnalyser: any;
  tdBufferLength: any;
  tdDataArray;
  tdDataArrayNormalized: any;

  tdMaxHistory = [];

  sample1: Uint8Array = new Uint8Array(576);
  sample1BufferHistory = [];
  sample1Topper = [];

  sample2: Uint8Array = new Uint8Array(224);

  soundArrays: any;
  analyzersArray: any;

  // private noteStr = ['G ', 'G#', 'A ', 'A#', 'B ', 'C ', 'C#', 'D ', 'D#', 'E ', 'F ', 'F#'];
  // private noteIndex = [73, 77, 82, 87, 92, 33, 39, 45, 52, 58, 65, 69];

  // freq sample1 bucket index per note  +/- 64 for octives
  private noteIndex = [137, 141, 146, 151, 156, 161, 167, 173, 180, 186, 129, 133];

  noteAvgs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  constructor(
    public optionsService: OptionsService,
    public messageService: MessageService,
    private windowRef: WindowRefService) {
    console.log('Audio Service Constructor');

    messageService.messageAnnounced$.subscribe(
      message => {
        if (this.audio != null && message === 'volume change') {
          this.audio.volume = (this.optionsService.volume) / 10;
        }
        if (this.audio != null && message === 'Visual Effect Strength') {
          this.setGain();
        }
        if (this.audio != null && message === 'Smoothing Constant') {
          // tslint:disable-next-line: max-line-length
          this.smoothingConstant = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].smoothingConstant.value / 10;
          this.setSmoothingConstant();
        }
      });

    this.clearSampleArrays();

  }

  public setAudio = (audio: HTMLAudioElement) => {

    if (audio == null) {
      return;
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

    this.audio = audio;
    this.audio.volume = (this.optionsService.volume) / 10;

    this.audioCtx = new AudioContext();
    this.audioSrc = this.audioCtx.createMediaElementSource(this.audio); /* <<<<<<<<<<<<<<<<<<< */

    this.gainNode = this.audioCtx.createGain();
    this.splitter = this.audioCtx.createChannelSplitter(2);
    this.splitter2 = this.audioCtx.createChannelSplitter(11);

    this.fr16Analyser = this.audioCtx.createAnalyser();
    this.fr32Analyser = this.audioCtx.createAnalyser();
    this.fr64Analyser = this.audioCtx.createAnalyser();
    this.fr128Analyser = this.audioCtx.createAnalyser();
    this.fr256Analyser = this.audioCtx.createAnalyser();
    this.fr512Analyser = this.audioCtx.createAnalyser();
    this.fr1024Analyser = this.audioCtx.createAnalyser();
    this.fr2048Analyser = this.audioCtx.createAnalyser();
    this.fr4096Analyser = this.audioCtx.createAnalyser();
    this.fr8192Analyser = this.audioCtx.createAnalyser();
    this.fr16384Analyser = this.audioCtx.createAnalyser();

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

    this.analyzersArray.forEach( (analyzer, i) => {
        analyzer.minDecibels = this.minDecibels;
        analyzer.maxDecibels = this.maxDecibels;
        analyzer.smoothingTimeConstant = this.smoothingConstant;
        analyzer.fftSize = Math.pow(2, i + 7);
    });

    
    this.fr16Analyser.fftSize = 32;
    this.fr16Analyser.minDecibels = this.minDecibels;
    this.fr16Analyser.maxDecibels = this.maxDecibels;
    this.fr16Analyser.smoothingTimeConstant = this.smoothingConstant;

    this.fr32Analyser.fftSize = 64;
    this.fr32Analyser.minDecibels = this.minDecibels;
    this.fr32Analyser.maxDecibels = this.maxDecibels;
    this.fr32Analyser.smoothingTimeConstant = this.smoothingConstant;

    this.tdAnalyser = this.audioCtx.createAnalyser();
    this.tdAnalyser.fftSize = 1024;
    // this.tdAnalyser.minDecibels = this.minDecibels;
    // this.tdAnalyser.maxDecibels = this.maxDecibels;
    // this.tdAnalyser.smoothingTimeConstant = this.smoothingConstant;
    this.tdBufferLength = this.tdAnalyser.frequencyBinCount;
    this.tdDataArray = new Uint8Array(this.tdBufferLength);

    this.audioSrc.connect(this.tdAnalyser);
    this.tdAnalyser.connect(this.splitter);

    this.splitter.connect(this.audioCtx.destination, 1);
    this.splitter.connect(this.gainNode, 0);

    this.gainNode.connect(this.splitter2);

    // splitter 2

    this.splitter2.connect(this.fr16384Analyser);
    this.splitter2.connect(this.fr8192Analyser);
    this.splitter2.connect(this.fr4096Analyser);
    this.splitter2.connect(this.fr2048Analyser);
    this.splitter2.connect(this.fr1024Analyser);
    this.splitter2.connect(this.fr512Analyser);
    this.splitter2.connect(this.fr256Analyser);
    this.splitter2.connect(this.fr128Analyser);
    this.splitter2.connect(this.fr64Analyser);
    this.splitter2.connect(this.fr32Analyser);
    this.splitter2.connect(this.fr16Analyser);


    for (let index = 0; index < 151; index++) {
      let frTemp = [];
      frTemp = Array(572).fill(0);
      this.sample1BufferHistory.push(frTemp);
    }

    for (let index = 0; index < 576; index++) {
      // this.sample1Topper[index] = 0;
      this.sample1Topper[index] = {
        value: 0,
        age: 0
      };
    }

    this.setGain();

    // tslint:disable-next-line: max-line-length
    this.smoothingConstant = this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].smoothingConstant.value / 10;
    this.setSmoothingConstant();

  }


  analyzeData = () => {
    ////////////////////////////////////
    // get FREQUENCY data for this frame

    this.analyzersArray.forEach( (element, i) => {
      element.getByteFrequencyData(this.soundArrays[i]);
    });

    this.fr16Analyser.getByteFrequencyData(this.fr16DataArray);
    this.fr32Analyser.getByteFrequencyData(this.fr32DataArray);

    // combine for sample set
    for (let index = 0; index < 64; index++) { //  64*9 = 576
      this.sample1[index + 0] = (this.soundArrays[8])[index];          // 16384
      this.sample1[index + 64] = (this.soundArrays[8])[index + 64];    // 16384
      this.sample1[index + 128] = (this.soundArrays[7])[index + 64];   // 8192
      this.sample1[index + 192] = (this.soundArrays[6])[index + 64];   // 4096
      this.sample1[index + 256] = (this.soundArrays[5])[index + 64];   // 2048
      this.sample1[index + 320] = (this.soundArrays[4])[index + 64];   // 1024
      this.sample1[index + 384] = (this.soundArrays[3])[index + 64];   // 512
      this.sample1[index + 448] = (this.soundArrays[2])[index + 64];   // 256 buckets
      this.sample1[index + 512] = (this.soundArrays[1])[index + 64];   // 128 buckets
    }

    this.sample1BufferHistory[this.sample1BufferHistory.length] = this.sample1.slice(0);

    if (this.sample1BufferHistory.length > 150) {
      this.sample1BufferHistory.reverse();
      this.sample1BufferHistory.pop();
      this.sample1BufferHistory.reverse();
    }

    // this.soundArrays = [
    //   this.fr64DataArray,  // 0
    //   this.fr128DataArray, // 1
    //   this.fr256DataArray,
    //   this.fr512DataArray,
    //   this.fr1024DataArray,
    //   this.fr2048DataArray,  // 5
    //   this.fr4096DataArray,
    //   this.fr8192DataArray,
    //   this.fr16384DataArray // 8
    // ];


    // combine for sample2 set
    for (let index = 0; index < 32; index++) { //  32*7 = 224
      this.sample2[index + 0] = (this.soundArrays[5])[index];          
      this.sample2[index + 32] = (this.soundArrays[5])[index + 32];    
      this.sample2[index + 64] = (this.soundArrays[4])[index + 32];   
      this.sample2[index + 96] = (this.soundArrays[3])[index + 32];  
      this.sample2[index + 128] = (this.soundArrays[2])[index + 32];  
      this.sample2[index + 160] = (this.soundArrays[1])[index + 32];  
      this.sample2[index + 192] = (this.soundArrays[0])[index + 32];  
    }

    //////////////////////////////////////
    // get TIME DOMAIN data for this frame

    this.tdAnalyser.getByteTimeDomainData(this.tdDataArray);

    let tdMin = 500;
    let tdMax = 0;

    this.tdDataArray.forEach(d => {
      if (d < tdMin) {
        tdMin = d;
      }
      if (d > tdMax) {
        tdMax = d;
      }
    });

    this.tdMaxHistory.push(tdMax);

    if (this.tdMaxHistory.length > 125) {
      this.tdMaxHistory.shift();
    }

    // private noteStr = ['G ', 'G#', 'A ', 'A#', 'B ', 'C ', 'C#', 'D ', 'D#', 'E ', 'F ', 'F#'];
    // private noteIndex = [73, 77, 82, 87, 92, 33, 39, 45, 52, 58, 65, 69];

    const historyPeek = 5;


    this.noteIndex.forEach((n, i) => {

      const temp = ( // this.sample1BufferHistory[this.sample1BufferHistory.length - historyPeek + 1][n] +
        this.sample1BufferHistory[this.sample1BufferHistory.length - historyPeek + 1][n + 64] +
        this.sample1BufferHistory[this.sample1BufferHistory.length - historyPeek + 1][n + 128] +
        this.sample1BufferHistory[this.sample1BufferHistory.length - historyPeek + 1][n + 192] // +
        // this.sample1BufferHistory[this.sample1BufferHistory.length - historyPeek + 1][n + 256] //+
        // this.sample1BufferHistory[this.sample1BufferHistory.length - historyPeek + 1][n + 320]
        ) / 3;


      const temp2 = ( // this.sample1BufferHistory[this.sample1BufferHistory.length - 1][n] +
        this.sample1BufferHistory[this.sample1BufferHistory.length - 1][n + 64] +
        this.sample1BufferHistory[this.sample1BufferHistory.length - 1][n + 128] +
        this.sample1BufferHistory[this.sample1BufferHistory.length - 1][n + 192] // +
        // this.sample1BufferHistory[this.sample1BufferHistory.length - 1][n + 256] //+
        // this.sample1BufferHistory[this.sample1BufferHistory.length - 1][n + 320]
        ) / 3;

      this.noteAvgs[i] = this.noteAvgs[i] - 1 / historyPeek * temp;
      this.noteAvgs[i] = this.noteAvgs[i] + 1 / historyPeek * temp2;

    });

    // console.log(this.noteAvgs);

  }

  clearSampleArrays() {
    for (let index = 0; index < 576; index++) {
      this.sample1[index] = 0;
    }
  }

  setGain() {
    // tslint:disable-next-line: max-line-length
    this.gainNode.gain.setValueAtTime(this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].sampleGain.value, this.audioCtx.currentTime);
  }

  setSmoothingConstant() {

    this.analyzersArray.forEach(element => {
      element.smoothingTimeConstant = this.smoothingConstant;
    });

    this.fr16Analyser.smoothingTimeConstant = this.smoothingConstant;
    this.fr32Analyser.smoothingTimeConstant = this.smoothingConstant;

  }

  disableMic() {

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
