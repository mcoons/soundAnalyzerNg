import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title : String = 'Sound Analyzer Ng';

  // consoleData : Object = {
  //   alpha: 0,
  //   beta: 0,
  //   raduis: 0,
  //   siteIndex: 0
  // };

  ngOnInit() {
    // this.consoleData["test"] = "testing";
  }

}
