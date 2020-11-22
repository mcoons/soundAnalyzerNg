import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation, Inject, ElementRef, ViewChild } from '@angular/core';
import { OptionsService } from '../../services/options/options.service';
import { MessageService } from '../../services/message/message.service';

@Component({
  selector: 'app-visual-effects',
  templateUrl: './visual-effects.component.html',
  styleUrls: ['./visual-effects.component.css']
})
export class VisualEffectsComponent implements OnInit, AfterViewInit {
  @ViewChild('graduate', { static: true }) graduate: ElementRef;

  // public currentVisualIndex;
  // public currentVisual;
  // public general;

  constructor(
    @Inject(OptionsService) public optionsService: OptionsService,
    @Inject(MessageService) private messageService: MessageService
  ) {
    messageService.messageAnnounced$.subscribe(
      message => {
        if (message === 'scene change') {
          // this.currentVisualIndex = this.optionsService.newBaseOptions.currentVisual;
          // this.currentVisual = this.optionsService.newBaseOptions.visual[this.currentVisualIndex];
          // this.general = this.optionsService.newBaseOptions.general;
        }
      });
  }

  ngOnInit(): void {
    // this.currentVisualIndex = this.optionsService.newBaseOptions.currentVisual;
    // this.currentVisual = this.optionsService.newBaseOptions.visual[this.currentVisualIndex];
    // this.general = this.optionsService.newBaseOptions.general;
  }

  ngAfterViewInit() {
    console.log('Values on ngAfterViewInit():');
    console.log("graduate:", this.graduate);
    // setTimeout(() => {
    //   const percent = Math.round((this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.midLoc.value / 255) * 100);
    //   this.graduate.nativeElement.style.background = 'linear-gradient(to right, ' +
    //     this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.color[0].value + ',' +
    //     this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.color[1].value + ' ' + percent + '% ,' +
    //     this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.color[2].value + ')';
    // }, 10);
  }

  updateItem(e) {
    console.log(e.target.id);
    this.messageService.announceMessage(e.target.id);
  }

  colorChange(e) {

  //   const percent = Math.round((this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.midLoc.value / 255) * 100);
  //   // tslint:disable-next-line: max-line-length
  //   this.graduate.nativeElement.style.background = 'linear-gradient(to right, ' +
  //     this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.color[0].value + ',' +
  //     this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.color[1].value + ' ' + percent + '% ,' +
  //     this.optionsService.newBaseOptions.visual[this.optionsService.newBaseOptions.currentVisual].customColors.color[2].value + ')';

  }


}
