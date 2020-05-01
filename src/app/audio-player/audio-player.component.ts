import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { OptionsService } from '../options.service';
import { AudioService } from '../audio.service';
import { Track } from 'ngx-audio-player';

import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

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
        bottom: '-100px'
      })),
      transition('playerOpen => playerClosed', [
        animate('.2s')
      ]),
      transition('playerClosed => playerOpen', [
        animate('.2s')
      ]),
    ]),
  ]

})
export class AudioPlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() playlist: Track[];
  @Input() autoPlay: true;
  @Input() displayTitle: true;
  @Input() displayPlaylist: true;
  @Input() pageSizeOptions = [2, 4, 6];
  @Input() expanded = false;
  @Input() displayVolumeControls = true;

  msaapDisplayTitle = false;
  msaapDisplayPlayList = true;
  msaapPageSizeOptions = [2, 4, 6];
  msaapDisplayVolumeControls = true;

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
        title: 'Arpent',
        link: './assets/tracks/Arpent.mp3'
      },
      {
        title: 'Arpent',
        link: './assets/tracks/Arpent.mp3'
      },
      {
        title: 'Arpent',
        link: './assets/tracks/Arpent.mp3'
      },
      {
        title: 'Arpent',
        link: './assets/tracks/Arpent.mp3'
      },
      {
        title: 'Arpent',
        link: './assets/tracks/Arpent.mp3'
      },


    ];

    this.options = this.optionsService.getOptions();
  }

  ngAfterViewInit(): void {
    this.audio = document.getElementsByTagName('audio')[0] as HTMLAudioElement;

    setTimeout( () => {
      // this.audio = document.getElementsByTagName('audio')[0] as HTMLAudioElement;
      this.audioService.setAudio(this.audio);
    } , 50 );

    console.log('playercomponent-Audio:');
    console.log(this.audio);

    const playerDiv = document.getElementById('player') as HTMLElement;
    console.log('playerDiv client height = ' + playerDiv.clientHeight);
    console.log('playerDiv offset height = ' + playerDiv.offsetHeight);
    console.log('playerDiv scroll height = ' + playerDiv.scrollHeight);

    const canvas = document.getElementById('canvas2d') as HTMLCanvasElement;
    console.log('canvas2D = ');
    console.log(canvas);

    console.log('window = ');
    console.log(window);

    console.log('window.devicePixelRatio = ' + window.devicePixelRatio);
    console.log('window.innerHeight = ' + window.innerHeight );
    console.log('window.outerHeight = ' + window.outerHeight );
    // console.log('window.visualViewport.height = ' + window.visualViewport.height );



    // console.log("playercomponent-Audio Source:");
    // console.log(this.audio.src);

  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
