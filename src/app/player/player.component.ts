import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { CloudService } from '../cloud.service';
import { StreamState } from '../stream-state';
import { Subscription } from 'rxjs';

// import { AuthService } from '../auth.service';

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

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
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

export class PlayerComponent implements OnInit, OnDestroy, AfterViewInit {
  files: Array<any> = [];
  state: StreamState;
  currentFile: any = {};

  audio: HTMLAudioElement;

  subscription: Subscription;

  options;

  constructor(
    private playerService: PlayerService,
    cloudService: CloudService,
    public optionsService: OptionsService,
    public audioService: AudioService,
    public messageService: MessageService) {
    // get media files
    cloudService.getFiles().subscribe(files => {
      this.files = files;
    });

    // listen to stream state
    this.playerService.getState()
    .subscribe(pstate => {
      this.state = pstate;
    });

    this.subscription = messageService.messageAnnounced$.subscribe(
      message => {
        console.log('Audio Player: Message received from service is :  ' + message);
        this.options = this.optionsService.getOptions();
        // if (message === 'selectSiteMusic') {
        //   console.log('selecting site music');
        //   this.selectSiteMusic();
        // } else if (message === 'selectUserMusic') {
        //   console.log('selecting user music');
        //   this.selectUserMusic();
        // }
      });


  }

  ngOnInit( ) {
    this.options = this.optionsService.getOptions();
  }

  ngAfterViewInit(): void {
    // this.audio = document.getElementsByTagName('audio')[0] as HTMLAudioElement;

    // console.log('audio: ');
    // console.log(this.audio);

    setTimeout(() => {
      // this.audio = document.getElementsByTagName('audio')[0] as HTMLAudioElement;
      // this.audioService.setAudio(this.audio);
      this.optionsService.windowResize();
    }, 50);

  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  playStream(url) {
    this.playerService.playStream(url)
    .subscribe(events => {
      // listening for fun here
    });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.playerService.stop();
    this.playStream(file.url);
  }

  pause() {
    this.playerService.pause();
  }

  play() {
    this.playerService.play();
  }

  stop() {
    this.playerService.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change) {
    this.playerService.seekTo(change.value);
  }
}
