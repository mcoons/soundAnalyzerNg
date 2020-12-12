
import { Component, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { EngineService } from '../../services/engine/engine.service';

@Component({
  selector: 'app-canvas3-d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.css']
})

export class Canvas3DComponent implements AfterViewInit {
  @ViewChild('rendererCanvas', { static: true }) private rendererCanvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasEffects', { static: true }) private canvasEffects: ElementRef<HTMLCanvasElement>;
  @ViewChild('tmp', { static: true }) private tmpCanvas: ElementRef<HTMLCanvasElement>;

  constructor(
    @Inject(EngineService) private engineService: EngineService
  ) { }

  ngAfterViewInit(): void {
    this.engineService.createScene(this.rendererCanvas, this.canvasEffects, this.tmpCanvas);
    this.engineService.animate();
  }

}
