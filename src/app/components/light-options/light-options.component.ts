import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-light-options',
  templateUrl: './light-options.component.html',
  styleUrls: ['./light-options.component.css']
})
export class LightOptionsComponent implements OnInit {

  constructor(    @Inject(OptionsService) public optionsService: OptionsService,
  @Inject(MessageService) private messageService: MessageService) { }

  ngOnInit(): void {
  }

  colorChange(e) {
    console.log('In colorChange');
    this.messageService.announceMessage('set lights');
  }

}
