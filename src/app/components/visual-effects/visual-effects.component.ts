import { Component, AfterViewInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-visual-effects',
  templateUrl: './visual-effects.component.html',
  styleUrls: ['./visual-effects.component.css']
})
export class VisualEffectsComponent implements AfterViewInit {
  @ViewChild('graduate') graduate: ElementRef;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService
  ) {
    messageService.messageAnnounced$.subscribe(
      message => {
        if (message === 'scene change') {
          setTimeout( () => {
            this.resetGraduate();
          }, 100);
        }
      });
  }

  ngAfterViewInit() {
    this.resetGraduate();
  }

  colorChange(e) {
    this.messageService.announceMessage(e.target.id);
    this.resetGraduate();
  }

  resetGraduate() {
    if (this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].colorOptions === true) {
      const opt = this.optionsService.newBaseOptions;
      const percent = Math.round((opt.visual[opt.currentVisual].customColors.midLoc.value / 255) * 100);
      this.graduate.nativeElement.style.background = 'linear-gradient(to right, ' +
        opt.visual[opt.currentVisual].customColors.color[2].value + ',' +
        opt.visual[opt.currentVisual].customColors.color[1].value + ' ' + percent + '% ,' +
        opt.visual[opt.currentVisual].customColors.color[0].value + ')';
    }
  }

}
