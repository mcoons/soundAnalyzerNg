
import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
// import { Subscription, Observable, fromEvent } from 'rxjs';

// import { MessageService } from '../../services/message/message.service';
import { EngineService } from '../../services/engine/engine.service';

@Component({
  selector: 'app-canvas3-d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.css']
})

export class Canvas3DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererCanvas', { static: true }) private rendererCanvas: ElementRef<HTMLCanvasElement>;

  // private subscription: Subscription;

  // resizeObservable$: Observable<Event>;
  // resizeSubscription$: Subscription;

  constructor(
    // @Inject(MessageService) public messageService: MessageService,
    @Inject(EngineService) private engineService: EngineService) {
    console.log('In 3d Component constructor');

    // this.subscription = messageService.messageAnnounced$.subscribe(
    //   message => {
    //     // console.log('Canvas3D: Message received from service is :  ' + message);
    //   });
  }

  ngAfterViewInit(): void {
    // this.fixDpi();


    this.engineService.createScene(this.rendererCanvas);
    // this.rendererCanvas.nativeElement.addEventListener('resize', this.engineService.engine.resize);
    this.engineService.animate();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // this.subscription.unsubscribe();
  }

  // fixDpi = () => {
  //   const dpi = window.devicePixelRatio;
  //   const styles = window.getComputedStyle(this.rendererCanvas.nativeElement);

  //   // create a style object that returns width and height
  //   const style = {
  //     height() {
  //       return +styles.height.slice(0, -2);
  //     },
  //     width() {
  //       return +styles.width.slice(0, -2);
  //     }
  //   };

  //   // set the correct canvas attributes for device dpi
  //   this.rendererCanvas.nativeElement.setAttribute('width', (style.width() * dpi).toString());
  //   this.rendererCanvas.nativeElement.setAttribute('height', (style.height() * dpi).toString());
  // }
}
