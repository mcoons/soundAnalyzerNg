import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-canvas3-d',
  templateUrl: './canvas3-d.component.html',
  styleUrls: ['./canvas3-d.component.css']
})
export class Canvas3DComponent implements OnInit {

  @ViewChild('canvas3D') canvas3D: ElementRef;
  

  ngOnInit(): void {

  }

  constructor() { }


}
