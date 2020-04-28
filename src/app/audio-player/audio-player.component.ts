import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { OptionsService } from '../options.service';
import { AudioService } from '../Audio.service';
import { Track } from 'ngx-audio-player';

import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit, OnDestroy {
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

    messageService.messageAnnounced$.subscribe(
      message => {
        console.log("Audio Player: Message received from service is :  " + message);
        this.options = this.optionsService.getOptions();
        // console.log("xx"+this.options["volume"].value);
        // console.log("xv"+this.audio.volume);
        this.audio = <HTMLAudioElement>document.getElementsByTagName('audio')[0];
        this.audio.volume = (this.options["volume"].value)/10;
        // console.log(this.audio.volume);
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

    this.audio = <HTMLAudioElement>document.getElementsByTagName('audio')[0];
    this.audio.volume = (this.options["volume"].value)/10;

    // console.log("playercomponent-Audio:");
    // console.log(this.audio);
    // console.log("playercomponent-Audio Source:");
    // console.log(this.audio.src);

    this.audioService.setAudio(this.audio);
    // console.log(this.audio.volume);

    // setInterval(this.audioService.logAudioInfo,1000);

  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
