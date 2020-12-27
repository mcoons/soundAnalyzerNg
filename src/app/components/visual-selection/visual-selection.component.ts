import { Component, Inject } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-visual-selection',
  templateUrl: './visual-selection.component.html',
  styleUrls: ['./visual-selection.component.css']
})
export class VisualSelectionComponent {

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService
  ) {}


  spsChange(e) {

    const value = e.target.checked;

    const isMatch = (element) => element.label === e.target.id ;
    const typeIndex = this.optionsService.newBaseOptions.visual[0].types.findIndex(isMatch);

    if ((!value && this.optionsService.getSelectedCubeSPSCount() > 1) || value) {
      this.optionsService.newBaseOptions.visual[0].types[typeIndex].value = value;
      this.messageService.announceMessage('sps change');
    } else {
      this.optionsService.newBaseOptions.visual[0].types[typeIndex].value = !value;
      (document.getElementById(e.target.id) as HTMLInputElement).checked = true;
    }

    this.messageService.announceMessage('sps change');

  }

  radioChange(e) {

    this.optionsService.newBaseOptions.visual.forEach(v => {
      v.checked = (e.target.id === v.label);
    });

    this.optionsService.updateState('currentVisual', e.target.value);
    this.optionsService.newBaseOptions.currentVisual = Number(e.target.value);

    this.messageService.announceMessage('scene change');
    this.messageService.announceMessage('set lights');
    this.messageService.announceMessage('set camera');
    this.messageService.announceMessage('Smoothing Constant');
    this.messageService.announceMessage('Visual Effect Strength');
  }

}
