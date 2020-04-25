import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-canvas2-d',
  templateUrl: './canvas2-d.component.html',
  styleUrls: ['./canvas2-d.component.css']
})
export class Canvas2DComponent implements OnInit {

  // @ViewChild('canvas', { static: false })
  // @ViewChild('canvas', {static: false}) canvas: HTMLCanvasElement;

  // canvas: ElementRef<HTMLCanvasElement>;  
  
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
    // console.log(document.getElementById("canvas2d"));
    // this.ctx = this.canvas.nativeElement.getContext('2d');
    // let canvas = document.getElementById("canvas2d");
    // this.ctx = canvas.getContext('2d');

    this.canvas = <HTMLCanvasElement> document.getElementById('canvas2d');
    this.ctx = this.canvas.getContext('2d');

    console.log("ctx: "+ this.ctx);
    this.ctx.fillStyle = "blue";  
    this.ctx.fillRect(this.canvas.width/2 -50, 0, 100, this.canvas.height );
  }
}
