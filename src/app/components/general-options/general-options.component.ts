import { Component, Inject } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-general-options',
  templateUrl: './general-options.component.html',
  styleUrls: ['./general-options.component.css']
})
export class GeneralOptionsComponent {

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService
  ) { }

  radioNoteChange(e) {
    this.optionsService.toggleNoteRadioNew(e.target.id, e.target.value);
  }

  updateItem(e) {
    // console.log(e.target.id);
    this.messageService.announceMessage(e.target.id);
  }
}
