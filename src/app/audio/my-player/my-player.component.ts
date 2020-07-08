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
  // @ViewChild('playerDiv', { static: false }) playerDiv: ElementRef<HTMLDivElement>;


  // audio: HTMLAudioElement;
  // fileInput;
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
          // this.selectTrack(this.optionsService.getState().currentTrack.value);
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
        // console.log('Audio Player: Message received from service is :  ' + message);
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
    this.optionsService.updateState('currentTrack', 0);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // this.audio.nativeElement = document.getElementsByTagName('audio')[0] as HTMLAudioElement;
    // this.fileInput.nativeElement = document.getElementById('fileInput');
    // console.log('myPlayer - this.playerDiv');
    // console.log(this.playerDiv);

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

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  randomizeList() {

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

  setPlaySource() {
    this.audio.nativeElement.src = this.playList[this.optionsService.currentTrack].link;
    this.currentTime = 0;
    this.duration = 0;
  }

  playPause() {
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

  selectTrack(index: number) {
    this.audio.nativeElement.pause();
    this.optionsService.updateState('currentTrack', index);
    this.setPlaySource();
    this.playPause();
  }

  previousTrack() {
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

  nextTrack() {
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

  onSliderChangeVolume(e) {
    this.audio.nativeElement.volume = this.optionsService.volume  / 10;
    // this.messageService.announceMessage('volume change');

  }

  onSliderChangeTime(e) {
    this.seekTo(e.target.value);
  }

  seekTo(seconds) {
    this.audio.nativeElement.currentTime = seconds;
    this.currentTime = seconds;
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  getDuration() {
    this.duration = this.audio.nativeElement.duration || 0;
  }

  timeUpdate() {
    this.currentTime = this.audio.nativeElement.currentTime;
  }

  loadSiteTracks() {
    this.audio.nativeElement.pause();
    this.optionsService.updateState('currentTrack', 0);
    this.playList = this.siteTracks;
    this.optionsService.updateState('playlist', this.playList);
    this.optionsService.input = 'site';
    this.setPlaySource();
    this.playPause();
  }

  loadUserTracks() {
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

  public fileChangeEvent(fileInput: any) {

    // console.log('entered file change event');
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

  togglePlayer() {
    this.optionsService.toggleState('renderPlayer');
  }

}
