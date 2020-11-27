import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-general-options',
  templateUrl: './general-options.component.html',
  styleUrls: ['./general-options.component.css']
})
export class GeneralOptionsComponent implements OnInit {

  public currentVisualIndex;
  public currentVisual;
  public general;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.currentVisualIndex = this.optionsService.newBaseOptions.currentVisual;
    this.currentVisual = this.optionsService.newBaseOptions.visual[this.currentVisualIndex];
    this.general = this.optionsService.newBaseOptions.general;
  }

  radioNoteChange(e) {
    this.optionsService.toggleNoteRadioNew(e.target.id, e.target.value);
  }

  updateItem(e) {
    console.log(e.target.id);
    this.messageService.announceMessage(e.target.id);
  }
}
