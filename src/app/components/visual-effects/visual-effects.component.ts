import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-visual-effects',
  templateUrl: './visual-effects.component.html',
  styleUrls: ['./visual-effects.component.css']
})
export class VisualEffectsComponent implements OnInit {

  public currentVisualIndex;
  public currentVisual;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService
  ) {

   }

  ngOnInit(): void {
    this.currentVisualIndex = this.optionsService.newBaseOptions.currentVisual;
    this.currentVisual = this.optionsService.newBaseOptions.visual[this.currentVisualIndex];
  }

}
