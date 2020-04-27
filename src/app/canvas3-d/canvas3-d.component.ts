import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { OptionsService } from '../options.service';
import { AudioService } from '../Audio.service';

import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canvas3-d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.css']
})
export class Canvas3DComponent implements OnInit {

  @ViewChild('canvas3D') canvas3D: ElementRef;
  

  ngOnInit(): void {

  }

  subscription: Subscription;

  constructor(public optionsService: OptionsService, 
              public audioService:   AudioService, 
              public messageService: MessageService) {

      messageService.messageAnnounced$.subscribe(
        message => {
          console.log("Canvas3D: Message received from service is :  " + message);
        });
   }

   ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

}
