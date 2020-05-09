
import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Track } from 'ngx-audio-player';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

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
        bottom: '-700px'
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

export class AudioPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() playlist: Track[];
  @Input() autoPlay: true;
  @Input() displayTitle: true;
  @Input() displayPlaylist: true;
  @Input() pageSizeOptions = [2, 4];
  @Input() expanded = true;
  @Input() displayVolumeControls = false;

  msaapDisplayTitle;
  msaapDisplayPlayList;
  msaapPageSizeOptions;
  msaapDisplayVolumeControls;
  msaapExpanded;
  msaapAutoPlay;

  msaapPlaylist: Track[];

  audio: HTMLAudioElement;

  subscription: Subscription;

  siteTracks;
  userTracks;

  options;

  constructor(
    public optionsService: OptionsService,
    public audioService: AudioService,
    public messageService: MessageService,
    private sanitizer: DomSanitizer) {

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        // console.log('Audio Player: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
        this.msaapDisplayTitle = this.options.showTrackTitle.value;
      });
  }

  ngOnInit() {
    // Material Style Advance Audio Player Playlist
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

    this.msaapPlaylist = this.siteTracks;
    this.options = this.optionsService.getOptions();

    this.msaapDisplayTitle = this.options.showTrackTitle.value;
    this.msaapDisplayPlayList = true;
    this.msaapPageSizeOptions = [2, 4];
    this.msaapDisplayVolumeControls = false;
    this.msaapExpanded = true;
    this.msaapAutoPlay = true;
  }

  ngAfterViewInit(): void {
    this.audio = document.getElementsByTagName('audio')[0] as HTMLAudioElement;

    // setTimeout(() => {
    this.audioService.setAudio(this.audio);
    this.optionsService.windowResize();
    // }, 50);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  public fileChangeEvent(fileInput: any) {



  // (document.querySelector('#playerDIV > mat-advanced-audio-player > mat-card.mat-card.mat-focus-indicator.d-flex.justify-content-center.ngx-advanced-audio-player.z-depth-1.mat-elevation-z2 > button.mat-focus-indicator.p-1.play-pause.mat-button.mat-button-base')  ).click();





    console.log(fileInput.target.files.length);

    console.log(fileInput.target.files);

    this.userTracks = [];

    for (let index = 0; index < fileInput.target.files.length; index++) {
      const element = fileInput.target.files[index];
      console.log(element.name);
      console.log(URL.createObjectURL(fileInput.target.files[index]));
      this.userTracks.push(
        {
          title: element.name,
          link: this.sanitizer.bypassSecurityTrustResourceUrl( URL.createObjectURL(fileInput.target.files[index]))
        }
      );
    }
console.log(this.userTracks);
    this.msaapPlaylist = this.userTracks;
  }
}

