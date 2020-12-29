import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
// import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
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
      state('playerOpen',
        style({
          bottom: '0px'
        })),
      state('playerClosed',
        style({
          bottom: '-130px'
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
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef<HTMLInputElement>;
  @ViewChild('audio', { static: true }) audio: ElementRef<HTMLAudioElement>;

  subscription: Subscription;
  siteTracks = [];
  userTracks = [];
  playList = [];
  duration = 0;
  currentTime = 0;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(AudioService) public audioService: AudioService,
    @Inject(MessageService) public messageService: MessageService,
    // private sanitizer: DomSanitizer
  ) {

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        if (message === 'track change') {
          this.selectTrack(this.optionsService.currentTrack);
        }
        if (message === 'site list selection') {
          this.loadSiteTracks();
        }
        if (message === 'local list selection') {
          this.fileInput.nativeElement.click();
        }
        if (message === 'playPause') {
          this.playPause();
        }
        if (message === 'previousTrack') {
          this.previousTrack();
        }
        if (message === 'nextTrack') {
          this.nextTrack();
        }
        if (message === 'volume change') {
          this.onSliderChangeVolume(null);
        }
        if (message === 'randomize list') {
          this.randomizeList();
        }
      });

    this.siteTracks = [
      {
        title: 'A Good Bass for Gambling',
        link: './assets/tracks/A Good Bass for Gambling.mp3'
      },
      {
        title: 'Bass Meant Jazz',
        link: './assets/tracks/Bass Meant Jazz.mp3'
      },
      {
        title: 'Funkeriffic',
        link: './assets/tracks/Funkeriffic.mp3'
      },
      {
        title: 'Shepard Tone',
        link: './assets/tracks/Shepard-tone.mp3'
      }
    ];

    this.playList = this.siteTracks;
    this.optionsService.updateState('playlist', this.playList);
    this.optionsService.updateState('currentTrack', 0);
  }

  ngOnInit(): void {
    null;
  }

  ngAfterViewInit(): void {

    this.audio.nativeElement.onended = () => {
      this.nextTrack();
    };

    this.audio.nativeElement.ontimeupdate = () => {
      this.timeUpdate();
    };

    this.audioService.setAudio(this.audio.nativeElement);
    this.optionsService.windowResize();
    this.setPlaySource();
    this.playPause();
  }

  ngOnDestroy(): void {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  randomizeList(): void {

    function shuffle(array) {
      let currentIndex = array.length;
      let temporaryValue;
      let randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    if (!this.audio.nativeElement.paused) {
      this.playPause();
    }

    shuffle(this.playList);

    this.optionsService.updateState('playlist', this.playList);
    this.selectTrack(0);
    this.optionsService.updateState('currentTrack', 0);
    this.setPlaySource();
    this.playPause();
  }

  setPlaySource(): void {
    this.audio.nativeElement.src = this.playList[this.optionsService.currentTrack].link;
    this.currentTime = 0;
    this.duration = 0;
  }

  playPause(): void {
    if (this.audio.nativeElement.paused) {
      this.audio.nativeElement.play()
        .then(() => {
          this.optionsService.updateState('playing', true);
          this.getDuration();
        })
        .catch(() => {
          console.log('Audio Failed Playing');
        });
    } else {
      this.audio.nativeElement.pause();
      this.optionsService.updateState('playing', false);
    }
  }

  selectTrack(index: number): void {
    this.audio.nativeElement.pause();
    this.optionsService.updateState('currentTrack', index);
    this.setPlaySource();
    this.playPause();
  }

  previousTrack(): void {
    this.audio.nativeElement.pause();
    let ct = this.optionsService.currentTrack;
    ct--;
    if (ct < 0) {
      ct = this.playList.length - 1;
    }
    this.optionsService.updateState('currentTrack', ct);
    this.setPlaySource();
    this.playPause();
  }

  nextTrack(): void {
    this.audio.nativeElement.pause();
    let ct = this.optionsService.currentTrack;
    ct++;
    if (ct > this.playList.length - 1) {
      ct = 0;
    }
    this.optionsService.updateState('currentTrack', ct);
    this.setPlaySource();
    this.playPause();
  }

  onSliderChangeVolume(e): void {
    this.audio.nativeElement.volume = this.optionsService.volume / 10;
  }

  onSliderChangeTime(e): void {
    this.seekTo(e.target.value);
  }

  seekTo(seconds: number): void {
    this.audio.nativeElement.currentTime = seconds;
    this.currentTime = seconds;
  }

  formatTime(time: number, format = 'HH:mm:ss'): string {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  getDuration(): void {
    this.duration = this.audio.nativeElement.duration || 0;
  }

  timeUpdate(): void {
    this.currentTime = this.audio.nativeElement.currentTime;
  }

  loadSiteTracks(): void {
    this.audio.nativeElement.pause();
    this.optionsService.updateState('currentTrack', 0);
    this.playList = this.siteTracks;
    this.optionsService.updateState('playlist', this.playList);
    this.optionsService.input = 'site';
    this.setPlaySource();
    this.playPause();
  }

  loadUserTracks(): void {
    if (this.userTracks.length === 0) {
      return;
    }
    this.audio.nativeElement.pause();
    this.optionsService.updateState('currentTrack', 0);
    this.playList = this.userTracks;
    this.optionsService.updateState('playlist', this.playList);
    this.optionsService.input = 'local';
    this.setPlaySource();
    this.playPause();
  }

  public fileChangeEvent(fileInput): void {

    const newUserTracks = [];

    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < fileInput.target.files.length; index++) {
      const element = fileInput.target.files[index];
      newUserTracks.push(
        {
          title: element.name,
          // link: this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(fileInput.target.files[index]))
          link: URL.createObjectURL(fileInput.target.files[index])
        }
      );
    }

    if (newUserTracks.length === 0) {
      console.log('user tracks length = 0');

      return;
    }
    this.userTracks = [...newUserTracks];

    this.loadUserTracks();
  }

  togglePlayer(): void {
    this.optionsService.toggleState('renderPlayer');
  }

}
