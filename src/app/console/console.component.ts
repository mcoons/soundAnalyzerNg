import { Component, OnInit, Input } from '@angular/core';
import { OptionsService } from '../options.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {
  // @Input('consoleData') consoleData: Object;

  objectKeys = Object.keys;

  constructor(private optionsService: OptionsService) { }

  ngOnInit() {
  }

}
