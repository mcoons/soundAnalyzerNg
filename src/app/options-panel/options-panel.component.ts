import { Component, OnInit, OnDestroy  } from '@angular/core';
import { OptionsService } from '../options.service';

import { MessageService }     from '../message.service';
import { Subscription }   from 'rxjs';


@Component({
  selector: 'app-options-panel',
  templateUrl: './options-panel.component.html',
  styleUrls: ['./options-panel.component.css']
})
export class OptionsPanelComponent implements OnInit {

  objectKeys = Object.keys;

  subscription: Subscription;

  constructor(public optionsService: OptionsService, 
              public messageService: MessageService) { 

    messageService.messageAnnounced$.subscribe(
      message => {
        console.log("Options Panel: Message received from service is :  " + message );
      });
  }

  ngOnInit() {
    setTimeout(() => {
      this.optionsService.options["showPlayer"].value = false;
    }, 10);
    setTimeout(() => {
      this.optionsService.options["showPlayer"].value = true;
    }, 11);

  }

  toggleItem(e){
    // console.log(e.target.name);
    this.optionsService.toggle(e.target.name);
    this.announceChange("Item was changed: " + e.target.name + " to " + this.optionsService.options[e.target.name].value);
  }

  announceChange(message: string) {
    this.messageService.announceMessage(message);
  }
  
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
