import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-visual-selection',
  templateUrl: './visual-selection.component.html',
  styleUrls: ['./visual-selection.component.css']
})
export class VisualSelectionComponent implements OnInit {

  public currentVisualIndex;
  public currentVisual;
  public general;
  public visuals;


  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService
  ) {

  }

  ngOnInit(): void {
    this.visuals = this.optionsService.newBaseOptions.visual;
    this.currentVisualIndex = this.optionsService.newBaseOptions.currentVisual;
    this.currentVisual = this.visuals[this.currentVisualIndex];
    this.general = this.optionsService.newBaseOptions.general;
  }

  spsChange(e) {

    let value = e.target.checked;

    let isMatch = (element) => element.label === e.target.id ;
    let typeIndex = this.optionsService.newBaseOptions.visual[0].types.findIndex(isMatch);

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
    this.messageService.announceMessage('Smoothing Constant');
    this.messageService.announceMessage('Visual Effect Strength');
  }

}
