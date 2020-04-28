import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { OptionsService } from '../options.service';
import { AudioService } from '../Audio.service';

import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit, OnDestroy {
  @Input('title') title: string;

  subscription: Subscription;

  options;

  constructor(
    public optionsService: OptionsService,
    public audioService: AudioService,
    public messageService: MessageService) {

    messageService.messageAnnounced$.subscribe(
      message => {
        console.log("Title: Message received from service is :  " + message);
        this.options = this.optionsService.getOptions();
      });
  }

  ngOnInit() {
    this.options = this.optionsService.getOptions();
  }


  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}

