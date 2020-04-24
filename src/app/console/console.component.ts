import { Component, OnInit, Input } from '@angular/core';
import { OptionsService } from '../options.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  objectKeys = Object.keys;

  constructor(public optionsService: OptionsService) { }

  ngOnInit() {
  }

}
