import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import * as moment from 'moment';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { OptionsService } from '../../services/options/options.service';
import { AudioService } from '../../services/audio/audio.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-my-player',
  templateUrl: './my-player.component.html',
  styleUrls: ['./my-player.component.css'],
  animations: [
    trigger('playerOpenClose', [
      state('playerOpen', style({
        bottom: '10px'
      })),
      state('playerClosed', style({
        bottom: '-100px'
      })),
      transition('playerOpen => playerClosed', [
        animate('1s')
      ]),
      transition('playerClosed => playerOpen', [
        animate('1s')
      ]),
    ]),
  ]
})

export class MyPlayerComponent implements OnInit, OnDestroy, AfterViewInit {

  audio: HTMLAudioElement;
  fileInput;
  subscription: Subscription;
  options;

  siteTracks = [];
  userTracks = [];
  playList = [];
  currentTrack = 0;
  duration = 0;
  currentTime = 0;
  currentVolume = 7;
  playing = false;

  constructor(
    public optionsService: OptionsService,
    public audioService: AudioService,
    public messageService: MessageService,
    private sanitizer: DomSanitizer) {

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        if (message === 'track change') {
          this.currentTrack = this.optionsService.state.currentTrack.value;
          this.selectTrack(this.currentTrack);
        }
        if (message === 'site list selection') {
          this.loadSiteTracks();
        }
        if (message === 'local list selection') {
          this.fileInput.click();
        }

        console.log('Audio Player: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
      });

    this.siteTracks = [
      {
        title: 'A Good Bass for Gambling',
        link: './assets/tracks/A Good Bass for Gambling.mp3'
      },
      {
        title: 'Ambient Bongos',
        link: './assets/tracks/Ambient Bongos.mp3'
      },
      {
        title: 'Arpent',
        link: './assets/tracks/Arpent.mp3'
      },
      {
        title: 'Barroom Ballet',
        link: './assets/tracks/Barroom Ballet.mp3'
      },
      {
        title: 'Bass Meant Jazz',
        link: './assets/tracks/Bass Meant Jazz.mp3'
      },
      {
        title: 'Celebration',
        link: './assets/tracks/Celebration.mp3'
      },
      {
        title: 'City Sunshine',
        link: './assets/tracks/City Sunshine.mp3'
      },
      {
        title: 'Creepy Hallow',
        link: './assets/tracks/Creepy Hallow.mp3'
      },
      {
        title: 'Foam Rubber',
        link: './assets/tracks/Foam Rubber.mp3'
      },
      {
        title: 'Funkeriffic',
        link: './assets/tracks/Funkeriffic.mp3'
      },
      {
        title: 'Hippety Hop',
        link: './assets/tracks/Hippety Hop.mp3'
      },
      {
        title: 'Monsters in Hotel',
        link: './assets/tracks/Monsters in Hotel.mp3'
      },
      {
        title: 'Ukulele Song',
        link: './assets/tracks/Ukulele Song.mp3'
      },
      {
        title: 'Shepard Tone',
        link: './assets/tracks/Shepard-tone.mp3'
      }
    ];

    this.playList = this.siteTracks;
    this.optionsService.updateState('playlist', this.playList);

    this.currentTrack = 0;
    this.optionsService.updateState('currentTrack', this.currentTrack);

    this.options = this.optionsService.getOptions();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.audio = document.getElementsByTagName('audio')[0] as HTMLAudioElement;
    this.fileInput = document.getElementById('fileInput');

    this.audio.onended = () => {
      this.nextTrack();
    };

    this.audio.ontimeupdate = () => {
      this.timeUpdate();
    };

    this.audioService.setAudio(this.audio);
    this.optionsService.windowResize();

