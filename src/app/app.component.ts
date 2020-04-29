import { Component, OnInit } from '@angular/core';

import { OptionsService } from './options.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Music Visualyzer Ng';

  constructor(public optionsService: OptionsService) {}

  ngOnInit() {
  }

  togglePanel() {
    this.optionsService.toggleOption('showPanel');
  }

}
