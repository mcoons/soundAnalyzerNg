
import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';

import { EngineService } from '../../services/engine/engine.service';

@Component({
  selector: 'app-canvas3-d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.css']
})

export class Canvas3DComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererCanvas', { static: true }) private rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(
    @Inject(EngineService) private engineService: EngineService) { }

  ngAfterViewInit(): void {

    this.engineService.createScene(this.rendererCanvas);
    this.engineService.animate();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // this.subscription.unsubscribe();
  }

}
