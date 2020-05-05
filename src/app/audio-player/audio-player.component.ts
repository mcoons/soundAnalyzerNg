
import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Track } from 'ngx-audio-player';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

import { OptionsService } from '../options.service';
import { AudioService } from '../audio.service';
import { MessageService } from '../message.service';

declare var $: any;

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css'],

  animations: [
    trigger('playerOpenClose', [
      state('playerOpen', style({
        bottom: '10px'
      })),
      state('playerClosed', style({
        bottom: '-550px'
      })),
      transition('playerOpen => playerClosed', [
        animate('.5s')
      ]),
      transition('playerClosed => playerOpen', [
        animate('.5s')
      ]),
    ]),
  ]
})

export class AudioPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() playlist: Track[];
  @Input() autoPlay: true;
  @Input() displayTitle: true;
  @Input() displayPlaylist: true;
  @Input() pageSizeOptions = [2, 4];
  @Input() expanded = true;
  @Input() displayVolumeControls = true;

  msaapDisplayTitle;
  msaapDisplayPlayList;
  msaapPageSizeOptions;
  msaapDisplayVolumeControls;
  msaapExpanded;
  msaapAutoPlay;

  msaapPlaylist: Track[];

  audio: HTMLAudioElement;

  subscription: Subscription;

  options;

  constructor(
    public optionsService: OptionsService,
    public audioService: AudioService,
    public messageService: MessageService) {

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        console.log('Audio Player: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
        this.msaapDisplayTitle = this.options.showTrackTitle.value;
        if (message === 'selectSiteMusic') {
          console.log('selecting site music');
          this.selectSiteMusic();
        } else if (message === 'selectUserMusic') {
          console.log('selecting user music');
          this.selectUserMusic();
        }
      });
  }

  ngOnInit() {
    // Material Style Advance Audio Player Playlist
    this.msaapPlaylist = [
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
      }

    ];

    this.options = this.optionsService.getOptions();

    this.msaapDisplayTitle = this.options.showTrackTitle.value;
    this.msaapDisplayPlayList = true;
    this.msaapPageSizeOptions = [2, 4];
    this.msaapDisplayVolumeControls = true;
    this.msaapExpanded = true;
    this.msaapAutoPlay = true;
  }

  ngAfterViewInit(): void {
    this.audio = document.getElementsByTagName('audio')[0] as HTMLAudioElement;

    setTimeout(() => {
      // this.audio = document.getElementsByTagName('audio')[0] as HTMLAudioElement;
      this.audioService.setAudio(this.audio);
      this.optionsService.windowResize();
    }, 50);

  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  selectUserMusic() {
    // this.audio.pause();
    // document.querySelector('#playerDIV > mat-advanced-audio-player > mat-card.mat-card.mat-focus-indicator.d-flex.justify-content-center.ngx-advanced-audio-player.z-depth-1.mat-elevation-z2 > button.mat-focus-indicator.p-1.play-pause.mat-button.mat-button-base')[0].click();

    this.msaapPlaylist = [
      {
        title: 'Monsters in Hotel',
        link: './assets/tracks/Monsters in Hotel.mp3'
      },
      {
        title: 'Ukulele Song',
        link: './assets/tracks/Ukulele Song.mp3'
      }

    ];

  }

  selectSiteMusic() {
    // this.audio.pause();
    // document.querySelector('#playerDIV > mat-advanced-audio-player > mat-card.mat-card.mat-focus-indicator.d-flex.justify-content-center.ngx-advanced-audio-player.z-depth-1.mat-elevation-z2 > button.mat-focus-indicator.p-1.play-pause.mat-button.mat-button-base')[0].click();
    this.msaapPlaylist = [
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
      }

    ];

  }

}