    this.setPlaySource();
    this.playPause();
    // this.getDuration();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  setPlaySource() {
    // console.log('setting play source');
    this.audio.src = this.playList[this.currentTrack].link;
    // console.log('duration after src: ' + this.audio.duration);
    this.currentTime = 0;
    this.duration = 0;
    // console.log(this.audio.src);
  }

  playPause() {
    // play track - playList[currentTrack]
    if (this.audio.paused) {
      this.audio.play();
      // console.log('duration after play: ' + this.audio.duration);
      this.audio.play()
        .then(() => {
          // console.log('Audio Successfully Playing');
          this.playing = true;
          this.getDuration();
        })
        .catch(() => {
          // console.log('Audio Failed Playing');
        });

    } else {
      this.audio.pause();
      this.playing = false;
    }
  }

  selectTrack(index) {
    this.audio.pause();

    this.currentTrack = index;
    this.optionsService.updateState('currentTrack', this.currentTrack);

    this.setPlaySource();
    this.playPause();
  }

  previousTrack() {
    // stop play
    this.audio.pause();

    // dec currentTrack, wrap if necessary
    this.currentTrack--;
    if (this.currentTrack < 0) {
      this.currentTrack = this.playList.length - 1;
    }
    this.optionsService.updateState('currentTrack', this.currentTrack);

    // play track - playList[currentTrack]
    this.setPlaySource();
    this.playPause();
  }

  nextTrack() {
    // stop play
    this.audio.pause();

    // inc currentTrack, wrap if necessary
    this.currentTrack++;
    if (this.currentTrack > this.playList.length - 1) {
      this.currentTrack = 0;
    }
    this.optionsService.updateState('currentTrack', this.currentTrack);

    // play track - playList[currentTrack]
    this.setPlaySource();
    this.playPause();
  }

  onSliderChangeVolume(e) {
    this.setVolume(e.target.value);
  }

  setVolume(volume) {
    this.audio.volume = volume / 10;
    this.currentVolume = volume;
    this.optionsService.updateOption('volume', volume);
    this.messageService.announceMessage('volume change');
  }

  onSliderChangeTime(e) {
    // console.log(e);
    this.seekTo(e.target.value);
  }

  seekTo(seconds) {
    // console.log('second in seek to: ' + seconds);
    this.audio.currentTime = seconds;
    this.currentTime = seconds;
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  getDuration() {
      this.duration = this.audio.duration || 0;
  }

  timeUpdate() {
    this.currentTime = this.audio.currentTime;
  }

  loadSiteTracks() {
    console.log('loading site tracks');

    // stop play
    this.audio.pause();

    // set currentTrack to 0;
    this.currentTrack = 0;
    this.optionsService.updateState('currentTrack', this.currentTrack);

    // load site tracks selection into playList
    this.playList = this.siteTracks;
    this.optionsService.updateState('playlist', this.playList);

    // play first track - playList[currentTrack]
    this.setPlaySource();
    this.playPause();
  }

  loadUserTracks() {
    if (this.userTracks === []) {
      return;
    }

    // stop play
    this.audio.pause();

    // set currentTrack to 0;
    this.currentTrack = 0;
    this.optionsService.updateState('currentTrack', this.currentTrack);

    // load user tracks selection into playList
    this.playList = this.userTracks;
    this.optionsService.updateState('playlist', this.playList);

    // play first track - playList[currentTrack]
    this.setPlaySource();
    this.playPause();
  }

  public fileChangeEvent(fileInput: any) {
    this.userTracks = [];

    for (let index = 0; index < fileInput.target.files.length; index++) {
      const element = fileInput.target.files[index];
      // console.log(element.name);
      // console.log(URL.createObjectURL(fileInput.target.files[index]));
      this.userTracks.push(
        {
          title: element.name,
          // link: this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(fileInput.target.files[index]))
          link: URL.createObjectURL(fileInput.target.files[index])
        }
      );
    }
    // console.log(this.userTracks);

    if (this.userTracks === []) {
      // console.log('returning due to null');
      return;
    }

    this.loadUserTracks();
  }

}
